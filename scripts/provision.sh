#!/usr/bin/env bash
# Provision a new brochure site created from this template.
#
#   cp scripts/provision.env.example provision.env   # fill it in (gitignored)
#   ./scripts/provision.sh                           # every step, asking first
#   ./scripts/provision.sh sanity hook               # only some steps
#   ./scripts/provision.sh --dry-run                 # print, change nothing
#
# Steps, in order (see SETUP.md):
#   rename   Replace the template's names with the client slug (local files)
#   env      Write the public build values to .env.production
#   worker   Create the Worker with a first deploy of the current build
#   github   Repo settings and the CI variables for the CMS e2e test
#   builds   Connect Workers Builds: main deploys, other branches preview
#   hook     Create the Workers Builds deploy hook and point a Sanity
#            publish webhook at it, so publishing content rebuilds the site
#   sanity   CORS for the hosted Studio, and deploy the Studio
#   email    (launch only, not run by default) Resend secrets for the form
#
# Runs on the Cloudflare free plan: no R2, D1 or paid features. Every step
# that changes something outside this folder asks first unless --yes is
# given, and re-running a step reuses what exists.
set -euo pipefail
cd "$(dirname "$0")/.."

DRY_RUN=false
ASSUME_YES=false
STEPS=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --yes) ASSUME_YES=true ;;
    -h | --help) sed -n '2,26p' "$0"; exit 0 ;;
    *) STEPS+=("$arg") ;;
  esac
