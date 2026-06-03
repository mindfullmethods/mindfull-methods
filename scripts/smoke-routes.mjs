#!/usr/bin/env node

/**
 * Automated smoke checks for public routes + auth redirects.
 * Usage:
 *   npm run smoke
 *   SMOKE_BASE_URL=https://mindfull-methods.vercel.app npm run smoke
 */

const base = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const publicRoutes = [
  "/",
  "/courses",
  "/courses/prompt-engineering",
  "/courses/prompt-engineering/syllabus",
  "/courses/generative-ai-llms",
  "/courses/ai-agents",
  "/blog",
  "/blog/how-mentorship-accelerates-your-career",
  "/about",
  "/contact",
  "/login",
  "/signup",
  "/forgot-password",
  "/privacy",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
  "/certificates/verify/MM-E2E-SMOKE-TEST",
];

const assetRoutes = [
  { path: "/syllabi/prompt-engineering.pdf", kind: "pdf" },
  { path: "/syllabi/generative-ai-llms.pdf", kind: "pdf" },
  { path: "/syllabi/ai-agents.pdf", kind: "pdf" },
  { path: "/syllabi/ai-automation.pdf", kind: "pdf" },
  { path: "/api/syllabus/prompt-engineering", kind: "txt" },
];

const authRedirectRoutes = [
  "/dashboard",
  "/dashboard/my-courses",
  "/dashboard/courses",
  "/dashboard/settings",
  "/dashboard/admin-home",
  "/dashboard/admin/site",
  "/dashboard/setup",
  "/dashboard/my-applications",
];

const courseSlugs = [
  "prompt-engineering",
  "generative-ai-llms",
  "ai-agents",
  "ai-automation",
];

async function fetchRoute(path, init = {}) {
  const url = `${base.replace(/\/$/, "")}${path}`;
  return fetch(url, { redirect: "manual", ...init });
}

function log(ok, label, detail) {
  console.log(`${ok ? "OK" : "FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
}

async function checkPublic(path) {
  const res = await fetchRoute(path, { redirect: "follow" });
  const ok = res.status >= 200 && res.status < 400;
  log(ok, `${res.status} ${path}`);
  return ok;
}

async function checkAsset({ path, kind }) {
  const res = await fetchRoute(path, { redirect: "follow" });
  const type = res.headers.get("content-type") ?? "";
  let ok = res.status === 200;

  if (kind === "pdf") ok = ok && type.includes("pdf");
  if (kind === "txt") ok = ok && (type.includes("text/plain") || type.includes("text"));

  log(ok, `${res.status} ${path}`, type || "no content-type");
  return ok;
}

async function checkAuthRedirect(path) {
  const res = await fetchRoute(path);
  const location = res.headers.get("location") ?? "";
  const ok =
    (res.status === 307 || res.status === 308 || res.status === 302) &&
    location.includes("/login");
  log(ok, `${res.status} ${path}`, location ? `→ ${location}` : "missing redirect");
  return ok;
}

async function checkJsonLd() {
  const path = "/courses/generative-ai-llms";
  const res = await fetchRoute(path, { redirect: "follow" });
  const html = await res.text();
  const ok = res.status === 200 && html.includes("application/ld+json");
  log(ok, `JSON-LD ${path}`, ok ? "found" : "missing");
  return ok;
}

async function checkCertificateVerifyPage() {
  const path = "/certificates/verify/MM-E2E-SMOKE-TEST";
  const res = await fetchRoute(path, { redirect: "follow" });
  const html = await res.text();
  const ok =
    res.status === 200 &&
    html.includes("Certificate not found") &&
    (html.includes("Mindfull Methods") || html.includes("logo-full"));
  log(ok, `${res.status} ${path}`, ok ? "branding + not-found state" : "missing expected content");
  return ok;
}

async function checkContactApiValidation() {
  const res = await fetchRoute("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "a", email: "bad", interest: "", message: "short" }),
  });
  const ok = res.status === 400 || res.status === 422;
  log(ok, `${res.status} POST /api/contact (invalid payload)`, ok ? "rejected as expected" : "unexpected");
  return ok;
}

async function main() {
  console.log(`Smoke checking ${base}\n`);

  let passed = 0;
  let total = 0;

  async function run(name, fn) {
    total += 1;
    if (await fn()) passed += 1;
  }

  console.log("— Public pages —");
  for (const route of publicRoutes) {
    await run(route, () => checkPublic(route));
  }

  console.log("\n— Syllabus assets —");
  for (const asset of assetRoutes) {
    await run(asset.path, () => checkAsset(asset));
  }

  console.log("\n— Auth redirects —");
  for (const route of authRedirectRoutes) {
    await run(route, () => checkAuthRedirect(route));
  }

  console.log("\n— SEO / API —");
  await run("JSON-LD", checkJsonLd);
  await run("certificate verify page", checkCertificateVerifyPage);
  await run("contact validation", checkContactApiValidation);

  console.log(`\n${passed}/${total} checks passed`);

  if (passed !== total) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
