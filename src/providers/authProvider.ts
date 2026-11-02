import type { AuthProvider } from "@refinedev/core";
import AuthService from "@/services/authService";
import {
  isAuthenticated,
  setAdminAuthenticated,
  clearAdminAuthenticated,
  getStoredAdminUser,
  getCsrfToken,
  type StoredAdminUser,
} from "@/utils/auth";
import type { ILoginFormData } from "@/types/pages/auth/login";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: Partial<ILoginFormData>) => {
    if (!email || !password) {
      return {
        success: false,
        error: new Error("Vui lòng nhập đầy đủ email và mật khẩu."),
      };
    }

    try {
      const result = await AuthService.login(email, password);
      const csrfToken = result?.data?.csrfToken || getCsrfToken() || "";
      const accessToken =
        result?.data?.accessToken || csrfToken || "session_token";

      let user: StoredAdminUser = {
        id: "1",
        email: email.trim().toLowerCase(),
        username: email.trim().toLowerCase().split("@")[0],
        fullName: email.trim().toLowerCase().split("@")[0],
      };

      try {
        const meData = await AuthService.getMe();
        if (meData) {
          user = {
            id: String(meData.id),
            email: meData.email || user.email,
            username: meData.name || user.username,
            fullName: meData.name || user.fullName,
          };
        }
      } catch {
        // Keep fallback user
      }

      setAdminAuthenticated(
        true,
        user,
        accessToken,
        "",
        24 * 60 * 60,
        csrfToken,
      );

      return {
        success: true,
        redirectTo: "/admin/homestay",
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Đăng nhập thất bại.";
      return {
        success: false,
        error: new Error(message),
      };
    }
  },

  logout: async () => {
    try {
      await AuthService.logout();
    } catch {
      // Ignore network error on logout
    } finally {
      clearAdminAuthenticated();
    }
    return {
      success: true,
      redirectTo: "/admin/login",
    };
  },

  check: async () => {
    if (isAuthenticated()) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/admin/login",
      logout: true,
    };
  },

  onError: async (error: unknown) => {
    const err =
      error instanceof Error ? error : new Error("Authentication error");
    return { error: err };
  },

  getIdentity: async (): Promise<StoredAdminUser | null> => {
    const localUser = getStoredAdminUser();
    if (localUser) return localUser;

    try {
      const meData = await AuthService.getMe();
      if (!meData) return null;
      return {
        id: String(meData.id),
        email: meData.email,
        username: meData.name || meData.email.split("@")[0],
        fullName: meData.name || meData.email.split("@")[0],
      };
    } catch {
      return null;
    }
  },
};