done
[[ ${#STEPS[@]} -eq 0 ]] && STEPS=(rename env worker github builds hook sanity)

# shellcheck disable=SC1091
[[ -f provision.env ]] && set -a && source provision.env && set +a
STATE_FILE=.provision-state
# shellcheck disable=SC1090
[[ -f "$STATE_FILE" ]] && source "$STATE_FILE"

TEMPLATE_SLUG="talasi-astro-template"

need() {
  local missing=()
  for name in "$@"; do [[ -n "${!name:-}" ]] || missing+=("$name"); done
  if [[ ${#missing[@]} -gt 0 ]]; then
    echo "Missing in provision.env: ${missing[*]}" >&2
    exit 1
  fi
}

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

confirm() {
  $ASSUME_YES && return 0
  $DRY_RUN && return 0
  read -r -p "$1 [y/N] " answer
  [[ "$answer" =~ ^[Yy]$ ]]
}

run() {
  if $DRY_RUN; then
    printf '  (dry run) %s\n' "$*"
  else
    "$@"
  fi
}

remember() {
  local key=$1 value=$2
  printf -v "$key" '%s' "$value"
  $DRY_RUN && return 0
  touch "$STATE_FILE"
  grep -v "^$key=" "$STATE_FILE" > "$STATE_FILE.tmp" || true
  printf '%s=%q\n' "$key" "$value" >> "$STATE_FILE.tmp"
  mv "$STATE_FILE.tmp" "$STATE_FILE"
}

cf_api() {
  local method=$1 path=$2 body=${3:-}
  curl -fsS -X "$method" "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}${path}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    ${body:+--data "$body"}
}

sanity_api() {
  local method=$1 path=$2 body=${3:-}
  curl -fsS -X "$method" "https://${SANITY_PROJECT_ID}.api.sanity.io/v2025-02-19${path}" \
    -H "Authorization: Bearer ${SANITY_AUTH_TOKEN}" \
    -H "Content-Type: application/json" \
    ${body:+--data "$body"}
}

set_env_line() {
  run sed -i.bak "s|^$1=.*|$1=$2|" "$3"
  run rm -f "$3.bak"
}

# ── Steps ───────────────────────────────────────────────────────────────────
step_rename() {
  need CLIENT_SLUG SITE_NAME
  say "rename: $TEMPLATE_SLUG -> $CLIENT_SLUG"
  if [[ ! "$CLIENT_SLUG" =~ ^[a-z0-9][a-z0-9-]{1,40}$ ]]; then
    echo "CLIENT_SLUG must be lowercase letters, digits and dashes" >&2
    exit 1
  fi
  for file in wrangler.jsonc package.json package-lock.json sanity.cli.ts; do
    run sed -i.bak "s/${TEMPLATE_SLUG}/${CLIENT_SLUG}/g" "$file"
    run rm -f "$file.bak"
  done
  local escaped=${SITE_NAME//\\/\\\\}
  escaped=${escaped//&/\\&}
  escaped=${escaped//|/\\|}
  run sed -i.bak "s|\[SITE NAME\] Studio|${escaped} Studio|" sanity.config.ts
  run rm -f sanity.config.ts.bak
}

step_env() {
  need SITE_URL SANITY_PROJECT_ID SANITY_DATASET
  say "env: public build values in .env.production"
  set_env_line PUBLIC_SITE_URL "$SITE_URL" .env.production
  set_env_line PUBLIC_SANITY_PROJECT_ID "$SANITY_PROJECT_ID" .env.production
  set_env_line PUBLIC_SANITY_DATASET "$SANITY_DATASET" .env.production
}

step_worker() {
  need CLIENT_SLUG
  say "worker: first deploy of ${CLIENT_SLUG} (free plan, static assets + contact Worker)"
  confirm "Build and deploy the Worker from this machine once, so Workers Builds can attach to it?" || return 0
  run npm run build
  run npx wrangler deploy
}

step_github() {
  need GITHUB_REPO
  say "github: settings for ${GITHUB_REPO}"
  confirm "Change repository settings and Actions variables?" || return 0
  run gh repo edit "$GITHUB_REPO" --delete-branch-on-merge --enable-auto-merge=false
  if [[ -n "${E2E_SANITY_WRITE_TOKEN:-}" ]]; then
    run gh variable set E2E_SANITY_PROJECT_ID --repo "$GITHUB_REPO" --body "$SANITY_PROJECT_ID"
    run gh variable set E2E_SANITY_DATASET --repo "$GITHUB_REPO" --body "${E2E_SANITY_DATASET:-e2e}"
    run gh secret set E2E_SANITY_WRITE_TOKEN --repo "$GITHUB_REPO" --body "$E2E_SANITY_WRITE_TOKEN"
  else
    echo "  E2E_SANITY_WRITE_TOKEN not set: the CMS-publish e2e test will be skipped in CI."
  fi
  echo "  Add ${GITHUB_REPO} to the Cloudflare and Renovate GitHub apps (SETUP.md)."
}

step_builds() {
  need CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN GITHUB_REPO CLIENT_SLUG
  say "builds: Workers Builds for ${GITHUB_REPO} -> Worker ${CLIENT_SLUG}"
  confirm "Connect the repo and create the production and preview triggers?" || return 0
  if $DRY_RUN; then
    echo "  (dry run) PUT /builds/repos/connections, POST /builds/triggers x2"
    return 0
  fi

  local owner=${GITHUB_REPO%/*} repo=${GITHUB_REPO#*/} owner_id repo_id connection tag token existing
  owner_id=$(gh api "users/${owner}" -q .id)
  repo_id=$(gh api "repos/${GITHUB_REPO}" -q .id)
  connection=$(cf_api PUT /builds/repos/connections "$(jq -n \
    --arg oid "$owner_id" --arg on "$owner" --arg rid "$repo_id" --arg rn "$repo" \
    '{provider_type: "github", provider_account_id: $oid, provider_account_name: $on, repo_id: $rid, repo_name: $rn}')" |
    jq -r '.result.repo_connection_uuid')
  tag=$(cf_api GET /workers/scripts | jq -r --arg n "$CLIENT_SLUG" '.result[] | select(.id == $n) | .tag')
  [[ -n "$tag" ]] || { echo "Worker ${CLIENT_SLUG} not found. Run the worker step first." >&2; exit 1; }
  token=$(cf_api GET /builds/tokens | jq -r '.result[0].build_token_uuid // empty')
  [[ -n "$token" ]] || {
    echo "No Workers Builds API token on the account. Create one once in the dashboard:" >&2
    echo "  Workers & Pages > any Worker > Settings > Builds > API token" >&2
    exit 1
  }

  existing=$(cf_api GET "/builds/workers/${tag}/triggers")
  if [[ $(jq '.result | length' <<<"$existing") != "0" ]]; then
    echo "  triggers already exist for this Worker"
    return 0
  fi
  trigger() {
    cf_api POST /builds/triggers "$(jq -n --arg tag "$tag" --arg conn "$connection" --arg tok "$token" \
      --arg name "$1" --arg deploy "$2" --argjson inc "$3" --argjson exc "$4" '{
        external_script_id: $tag, repo_connection_uuid: $conn, build_token_uuid: $tok,
        trigger_name: $name, build_command: "npm run build", deploy_command: $deploy,
        root_directory: "/", branch_includes: $inc, branch_excludes: $exc,
        path_includes: ["*"], path_excludes: []
      }')" | jq -r '.result.trigger_uuid'
  }
  remember PROD_TRIGGER_UUID "$(trigger "Deploy production" "npx wrangler deploy" '["main"]' '[]')"
  # Each branch build uploads a version with its own preview URL.
  remember PREVIEW_TRIGGER_UUID "$(trigger "Preview branches" "npx wrangler versions upload" '["*"]' '["main"]')"
}

step_hook() {
  need CLOUDFLARE_ACCOUNT_ID CLOUDFLARE_API_TOKEN CLIENT_SLUG SANITY_PROJECT_ID SANITY_DATASET SANITY_AUTH_TOKEN
  say "hook: Sanity publish -> Workers Builds deploy hook -> production rebuild"
  confirm "Create the deploy hook and the Sanity webhook that calls it?" || return 0
  if $DRY_RUN; then
    echo "  (dry run) POST /builds/workers/${CLIENT_SLUG}/deploy_hooks, POST Sanity webhook"
    return 0
  fi

  local hooks uuid
  hooks=$(cf_api GET "/builds/workers/${CLIENT_SLUG}/deploy_hooks")
  uuid=$(jq -r '[.result[]? | select(.deploy_hook_name == "Sanity publish")][0].deploy_hook_uuid // empty' <<<"$hooks")
  if [[ -z "$uuid" ]]; then
    uuid=$(cf_api POST "/builds/workers/${CLIENT_SLUG}/deploy_hooks" \
      '{"branch": "main", "deploy_hook_name": "Sanity publish"}' | jq -r '.result.deploy_hook_uuid')
  fi
  # The hook URL is its own credential: anyone holding it can start a build.
  # It lives only in the Sanity webhook and .provision-state, never in git.
  remember DEPLOY_HOOK_URL "https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/${uuid}"

  local existing
  existing=$(sanity_api GET "/hooks/projects/${SANITY_PROJECT_ID}")
  if jq -e --arg u "$DEPLOY_HOOK_URL" 'any(.[]; .url == $u)' <<<"$existing" >/dev/null; then
    echo "  Sanity webhook exists"
  else
    sanity_api POST "/hooks/projects/${SANITY_PROJECT_ID}" "$(jq -n \
      --arg url "$DEPLOY_HOOK_URL" --arg ds "$SANITY_DATASET" '{
        type: "document", name: "Rebuild site", url: $url, dataset: $ds,
        rule: { on: ["create", "update", "delete"], filter: "!(_id in path(\"drafts.**\"))", projection: "{_id}" },
        includeDrafts: false, httpMethod: "POST", apiVersion: "v2025-02-19"
      }')" >/dev/null
  fi
  echo "  Deploy hooks allow 10 builds a minute per Worker; a burst of publishes queues one build."
}

step_sanity() {
  need SANITY_PROJECT_ID SANITY_DATASET SANITY_AUTH_TOKEN CLIENT_SLUG
  say "sanity: CORS for the Studio, then deploy it to ${CLIENT_SLUG}.sanity.studio"
  confirm "Add CORS origins and deploy the hosted Studio?" || return 0
  local existing
  if $DRY_RUN; then existing="[]"; else existing=$(sanity_api GET "/projects/${SANITY_PROJECT_ID}/cors"); fi
  for origin in "https://${CLIENT_SLUG}.sanity.studio" "http://localhost:3333"; do
    if ! jq -e --arg o "$origin" 'any(.[]; .origin == $o)' <<<"$existing" >/dev/null; then
      run sanity_api POST "/projects/${SANITY_PROJECT_ID}/cors" \
        "$(jq -n --arg o "$origin" '{origin: $o, allowCredentials: true}')" >/dev/null
    fi
  done
  SANITY_STUDIO_PROJECT_ID=$SANITY_PROJECT_ID SANITY_STUDIO_DATASET=$SANITY_DATASET \
    run npx sanity deploy --yes
}

step_email() {
  need RESEND_API_KEY RESEND_FROM CONTACT_NOTIFY_EMAIL
  say "email: Resend secrets for the contact form (launch only)"
  echo "  Previews share these secrets, so set them only when the site launches."
  confirm "Set RESEND_API_KEY, RESEND_FROM and CONTACT_NOTIFY_EMAIL as Worker secrets?" || return 0
  if $DRY_RUN; then
    run npx wrangler secret bulk "<json>"
  else
    jq -n --arg a "$RESEND_API_KEY" --arg b "$RESEND_FROM" --arg c "$CONTACT_NOTIFY_EMAIL" \
      '{RESEND_API_KEY: $a, RESEND_FROM: $b, CONTACT_NOTIFY_EMAIL: $c}' | npx wrangler secret bulk
  fi
}

for step in "${STEPS[@]}"; do
  "step_${step}"
done

say "Done. Next steps are in SETUP.md (commit the changed files, then push to main)."
