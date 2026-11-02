/**
 * Typed access point for Vite environment variables.
 * Only VITE_* variables are exposed to the browser.
 */

function normalizeApiUrl(raw: string | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/\/+$/, "");
}

export const env = {
  apiUrl: normalizeApiUrl(import.meta.env.VITE_API_URL as string | undefined),
  appName: import.meta.env.VITE_APP_NAME as string | undefined,
  appEnv: import.meta.env.VITE_APP_ENV as string | undefined,
  cloudinaryCloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || "aapohgop",
  cloudinaryAssetEnv: (import.meta.env.VITE_CLOUDINARY_ASSET_ENV as string | undefined) || "dev",
};
