import noImageAvailable from "@/assets/thumb/no-image-available.jpg";
import { PriceUnit } from "@/types/pages/homestay/homestay";

export const DEFAULT_NO_IMAGE = noImageAvailable;

/** Max upload size: 10MB per file */
export const MAX_MEDIA_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_MEDIA_FILE_SIZE_MB = 10;

export const HomestayStatus = {
  Active: "Active",
  Maintenance: "Maintenance",
  Inactive: "Inactive",
} as const;

export const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  [PriceUnit.PerRoomPerNight]: "Đêm / phòng",
  [PriceUnit.PerHousePerNight]: "Đêm / căn",
};

export const PRICE_UNIT_OPTIONS = [
  { value: PriceUnit.PerRoomPerNight, label: "Đêm / phòng" },
  { value: PriceUnit.PerHousePerNight, label: "Đêm / căn" },
];

/**
 * Format room price using Vietnamese locale and correct unit label.
 * Returns neutral fallback "Chưa cập nhật giá" if amount or unit is missing.
 */
export function formatRoomPrice(
  priceAmount?: number | null,
  priceUnit?: PriceUnit | string | null
): string {
  if (
    priceAmount !== null &&
    priceAmount !== undefined &&
    !isNaN(Number(priceAmount)) &&
    Number(priceAmount) > 0
  ) {
    const formattedAmount = new Intl.NumberFormat("vi-VN").format(Number(priceAmount));
    if (priceUnit === PriceUnit.PerRoomPerNight) {
      return `${formattedAmount}đ / đêm / phòng`;
    }
    if (priceUnit === PriceUnit.PerHousePerNight) {
      return `${formattedAmount}đ / đêm / căn`;
    }
    return `${formattedAmount}đ`;
  }
  return "Chưa cập nhật giá";
}

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

