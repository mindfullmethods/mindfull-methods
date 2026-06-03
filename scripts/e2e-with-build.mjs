import { spawnSync } from "node:child_process";

process.env.E2E_USE_BUILD = "1";

const result = spawnSync("npx", ["playwright", "test"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
