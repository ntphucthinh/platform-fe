import noImageAvailable from "@/assets/thumb/no-image-available.jpg";

export const DEFAULT_NO_IMAGE = noImageAvailable;

/** Max upload size: 10MB per file */
export const MAX_MEDIA_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_MEDIA_FILE_SIZE_MB = 10;

export const HomestayStatus = {
  Active: "Active",
  Maintenance: "Maintenance",
  Inactive: "Inactive",
} as const;

/**
 * Checks whether a URL, file path, or filename corresponds to a video file.
 */
export function isVideoMedia(urlOrPath: string | null | undefined): boolean {
  if (!urlOrPath) return false;
  const clean = urlOrPath.split("?")[0].toLowerCase();
  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".ogg") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".mkv") ||
    clean.startsWith("data:video/")
  );
}
