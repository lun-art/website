import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "../../worker/index";
import { handleNewsletter, validateSignup } from "../../worker/newsletter";

const env = { RESEND_API_KEY: "re_test", RESEND_SEGMENT_ID: "seg_1" };
const valid = { name: "Ana Maria Lopez", email: "ana@example.com" };

const post = (body: unknown, { json = true } = {}) =>
  new Request("https://site.example/api/newsletter", {
    method: "POST",
    headers: json
      ? { "content-type": "application/json", accept: "application/json" }
      : { "content-type": "application/x-www-form-urlencoded" },
    body: json
      ? JSON.stringify(body)
      : new URLSearchParams(body as Record<string, string>),
  });

afterEach(() => vi.unstubAllGlobals());

describe("validateSignup", () => {
  it("splits the full name at the first space", () => {
    expect(validateSignup(valid)).toEqual({
      ok: true,
      value: {
        email: "ana@example.com",
        firstName: "Ana",
        lastName: "Maria Lopez",
      },
    });
  });

  it("leaves out an empty last name", () => {
    expect(validateSignup({ ...valid, name: " Cher " })).toEqual({
      ok: true,
      value: { email: "ana@example.com", firstName: "Cher" },
    });
  });

  it("names every bad field", () => {
    expect(validateSignup({ name: "", email: "nope" })).toEqual({
      ok: false,
      fields: ["name", "email"],
    });
  });
});

describe("handleNewsletter", () => {
  it("adds the contact to the Resend segment", async () => {
    const fetchMock = vi.fn(async () => Response.json({ id: "1" }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleNewsletter(post(valid), env);
    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.resend.com/contacts");
    expect(new Headers(init.headers).get("authorization")).toBe(
      "Bearer re_test",
    );
    expect(JSON.parse(String(init.body))).toEqual({
      email: "ana@example.com",
      first_name: "Ana",
      last_name: "Maria Lopez",
      unsubscribed: false,
      segments: [{ id: "seg_1" }],
    });
  });

  it("answers an existing contact as a success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("exists", { status: 409 })),
    );
    expect((await handleNewsletter(post(valid), env)).status).toBe(200);
  });

  it("reports a Resend failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("bad", { status: 422 })),
    );
    expect((await handleNewsletter(post(valid), env)).status).toBe(502);
  });

  it("reports an unreachable Resend", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("network");
      }),
    );
    expect((await handleNewsletter(post(valid), env)).status).toBe(502);
  });

  it("stays off until the secrets are set", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleNewsletter(post(valid), {});
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("pretends success for the honeypot without calling Resend", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleNewsletter(
      post({ ...valid, company: "Spam Inc" }),
      env,
    );
    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("redirects a form post to the static result pages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ id: "1" })),
    );
    const sent = await handleNewsletter(post(valid, { json: false }), env);
    expect(sent.status).toBe(303);
    expect(sent.headers.get("location")).toBe(
      "https://site.example/newsletter/sent",
    );
    const error = await handleNewsletter(
      post({ name: "", email: "" }, { json: false }),
      env,
    );
    expect(error.headers.get("location")).toBe(
      "https://site.example/newsletter/error",
    );
  });

  it("is routed by the Worker and accepts only POST", async () => {
    const response = await worker.fetch(
      new Request("https://site.example/api/newsletter"),
      { ...env, ASSETS: {} as Fetcher },
    );
    expect(response.status).toBe(405);
  });
});
