import { expect, test } from "@playwright/test";
import { MOCK_RESEND } from "../playwright.config";

const contacts = async () =>
  (await fetch(`${MOCK_RESEND}/contacts`)).json() as Promise<
    Array<{
      email: string;
      first_name: string;
      segments: Array<{ id: string }>;
    }>
  >;

async function signUp(page: import("@playwright/test").Page, email: string) {
  await page.goto("/");
  await page.getByLabel("Full Name").fill("Luna Visitor");
  await page.getByLabel("Email Address").fill(email);
  await page.getByRole("button", { name: "Inquire" }).click();
}

test.skip(
  Boolean(process.env.E2E_BASE_URL),
  "contacts go to the mock only locally",
);

test("signing up adds a contact to the Resend segment", async ({ page }) => {
  const email = `js-${Date.now()}@example.test`;
  await signUp(page, email);
  await expect(page.getByText("Thanks, you're signed up.")).toBeVisible();
  await expect(page.locator("[data-newsletter-status]")).toBeFocused();
  const contact = (await contacts()).find((c) => c.email === email);
  expect(contact).toMatchObject({
    first_name: "Luna",
    segments: [{ id: "segment_e2e" }],
  });
});

test("a failed sign-up keeps what was typed", async ({ page }) => {
  await page.route("**/api/newsletter", (route) =>
    route.fulfill({ status: 502 }),
  );
  await signUp(page, "fail@example.test");
  await expect(page.getByText(/That didn't work/)).toBeVisible();
  await expect(page.getByLabel("Email Address")).toHaveValue(
    "fail@example.test",
  );
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the form still posts and lands on the sent page", async ({ page }) => {
    const email = `nojs-${Date.now()}@example.test`;
    await signUp(page, email);
    await expect(page).toHaveURL(/\/newsletter\/sent$/);
    await expect(page.getByText("Thanks, you're signed up.")).toBeVisible();
    expect((await contacts()).some((c) => c.email === email)).toBe(true);
  });
});
