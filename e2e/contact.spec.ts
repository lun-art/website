import { expect, test } from "@playwright/test";
import { MOCK_RESEND } from "../playwright.config";

const sentEmails = async () =>
  (await fetch(`${MOCK_RESEND}/emails`)).json() as Promise<
    Array<{ text: string; reply_to: string }>
  >;

async function fill(page: import("@playwright/test").Page, marker: string) {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("E2E Visitor");
  await page.getByLabel("Email").fill("visitor@example.test");
  await page.getByLabel("Message").fill(`Hello from ${marker}`);
  await page.getByRole("button", { name: "Send message" }).click();
}

test.skip(
  Boolean(process.env.E2E_BASE_URL),
  "email goes to the mock only locally",
);

test("the contact form emails the owner", async ({ page }) => {
  const marker = `js-${Date.now()}`;
  await fill(page, marker);
  await expect(
    page.getByText("Thanks, your message has been sent."),
  ).toBeVisible();
  // Only the thanks stays.
  await expect(page.getByLabel("Name")).toBeHidden();
  await expect(page.getByRole("button", { name: "Send message" })).toBeHidden();
  await expect(page.locator("[data-contact-status]")).toBeFocused();
  const email = (await sentEmails()).find((e) => e.text.includes(marker));
  expect(email?.reply_to).toBe("visitor@example.test");
});

test("a failed send keeps the form and what was typed", async ({ page }) => {
  await page.route("**/api/contact", (route) => route.fulfill({ status: 502 }));
  await fill(page, `fail-${Date.now()}`);
  await expect(
    page.getByText("Your message couldn't be sent. Please try again."),
  ).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("E2E Visitor");
  const button = page.getByRole("button", { name: "Send message" });
  await expect(button).toBeEnabled();
  await expect(button).toBeFocused();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the form still posts and lands on the sent page", async ({ page }) => {
    const marker = `nojs-${Date.now()}`;
    await fill(page, marker);
    await expect(page).toHaveURL(/\/contact\/sent$/);
    await expect(
      page.getByText("Thanks, your message has been sent."),
    ).toBeVisible();
    expect((await sentEmails()).some((e) => e.text.includes(marker))).toBe(
      true,
    );
  });
});
