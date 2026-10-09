/**
 * Auth utility — development-stage session flag stored in localStorage.
 *
 * ⚠️  DEVELOPMENT ONLY:  This stores a simple boolean flag and a minimal
 * user profile.  It does NOT represent a cryptographically verified session.
 * Replace with a proper token / session mechanism before production.
 */

export const ADMIN_AUTH_KEY = "admin_authenticated";
export const ADMIN_USER_KEY = "admin_user";
export const ADMIN_TOKEN_KEY = "admin_token";

/** Minimal user info persisted after successful credential check. */
export interface StoredAdminUser {
  /** Supabase Auth UUID */
  id: string;
  email: string;
  username: string;
  fullName: string;
}

/**
 * Returns true only if the explicit "true" flag is present in localStorage.
 * Intentionally returns false for missing or any other value — the previous
 * implementation had a bug that auto-granted access when no key existed.
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
};

/** Persist authentication state, the minimum user profile, and the JWT token. */
export const setAdminAuthenticated = (
  status: boolean,
  user?: StoredAdminUser,
  accessToken?: string
): void => {
  if (status && user) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    if (accessToken) {
      localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
    }
  } else {
    localStorage.setItem(ADMIN_AUTH_KEY, "false");
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
};

/** Remove all authentication state (used on logout). */
export const clearAdminAuthenticated = (): void => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

/** Retrieve the stored JWT access token, or null if not present. */
export const getStoredToken = (): string | null => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
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
