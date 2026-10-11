// The contact form handler. Kept dependency-free (plain fetch to Resend's
// REST API) so the Worker bundle stays tiny and each request costs a few ms
// of CPU, well inside the free plan's 10 ms.

export type ContactEnv = {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  CONTACT_NOTIFY_EMAIL?: string;
  /** Overridable for tests; defaults to Resend's API. */
  RESEND_API_URL?: string;
};

export type ContactInput = { name: string; email: string; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 200, email: 320, message: 5000 };

/** Validate a submission. Returns the cleaned input or the bad field names. */
export function validateContact(
  raw: Record<string, unknown>,
): { ok: true; value: ContactInput } | { ok: false; fields: string[] } {
  const text = (key: keyof typeof LIMITS) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  const value = {
    name: text("name"),
    email: text("email"),
    message: text("message"),
  };
  const fields = (Object.keys(LIMITS) as Array<keyof typeof LIMITS>).filter(
    (key) => !value[key] || value[key].length > LIMITS[key],
  );
  if (!fields.includes("email") && !EMAIL.test(value.email))
    fields.push("email");
  return fields.length ? { ok: false, fields } : { ok: true, value };
}

async function readBody(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const type = request.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) return await request.json();
    if (type.includes("form"))
      return Object.fromEntries(await request.formData());
  } catch {
    return null;
  }
  return null;
}

/**
 * POST /api/contact. Accepts JSON (the enhanced form) or a normal form post
 * (no JavaScript), which is answered with a redirect back to the page.
 */
export async function handleContact(
  request: Request,
  env: ContactEnv,
): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: { allow: "POST" } },
    );
  }
  const wantsJson = (request.headers.get("accept") ?? "").includes(
    "application/json",
  );
  // No-JavaScript posts land on a static result page next to the form:
  // /contact -> /contact/sent, /de/contact -> /de/contact/error.
  const back = (status: "sent" | "error") => {
    const here = new URL(request.url);
    const referer = request.headers.get("referer");
    const from = referer ? new URL(referer, here) : null;
    const formPath =
      from && from.origin === here.origin
        ? from.pathname.replace(/\/(sent|error)$/, "")
        : "/contact";
    return Response.redirect(
      new URL(`${formPath.replace(/\/$/, "")}/${status}`, here).toString(),
      303,
    );
  };

  const body = await readBody(request);
  if (!body)
    return wantsJson
      ? Response.json({ error: "Bad request" }, { status: 400 })
      : back("error");

  // Honeypot: hidden from people, filled in by naive bots. Pretend success.
  if (typeof body.company === "string" && body.company) {
    return wantsJson ? Response.json({ ok: true }) : back("sent");
  }

  const result = validateContact(body);
  if (!result.ok) {
    return wantsJson
      ? Response.json(
          { error: "Validation failed", fields: result.fields },
          { status: 400 },
        )
      : back("error");
  }

  // Email stays off until launch: previews share production's secrets.
  if (!env.RESEND_API_KEY || !env.RESEND_FROM || !env.CONTACT_NOTIFY_EMAIL) {
    return wantsJson
      ? Response.json({ error: "Email is not configured" }, { status: 503 })
      : back("error");
  }

  const { name, email, message } = result.value;
  const failed = () =>
    wantsJson
      ? Response.json({ error: "Sending failed" }, { status: 502 })
      : back("error");
  let response: Response;
  try {
    response = await fetch(
      env.RESEND_API_URL ?? "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: env.RESEND_FROM,
          to: env.CONTACT_NOTIFY_EMAIL,
          reply_to: email,
          subject: `New message from ${name}`,
          text: `${name} <${email}> wrote:\n\n${message}`,
        }),
      },
    );
  } catch (error) {
    // A network error rejects instead of returning a response.
    console.error("Resend unreachable", error);
    return failed();
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("Resend failed", response.status, detail);
    return failed();
  }
  return wantsJson ? Response.json({ ok: true }) : back("sent");
}
