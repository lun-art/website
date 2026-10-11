// The newsletter sign-up handler: adds the subscriber to a Resend segment
// (Resend replaced Mailchimp). Plain fetch, like the contact handler, so the
// Worker stays tiny and well inside the free plan's 10 ms of CPU.

export type NewsletterEnv = {
  RESEND_API_KEY?: string;
  /** The Resend segment that broadcasts go to. */
  RESEND_SEGMENT_ID?: string;
  /** Overridable for tests; defaults to Resend's contacts API. */
  RESEND_CONTACTS_URL?: string;
};

export type NewsletterInput = {
  email: string;
  firstName?: string;
  lastName?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 200, email: 320 };

/** Validate a sign-up. "name" is a full name, split at the first space. */
export function validateSignup(
  raw: Record<string, unknown>,
): { ok: true; value: NewsletterInput } | { ok: false; fields: string[] } {
  const text = (key: keyof typeof LIMITS) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  const name = text("name");
  const email = text("email");
  const fields: string[] = [];
  if (!name || name.length > LIMITS.name) fields.push("name");
  if (!email || email.length > LIMITS.email || !EMAIL.test(email))
    fields.push("email");
  if (fields.length) return { ok: false, fields };
  const [firstName, ...rest] = name.split(/\s+/);
  const lastName = rest.join(" ");
  return {
    ok: true,
    value: { email, firstName, ...(lastName && { lastName }) },
  };
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
 * POST /api/newsletter. Accepts JSON (the enhanced form) or a normal form
 * post (no JavaScript), which is answered with a redirect to a static result
 * page.
 */
export async function handleNewsletter(
  request: Request,
  env: NewsletterEnv,
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
  const back = (status: "sent" | "error") =>
    Response.redirect(
      new URL(`/newsletter/${status}`, request.url).toString(),
      303,
    );

  const body = await readBody(request);
  if (!body)
    return wantsJson
      ? Response.json({ error: "Bad request" }, { status: 400 })
      : back("error");

  // Honeypot: hidden from people, filled in by naive bots. Pretend success.
  if (typeof body.company === "string" && body.company) {
    return wantsJson ? Response.json({ ok: true }) : back("sent");
  }

  const result = validateSignup(body);
  if (!result.ok) {
    return wantsJson
      ? Response.json(
          { error: "Validation failed", fields: result.fields },
          { status: 400 },
        )
      : back("error");
  }

  // Off until launch: previews share production's secrets.
  if (!env.RESEND_API_KEY || !env.RESEND_SEGMENT_ID) {
    return wantsJson
      ? Response.json({ error: "Sign-up is not configured" }, { status: 503 })
      : back("error");
  }

  const { email, firstName, lastName } = result.value;
  const failed = () =>
    wantsJson
      ? Response.json({ error: "Sign-up failed" }, { status: 502 })
      : back("error");
  const contacts = env.RESEND_CONTACTS_URL ?? "https://api.resend.com/contacts";
  const resend = (url: string, body?: unknown) =>
    fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });
  try {
    // No "unsubscribed" field: a sign-up must never re-subscribe someone
    // who opted out.
    let response = await resend(contacts, {
      email,
      first_name: firstName,
      ...(lastName && { last_name: lastName }),
      segments: [{ id: env.RESEND_SEGMENT_ID }],
    });
    if (!response.ok) {
      // Most likely an existing contact: add them to the segment instead.
      // Answered the same either way, so the form doesn't reveal who is
      // already a contact.
      const detail = await response.text().catch(() => "");
      response = await resend(
        `${contacts}/${encodeURIComponent(email)}/segments/${encodeURIComponent(env.RESEND_SEGMENT_ID)}`,
      );
      if (!response.ok) {
        console.error(
          "Resend failed",
          response.status,
          await response.text().catch(() => ""),
          "after create failed with",
          detail,
        );
        return failed();
      }
    }
  } catch (error) {
    // A network error rejects instead of returning a response.
    console.error("Resend unreachable", error);
    return failed();
  }
  return wantsJson ? Response.json({ ok: true }) : back("sent");
}
