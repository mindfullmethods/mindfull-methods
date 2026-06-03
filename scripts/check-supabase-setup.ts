/**
 * Reports Supabase / env readiness (same checks as /dashboard/setup).
 * Usage: npm run setup:check
 */
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const { getPlatformSetupChecks } = await import("../src/lib/platform-setup");

  const checks = await getPlatformSetupChecks();
  const ready = checks.filter((c) => c.ready);
  const pending = checks.filter((c) => !c.ready);

  console.log(`\nSupabase / platform setup (${ready.length}/${checks.length} ready)\n`);

  for (const check of checks) {
    const mark = check.ready ? "✓" : "○";
    console.log(`${mark} ${check.label}`);
    if (!check.ready && check.action) console.log(`    → ${check.action}`);
    else if (!check.ready) console.log(`    → ${check.detail}`);
  }

  const launchOnly = new Set(["razorpay-webhook", "domain"]);
  const pendingSql = pending.filter((c) => !launchOnly.has(c.id));
  const pendingLaunch = pending.filter((c) => launchOnly.has(c.id));

  if (pendingLaunch.length > 0) {
    console.log("\nDeferred until launch (OK for local dev):");
    for (const check of pendingLaunch) {
      console.log(`  • ${check.label}`);
    }
  }

  if (pendingSql.length > 0) {
    console.log("\nPending SQL (run in Supabase SQL Editor, in order):");
    const sqlMap: Record<string, string> = {
      "enrollments-table": "supabase/enrollments-schema.sql",
      "applications-status": "supabase/applications-status-only.sql",
      "progress-table": "supabase/course-progress-schema.sql",
      "inquiries-table": "supabase/contact-inquiries-schema.sql",
      "inquiry-status": "supabase/contact-inquiries-status.sql",
      "inquiry-notes": "supabase/admin-dashboard-extensions.sql",
      "inquiry-linked-enrollment": "supabase/contact-inquiries-linked-enrollment.sql",
      "certificates-table": "supabase/certificates-schema.sql",
      "completion-verification": "supabase/completion-verifications-schema.sql",
      "platform-settings": "supabase/content-cms-schema.sql",
    };
    for (const check of pendingSql) {
      const file = sqlMap[check.id];
      if (file) console.log(`  • ${file}`);
    }
    console.log("\nSee docs/LOCAL_MIGRATIONS.md for full list.\n");
    process.exit(1);
  }

  console.log(
    pendingLaunch.length > 0
      ? "\nLocal dev ready (launch items pending).\n"
      : "\nAll setup checks passed.\n"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
