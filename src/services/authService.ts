/**
 * authService — Supabase Auth sign-in and token refresh via REST API.
 *
 * Password verification and session lifecycle are managed by Supabase Auth.
 * The browser never receives password_hash values.
 *
 * Requirements:
 *  - The admin user must be registered in Supabase Auth (Dashboard →
 *    Authentication → Users → Add user), not only in public.users.
 *  - VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set.
 */

import { env } from "@/config/env";
import {
  type StoredAdminUser,
  getStoredRefreshToken,
  getStoredToken,
  isTokenExpired,
  isAuthenticated,
  updateStoredTokens,
  clearAdminAuthenticated,
} from "@/utils/auth";

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
  | {
      success: true;
      user: StoredAdminUser;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }
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
// Authentication & Token Refresh API
// ---------------------------------------------------------------------------

// Singleton promise to prevent concurrent token refresh race conditions
let activeRefreshPromise: Promise<string | null> | null = null;

/**
 * Authenticate with Supabase Auth using email + password.
 * Calls: POST {SUPABASE_URL}/auth/v1/token?grant_type=password
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
      err instanceof Error
        ? err.message
        : "Configuration error. Please contact the administrator.";
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
      message:
        "A network error occurred. Please check your connection and try again.",
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      success: false,
      message:
        "Authentication service returned an unexpected response. Please try again.",
    };
  }

  if (!response.ok) {
    if (import.meta.env.DEV) {
      const errBody = body as SupabaseAuthError;
      console.error(
        `[authService] POST /auth/v1/token returned ${response.status}:`,
        errBody.error ?? errBody.message ?? "unknown error"
      );
    }

    if (response.status === 400) {
      return { success: false, message: "Invalid email or password." };
    }

    return {
      success: false,
      message: `Authentication service unavailable (HTTP ${response.status}). Please try again later.`,
    };
  }

  const tokenData = body as SupabaseAuthTokenResponse;
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

  return {
    success: true,
    user,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in,
  };
}

/**
 * Refreshes the admin session using the stored refresh token.
 * Calls: POST {SUPABASE_URL}/auth/v1/token?grant_type=refresh_token
 *
 * Uses a singleton promise to deduplicate concurrent refresh requests.
 * If refresh token is expired or revoked (400/401), clears admin session safely.
 */
export async function refreshAdminSession(): Promise<string | null> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        clearAdminAuthenticated();
        return null;
      }

      let baseUrl: string;
      let apiKey: string;
      try {
        ({ baseUrl, apiKey } = getValidatedEnv());
      } catch {
        return null;
      }

      const url = `${baseUrl}/auth/v1/token?grant_type=refresh_token`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          apikey: apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        if (import.meta.env.DEV) {
          console.warn(
            `[authService] Token refresh rejected (HTTP ${response.status}). Session cleared.`
          );
        }
        clearAdminAuthenticated();
        return null;
      }

      const body = (await response.json()) as SupabaseAuthTokenResponse;
      if (body.access_token) {
        updateStoredTokens(
          body.access_token,
          body.refresh_token,
          body.expires_in
        );
        return body.access_token;
      }

      clearAdminAuthenticated();
      return null;
    } catch (err: unknown) {
      if (import.meta.env.DEV) {
        console.error("[authService] Token refresh network error:", err);
      }
      return null;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

/**
 * Returns a valid, non-expired admin access token.
 * Automatically triggers token refresh if the token has expired or is expiring soon.
 * Returns null if the user is unauthenticated or if the session cannot be refreshed.
 */
export async function getValidAdminToken(): Promise<string | null> {
  if (!isAuthenticated()) {
    return null;
  }

  // Token is still fresh with at least 60 seconds buffer
  if (!isTokenExpired(60)) {
    return getStoredToken();
  }

  // Token is expired or expiring soon, refresh it
  return await refreshAdminSession();
}
