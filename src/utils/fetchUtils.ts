/**
 * fetchUtils — Centralized fetch utility for API communication.
 * Handles baseURL, CSRF token, Bearer auth token, and credentials automatically.
 */

import { env } from "@/config/env";
import { getValidAdminToken, getCsrfToken } from "@/utils/auth";

export async function fetcher(
  endpoint: string,
  init: RequestInit = {},
  skipAuth = false,
): Promise<Response> {
  const url =
    endpoint.startsWith("http://") || endpoint.startsWith("https://")
      ? endpoint
      : `${env.apiUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.body && !(init.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...((init.headers as Record<string, string>) || {}),
  };

  const csrf = getCsrfToken();
  if (csrf) {
    headers["X-CSRF-Token"] = csrf;
  }

  if (!skipAuth && !headers["Authorization"]) {
    const token = await getValidAdminToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return fetch(url, {
    ...init,
    headers,
    credentials: "include",
  });
}

