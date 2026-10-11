import { handleContact, type ContactEnv } from "./contact";

type Env = ContactEnv & { ASSETS: Fetcher };

// Runs only for /api/* (see run_worker_first in wrangler.jsonc). Everything
// else is a static asset served without invoking this Worker.
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") return handleContact(request, env);
    return Response.json({ error: "Not found" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
