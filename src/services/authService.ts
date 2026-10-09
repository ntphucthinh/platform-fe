/**
 * authService — Supabase Auth sign-in via POST /auth/v1/token.
 *
 * Password verification is performed entirely on the Supabase server.
 * The browser never receives password_hash values.
 *
 * Requirements:
 *  - The admin user must be registered in Supabase Auth (Dashboard →
 *    Authentication → Users → Add user), not only in public.users.
 *  - VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set.
 */

import { env } from "@/config/env";
import type { StoredAdminUser } from "@/utils/auth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Successful Supabase Auth token response. */
interface SupabaseAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: {
    id: string;
    email: string | null;
    user_metadata: Record<string, unknown>;
  };
}

/** Supabase Auth error response. */
interface SupabaseAuthError {
  error: string;
  error_description?: string;
  message?: string;
}

export type LoginResult =
  | { success: true; user: StoredAdminUser; accessToken: string }
  | { success: false; message: string };

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

function getValidatedEnv(): { baseUrl: string; apiKey: string } {
  const baseUrl = env.supabaseUrl;
  const apiKey = env.supabasePublishableKey;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing Supabase configuration. " +
        "Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env."
    );
  }

  return { baseUrl, apiKey };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Authenticate with Supabase Auth using email + password.
 *
 * Calls:  POST {SUPABASE_URL}/auth/v1/token?grant_type=password
 *
 * On success: returns the Supabase JWT access_token and a minimal user profile.
 * On failure: returns a generic error message (no credential details leaked).
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<LoginResult> {
  let baseUrl: string;
  let apiKey: string;

  try {
    ({ baseUrl, apiKey } = getValidatedEnv());
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Configuration error. Please contact the administrator.";
    return { success: false, message };
  }

  const url = `${baseUrl}/auth/v1/token?grant_type=password`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return {
      success: false,
      message: "A network error occurred. Please check your connection and try again.",
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      success: false,
      message: "Authentication service returned an unexpected response. Please try again.",
    };
  }

  if (!response.ok) {
    // Log technical detail in dev (no credentials included).
    if (import.meta.env.DEV) {
      const errBody = body as SupabaseAuthError;
      console.error(
        `[authService] POST /auth/v1/token returned ${response.status}:`,
        errBody.error ?? errBody.message ?? "unknown error"
      );
    }

    // 400 from Supabase Auth = invalid credentials.
    if (response.status === 400) {
      return { success: false, message: "Invalid email or password." };
    }

    return {
      success: false,
      message: `Authentication service unavailable (HTTP ${response.status}). Please try again later.`,
    };
  }

  const tokenData = body as SupabaseAuthTokenResponse;

  // Build minimal user profile from the Auth response.
  // user_metadata may contain full_name / username if set during signup.
  const metadata = tokenData.user.user_metadata;
  const user: StoredAdminUser = {
    id: tokenData.user.id,
    email: tokenData.user.email ?? email,
    username:
      typeof metadata["username"] === "string"
        ? metadata["username"]
        : (tokenData.user.email?.split("@")[0] ?? "admin"),
    fullName:
      typeof metadata["full_name"] === "string"
        ? metadata["full_name"]
        : (tokenData.user.email?.split("@")[0] ?? "Admin"),
  };

  return { success: true, user, accessToken: tokenData.access_token };
}
