import { test, expect } from "@playwright/test";

import { loginWithPassword } from "./helpers/auth";
import { getStudentCredentials, hasStudentCredentials } from "./helpers/env";

test.describe("Student (requires E2E_STUDENT_EMAIL / E2E_STUDENT_PASSWORD)", () => {
  test.skip(!hasStudentCredentials(), "Set E2E_STUDENT_EMAIL and E2E_STUDENT_PASSWORD in .env.local");

  test.beforeEach(async ({ page }) => {
    const creds = getStudentCredentials()!;
    await loginWithPassword(page, creds.email, creds.password, "/dashboard/my-courses");
  });

  test("my courses dashboard loads", async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/my-courses/);
    await expect(page.getByText(/my courses|enrolled|no courses/i).first()).toBeVisible();
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await expect(page.getByText(/settings|profile|display name/i).first()).toBeVisible();
  });

  test("internships catalog loads", async ({ page }) => {
    await page.goto("/dashboard/internships");
    await expect(page.getByText(/internship/i).first()).toBeVisible();
  });

  test("my applications page loads", async ({ page }) => {
    await page.goto("/dashboard/my-applications");
    await expect(page.getByText(/application/i).first()).toBeVisible();
  });
});
