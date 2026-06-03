import { siteConfig } from "@/lib/site";

function siteBase() {
  return siteConfig.url.replace(/\/$/, "");
}

/** Password reset emails — prefer this URL in Supabase redirect allowlist. */
export function passwordResetRedirectUrl() {
  return `${siteBase()}/reset-password`;
}

/** Server callback for OAuth / other flows — add to Supabase redirect URLs. */
export function authCallbackUrl(nextPath: string) {
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `${siteBase()}/auth/callback?next=${encodeURIComponent(next)}`;
}
