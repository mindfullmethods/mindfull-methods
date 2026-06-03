#!/usr/bin/env node
/**
 * Local QA gate: Supabase setup check + HTTP smoke routes.
 * Usage: npm run qa
 */
import { spawnSync } from "node:child_process";

function run(label, cmd, args) {
  console.log(`\n=== ${label} ===\n`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("Setup check", "npm", ["run", "setup:check"]);
run("Route smoke", "npm", ["run", "smoke"]);

console.log("\nQA gate passed. Continue with docs/QA_MANUAL.md for signed-in flows.\n");
