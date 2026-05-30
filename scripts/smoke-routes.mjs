#!/usr/bin/env node

const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const routes = [
  "/",
  "/courses",
  "/courses/frontend-engineering",
  "/blog",
  "/blog/how-mentorship-accelerates-your-career",
  "/about",
  "/contact",
  "/login",
  "/signup",
];

async function check(path) {
  const url = `${base.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, { redirect: "follow" });
  const ok = res.status >= 200 && res.status < 400;
  console.log(`${ok ? "OK" : "FAIL"} ${res.status} ${path}`);
  return ok;
}

async function main() {
  console.log(`Smoke checking ${base}\n`);
  let passed = 0;
  for (const route of routes) {
    if (await check(route)) passed += 1;
  }
  console.log(`\n${passed}/${routes.length} routes OK`);
  process.exit(passed === routes.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
