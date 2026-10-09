/**
 * Typed access point for Vite environment variables.
 * Only VITE_* variables are exposed to the browser.
 */

/** Normalize Supabase base URL: strip /rest/v1/ suffix if already present. */
function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw) return "";
  // Remove trailing /rest/v1 (with or without trailing slash)
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

const _supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const _supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (import.meta.env.DEV) {
  if (!_supabaseUrl) console.warn("[env] VITE_SUPABASE_URL is not set.");
  if (!_supabaseKey) console.warn("[env] VITE_SUPABASE_PUBLISHABLE_KEY is not set.");
}

export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string | undefined,
  appName: import.meta.env.VITE_APP_NAME as string | undefined,
  appEnv: import.meta.env.VITE_APP_ENV as string | undefined,
  /** Supabase project base URL (no trailing slash, no /rest/v1). */
  supabaseUrl: normalizeSupabaseUrl(_supabaseUrl),
  /** Supabase anon / publishable key — safe for browser. */
  supabasePublishableKey: _supabaseKey ?? "",
};
