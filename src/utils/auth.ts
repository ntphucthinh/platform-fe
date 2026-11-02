/**
 * Auth utility — session state, tokens, and lifecycle stored in localStorage.
 *
 * Manages admin authentication state, JWT access token, refresh token,
 * and token expiration tracking.
 */

import { env } from "@/config/env";

export const ADMIN_AUTH_KEY = "admin_authenticated";
export const ADMIN_USER_KEY = "admin_user";
export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_REFRESH_TOKEN_KEY = "admin_refresh_token";
export const ADMIN_TOKEN_EXPIRES_AT_KEY = "admin_token_expires_at";
export const ADMIN_CSRF_TOKEN_KEY = "admin_csrf_token";

// In-memory cache to avoid repeated localStorage or cookie reads
let memoryCsrfToken: string | null = null;

/** Minimal user info persisted after successful credential check. */
export interface StoredAdminUser {
  /** User ID */
  id: string;
  email: string;
  username: string;
  fullName: string;
}

/**
 * Returns true only if the user is explicitly authenticated and a token exists.
 */
export const isAuthenticated = (): boolean => {
  const isAuth = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  const hasToken = Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
  return isAuth && hasToken;
};

/**
 * Persist authentication state, user profile, access token, refresh token, expiration, and CSRF token.
 */
export const setAdminAuthenticated = (
  status: boolean,
  user?: StoredAdminUser,
  accessToken?: string,
  refreshToken?: string,
  expiresIn?: number,
  csrfToken?: string
): void => {
  if (status && user) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    if (accessToken) {
      localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken);
    }
    if (csrfToken) {
      localStorage.setItem(ADMIN_CSRF_TOKEN_KEY, csrfToken);
      memoryCsrfToken = csrfToken;
    }
    if (expiresIn && expiresIn > 0) {
      const expiresAt = Date.now() + expiresIn * 1000;
      localStorage.setItem(ADMIN_TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
    }
  } else {
    clearAdminAuthenticated();
  }
};

/**
 * Update stored access and refresh tokens without modifying the user profile.
 */
export const updateStoredTokens = (
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
  csrfToken?: string
): void => {
  localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken);
  }
  if (csrfToken) {
    localStorage.setItem(ADMIN_CSRF_TOKEN_KEY, csrfToken);
    memoryCsrfToken = csrfToken;
  }
  if (expiresIn && expiresIn > 0) {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(ADMIN_TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
  }
};

/** Remove all authentication state (used on logout or session expiration). */
export const clearAdminAuthenticated = (): void => {
  memoryCsrfToken = null;
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(ADMIN_CSRF_TOKEN_KEY);
};

/** Retrieve the stored JWT access token, or null if not present. */
export const getStoredToken = (): string | null => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

/** Retrieve the stored refresh token, or null if not present. */
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
};

/** Retrieve the stored CSRF token, or null if not present. */
export const getStoredCsrfToken = (): string | null => {
  return localStorage.getItem(ADMIN_CSRF_TOKEN_KEY);
};

/** Set or update the stored CSRF token. */
export const setStoredCsrfToken = (csrfToken: string): void => {
  memoryCsrfToken = csrfToken;
  localStorage.setItem(ADMIN_CSRF_TOKEN_KEY, csrfToken);
};

/**
 * Retrieve the active CSRF token.
 * Uses in-memory cache first, falling back to localStorage and document cookie once.
 */
export const getCsrfToken = (): string | null => {
  if (memoryCsrfToken) return memoryCsrfToken;

  const stored = getStoredCsrfToken();
  if (stored) {
    memoryCsrfToken = stored;
    return memoryCsrfToken;
  }

  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)csrf=([^;]*)/);
    if (match) {
      memoryCsrfToken = decodeURIComponent(match[1]);
      return memoryCsrfToken;
    }
  }

  return null;
};

/** Retrieve the token expiration timestamp (ms), or null if not set. */
export const getStoredTokenExpiresAt = (): number | null => {
  const raw = localStorage.getItem(ADMIN_TOKEN_EXPIRES_AT_KEY);
  if (!raw) return null;
  const num = parseInt(raw, 10);
  return isNaN(num) ? null : num;
};

/**
 * Checks whether the current access token is expired or close to expiring.
 * @param bufferSeconds Advance safety buffer in seconds (default 60s).
 */
export const isTokenExpired = (bufferSeconds = 60): boolean => {
  const token = getStoredToken();
  if (!token) return true;

  const expiresAt = getStoredTokenExpiresAt();
  if (typeof expiresAt === "number" && expiresAt > 0) {
    return Date.now() >= expiresAt - bufferSeconds * 1000;
  }

  // Fallback: inspect JWT exp claim from payload
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const jsonStr = atob(base64);
      const payload = JSON.parse(jsonStr) as { exp?: number };
      if (typeof payload.exp === "number") {
        return Date.now() >= (payload.exp - bufferSeconds) * 1000;
      }
    }
  } catch {
    return true;
  }

  return false;
};

/** Retrieve the stored user profile, or null if not authenticated. */
export const getStoredAdminUser = (): StoredAdminUser | null => {
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAdminUser;
  } catch {
    return null;
  }
};

// Singleton promise to prevent concurrent token refresh race conditions
let activeRefreshPromise: Promise<string | null> | null = null;

/**
 * Refreshes the session using the stored refresh_token cookie.
 * Calls: POST {API_URL}/auth/refresh
 */
export async function refreshAdminSession(): Promise<string | null> {
  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const csrf = getCsrfToken();
      const headers: Record<string, string> = {
        Accept: "application/json",
      };
      if (csrf) {
        headers["X-CSRF-Token"] = csrf;
      }

      const response = await fetch(`${env.apiUrl}/auth/refresh`, {
        method: "POST",
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        clearAdminAuthenticated();
        return null;
      }

      const body = (await response.json()) as {
        data?: { accessToken?: string; csrfToken?: string };
      };
      const newToken =
        body?.data?.accessToken ||
        body?.data?.csrfToken ||
        getCsrfToken();
      const newCsrf = body?.data?.csrfToken || undefined;

      if (newToken) {
        updateStoredTokens(newToken, undefined, 24 * 60 * 60, newCsrf);
        return newToken;
      }

      clearAdminAuthenticated();
      return null;
    } catch {
      clearAdminAuthenticated();
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
 */
export async function getValidAdminToken(): Promise<string | null> {
  if (!isAuthenticated()) {
    return null;
  }

  if (!isTokenExpired(60)) {
    return getStoredToken();
  }

  return await refreshAdminSession();
}

