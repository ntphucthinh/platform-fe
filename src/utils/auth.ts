/**
 * Auth utility — session state, tokens, and lifecycle stored in localStorage.
 *
 * Manages admin authentication state, JWT access token, refresh token,
 * and token expiration tracking.
 */

export const ADMIN_AUTH_KEY = "admin_authenticated";
export const ADMIN_USER_KEY = "admin_user";
export const ADMIN_TOKEN_KEY = "admin_token";
export const ADMIN_REFRESH_TOKEN_KEY = "admin_refresh_token";
export const ADMIN_TOKEN_EXPIRES_AT_KEY = "admin_token_expires_at";

/** Minimal user info persisted after successful credential check. */
export interface StoredAdminUser {
  /** Supabase Auth UUID */
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
 * Persist authentication state, user profile, access token, refresh token, and expiration.
 */
export const setAdminAuthenticated = (
  status: boolean,
  user?: StoredAdminUser,
  accessToken?: string,
  refreshToken?: string,
  expiresIn?: number
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
  expiresIn?: number
): void => {
  localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken);
  }
  if (expiresIn && expiresIn > 0) {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(ADMIN_TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
  }
};

/** Remove all authentication state (used on logout or session expiration). */
export const clearAdminAuthenticated = (): void => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_EXPIRES_AT_KEY);
};

/** Retrieve the stored JWT access token, or null if not present. */
export const getStoredToken = (): string | null => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

/** Retrieve the stored refresh token, or null if not present. */
export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
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
