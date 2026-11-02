import { fetcher } from "@/utils/fetchUtils";
import {
  type StoredAdminUser,
  getValidAdminToken,
  getCsrfToken,
  refreshAdminSession,
} from "@/utils/auth";

export interface LoginResponse {
  data?: {
    accessToken?: string;
    csrfToken?: string;
  };
  message?: string;
  error?: string;
}

export interface UserMeResponse {
  id: number;
  name: string;
  email: string;
  accountType: string;
}

const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await fetcher(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    },
    true,
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;
    throw new Error(error?.error || error?.message || "Đăng nhập thất bại");
  }

  return (await response.json()) as LoginResponse;
};

const logout = async (): Promise<void> => {
  const response = await fetcher("/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }
};

const getMe = async (): Promise<UserMeResponse> => {
  const response = await fetcher("/auth/me", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get me");
  }

  return (await response.json()) as UserMeResponse;
};

const refreshToken = async (): Promise<LoginResponse> => {
  const response = await fetcher(
    "/auth/refresh",
    {
      method: "POST",
    },
    true,
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return (await response.json()) as LoginResponse;
};

// Re-export session helpers for backward compatibility
export {
  getValidAdminToken,
  getCsrfToken,
  refreshAdminSession,
  type StoredAdminUser,
};

export { login, logout, getMe, refreshToken };

const AuthService = {
  login,
  logout,
  getMe,
  refreshToken,
};

export default AuthService;
