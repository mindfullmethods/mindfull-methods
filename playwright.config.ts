import { defineConfig, devices } from "@playwright/test";

/** Dedicated port so E2E does not hit a stale `npm run dev` on :3000 */
const e2eHost = process.env.E2E_HOST ?? "127.0.0.1";
const e2ePort = process.env.E2E_PORT ?? "3456";
const baseURL =
  process.env.E2E_BASE_URL ?? `http://${e2eHost}:${e2ePort}`;
const startCmd = (mode: "dev" | "start") =>
  mode === "dev"
    ? `npm run dev -- --port ${e2ePort} --hostname ${e2eHost}`
    : `npm run build && npm run start -- -p ${e2ePort} -H ${e2eHost}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
  },
  expect: {
    timeout: 15_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_SKIP_WEB_SERVER
    ? undefined
    : {
        command:
          process.env.E2E_USE_BUILD === "1"
            ? startCmd("start")
            : startCmd("dev"),
        url: baseURL,
        reuseExistingServer: false,
        timeout: 240_000,
      },
});
