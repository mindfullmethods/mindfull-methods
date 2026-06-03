import { test, expect } from "@playwright/test";

test.describe("Public marketing", () => {
  test("home page loads with primary CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /learn courses/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse courses" })).toBeVisible();
  });

  test("courses catalog and detail", async ({ page }) => {
    await page.goto("/courses");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/courses/generative-ai-llms");
    await expect(page.getByText(/generative ai/i).first()).toBeVisible();
  });

  test("contact page shows form fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByPlaceholder("Your name")).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  });

  test("blog listing and post", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("link", { name: /mentorship/i }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("Certificate verify (public)", () => {
  test("unknown certificate shows not found with branding", async ({ page }) => {
    await page.goto("/certificates/verify/MM-E2E-NOT-FOUND");
    await expect(page.getByText(/certificate not found/i)).toBeVisible();
    // Light mode: wordmark; dark mode: full logo image
    await expect(page.getByLabel("Mindfull Methods").first()).toBeVisible();
  });

  test("verify page logo readable in dark mode", async ({ page }) => {
    await page.goto("/certificates/verify/MM-E2E-NOT-FOUND");
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await expect(page.locator('img[src*="logo-full"]').first()).toBeVisible();
  });
});
