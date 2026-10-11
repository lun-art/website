import { afterEach, describe, expect, it, vi } from "vitest";
import { handleContact, validateContact } from "../../worker/contact";
import worker from "../../worker/index";

const env = {
  RESEND_API_KEY: "re_test",
  RESEND_FROM: "Site <hello@client.example>",
  CONTACT_NOTIFY_EMAIL: "owner@client.example",
};
const valid = { name: "Ana", email: "ana@example.com", message: "Hello" };

const post = (
  body: unknown,
  { json = true, referer }: { json?: boolean; referer?: string } = {},
) =>
  new Request("https://site.example/api/contact", {
    method: "POST",
    headers: {
      ...(json
        ? { "content-type": "application/json", accept: "application/json" }
        : { "content-type": "application/x-www-form-urlencoded" }),
      ...(referer && { referer }),
    },
    body: json
      ? JSON.stringify(body)
      : new URLSearchParams(body as Record<string, string>),
  });

afterEach(() => vi.unstubAllGlobals());

describe("validateContact", () => {
  it("trims and accepts a normal message", () => {
    expect(validateContact({ ...valid, name: "  Ana " })).toEqual({
      ok: true,
      value: valid,
    });
  });

  it("names every bad field", () => {
    expect(
      validateContact({ name: "", email: "nope", message: "x".repeat(5001) }),
    ).toEqual({
      ok: false,
      fields: ["name", "message", "email"],
    });
  });
});

describe("handleContact", () => {
  it("emails the owner through Resend", async () => {
    const fetchMock = vi.fn(async () => Response.json({ id: "1" }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleContact(post(valid), env);
    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.resend.com/emails");
    expect(JSON.parse(String(init.body))).toMatchObject({
      to: env.CONTACT_NOTIFY_EMAIL,
      reply_to: valid.email,
    });
  });

  it("rejects invalid input without sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(
      (await handleContact(post({ ...valid, email: "x" }), env)).status,
    ).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops honeypot submissions silently", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(
      (await handleContact(post({ ...valid, company: "Spam" }), env)).status,
    ).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses to send before email is configured", async () => {
    expect((await handleContact(post(valid), {})).status).toBe(503);
  });

  it("reports a Resend failure", async () => {
    vi.stubGlobal("fetch", async () => new Response("nope", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handleContact(post(valid), env)).status).toBe(502);
  });

  it("reports Resend being unreachable", async () => {
    vi.stubGlobal("fetch", async () => {
      throw new TypeError("network down");
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await handleContact(post(valid), env);
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Sending failed" });

    const form = await handleContact(
      post(valid, { json: false, referer: "https://site.example/de/contact" }),
      env,
    );
    expect(form.status).toBe(303);
    expect(form.headers.get("location")).toBe(
      "https://site.example/de/contact/error",
    );
  });

  it("answers a no-JavaScript form post with a redirect back", async () => {
    vi.stubGlobal("fetch", async () => Response.json({ id: "1" }));
    const response = await handleContact(
      post(valid, { json: false, referer: "https://site.example/contact" }),
      env,
    );
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://site.example/contact/sent",
    );
  });

  it("never redirects to another site", async () => {
    const response = await handleContact(
      post(
        { ...valid, email: "x" },
        { json: false, referer: "https://evil.example/" },
      ),
      env,
    );
    expect(response.headers.get("location")).toBe(
      "https://site.example/contact/error",
    );
  });

  it("allows POST only", async () => {
    const response = await handleContact(
      new Request("https://site.example/api/contact"),
      env,
    );
    expect(response.status).toBe(405);
  });
});

describe("worker", () => {
  it("404s unknown API routes", async () => {
    const response = await worker.fetch(
      new Request("https://site.example/api/nope") as Parameters<
        typeof worker.fetch
      >[0],
      { ...env, ASSETS: {} as Fetcher },
    );
    expect(response.status).toBe(404);
  });
});
