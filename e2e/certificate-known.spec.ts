import { test, expect } from "@playwright/test";

const certId = process.env.E2E_CERTIFICATE_ID?.trim();

test.describe("Certificate verify (known ID)", () => {
  test.skip(!certId, "Set E2E_CERTIFICATE_ID in .env.local or CI secrets");

  test("valid certificate shows student and course", async ({ page }) => {
    await page.goto(`/certificates/verify/${certId}`);
    await expect(page.getByText(/valid certificate/i)).toBeVisible();
    await expect(page.getByLabel("Mindfull Methods").first()).toBeVisible();
  });
});
