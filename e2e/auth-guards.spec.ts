import { test, expect } from "@playwright/test";

const protectedPaths = [
  "/dashboard",
  "/dashboard/my-courses",
  "/dashboard/settings",
  "/dashboard/admin-home",
];

test.describe("Auth guards", () => {
  test("login page renders sign-in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /continue your journey/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("signup page renders", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create your student workspace/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  });

  for (const path of protectedPaths) {
    test(`redirects ${path} to login (HTTP)`, async ({ request }) => {
      const res = await request.get(path, { maxRedirects: 0 });
      expect([302, 307, 308]).toContain(res.status()); // not 404 — route must exist
      const location = res.headers().location ?? "";
      expect(location).toMatch(/\/login/);
    });
  }
});
