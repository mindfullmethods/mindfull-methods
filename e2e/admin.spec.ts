import { test, expect } from "@playwright/test";

import { loginWithPassword } from "./helpers/auth";
import { getAdminCredentials, hasAdminCredentials } from "./helpers/env";

test.describe("Admin (requires E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD)", () => {
  test.skip(!hasAdminCredentials(), "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local");

  test.beforeEach(async ({ page }) => {
    const creds = getAdminCredentials()!;
    await loginWithPassword(page, creds.email, creds.password, "/dashboard/admin-home");
  });

  test("admin home loads", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/admin-home/);
    await expect(page.getByText(/admin|pending|applications/i).first()).toBeVisible();
  });

  test("launch setup page loads", async ({ page }) => {
    await page.goto("/dashboard/setup");
    await expect(page.getByText(/launch setup|supabase/i).first()).toBeVisible();
  });

  test("site and promos admin loads", async ({ page }) => {
    await page.goto("/dashboard/admin/site");
    await expect(page.getByText(/promo|marketing|site/i).first()).toBeVisible();
  });

  test("analytics page loads", async ({ page }) => {
    await page.goto("/dashboard/analytics");
    await expect(page.getByText(/analytics|revenue|enrollment/i).first()).toBeVisible();
  });
});
