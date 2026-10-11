import { handleContact, type ContactEnv } from "./contact";
import { handleNewsletter, type NewsletterEnv } from "./newsletter";

type Env = ContactEnv & NewsletterEnv & { ASSETS: Fetcher };

// Runs only for /api/* (see run_worker_first in wrangler.jsonc). Everything
// else is a static asset served without invoking this Worker.
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") return handleContact(request, env);
    if (pathname === "/api/newsletter") return handleNewsletter(request, env);
    return Response.json({ error: "Not found" }, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
