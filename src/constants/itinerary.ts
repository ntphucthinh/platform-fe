export enum ItineraryActivityCategory {
  Dining = "dining",
  Sightseeing = "sightseeing",
  Nature = "nature",
  Cafe = "cafe",
  Shopping = "shopping",
  Rest = "rest",
  Other = "other",
}

export const ITINERARY_ACTIVITY_CATEGORIES = [
  { value: ItineraryActivityCategory.Dining, label: "Ăn uống" },
  { value: ItineraryActivityCategory.Sightseeing, label: "Tham quan" },
  { value: ItineraryActivityCategory.Nature, label: "Thiên nhiên" },
  { value: ItineraryActivityCategory.Cafe, label: "Cà phê" },
  { value: ItineraryActivityCategory.Shopping, label: "Mua sắm" },
  { value: ItineraryActivityCategory.Rest, label: "Nghỉ ngơi" },
  { value: ItineraryActivityCategory.Other, label: "Khác" },
];

export const ITINERARY_CATEGORY_COLORS: Record<
  ItineraryActivityCategory,
  { bg: string; text: string; border: string }
> = {
  [ItineraryActivityCategory.Dining]: {
    bg: "#FEF3C7",
    text: "#B45309",
    border: "#FDE68A",
  },
  [ItineraryActivityCategory.Sightseeing]: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
    border: "#93C5FD",
  },
  [ItineraryActivityCategory.Nature]: {
    bg: "#DCFCE7",
    text: "#15803D",
    border: "#BBF7D0",
  },
  [ItineraryActivityCategory.Cafe]: {
    bg: "#F3E8FF",
    text: "#7E22CE",
    border: "#E9D5FF",
  },
  [ItineraryActivityCategory.Shopping]: {
    bg: "#FFE4E6",
    text: "#BE123C",
    border: "#FECDD3",
  },
  [ItineraryActivityCategory.Rest]: {
    bg: "#CCFBF1",
    text: "#0F766E",
    border: "#99F6E4",
  },
  [ItineraryActivityCategory.Other]: {
    bg: "#F1F5F9",
    text: "#475569",
    border: "#E2E8F0",
  },
};

export function getActivityCategoryStyle(categoryOrType: string | undefined): {
  bg: string;
  text: string;
  border: string;
} {
  if (!categoryOrType) {
    return ITINERARY_CATEGORY_COLORS[ItineraryActivityCategory.Other];
  }

  const trimmed = categoryOrType.trim();

  // 1. Kiểm tra trực tiếp theo enum value trong ITINERARY_CATEGORY_COLORS
  if (trimmed in ITINERARY_CATEGORY_COLORS) {
    return ITINERARY_CATEGORY_COLORS[trimmed as ItineraryActivityCategory];
  }

  // 2. Tra cứu theo value hoặc label định nghĩa trong ITINERARY_ACTIVITY_CATEGORIES
  const matched = ITINERARY_ACTIVITY_CATEGORIES.find(
    (c) =>
      c.value === trimmed ||
      c.label.toLowerCase() === trimmed.toLowerCase(),
  );

  if (matched) {
    return ITINERARY_CATEGORY_COLORS[matched.value];
  }

  return ITINERARY_CATEGORY_COLORS[ItineraryActivityCategory.Other];
}

/**
 * Chuyển đổi số phút sang chuỗi thời lượng hiển thị tiếng Việt (FE tính toán).
 * Ví dụ:
 * - 60  -> "1 giờ"
 * - 70  -> "1 giờ 10 phút"
 * - 90  -> "1 giờ 30 phút"
 * - 120 -> "2 giờ"
 * - 45  -> "45 phút"
 */
export function formatMinutesToDuration(
  minutesInput: number | string | undefined,
): string {
  if (
    minutesInput === undefined ||
    minutesInput === null ||
    minutesInput === ""
  ) {
    return "";
  }
  const str = String(minutesInput).trim();
  // Nếu là chuỗi số (chỉ gồm các chữ số)
  if (/^\d+$/.test(str)) {
    const totalMinutes = parseInt(str, 10);
    if (isNaN(totalMinutes) || totalMinutes <= 0) return "";

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} phút`;
    }
    if (remainingMinutes === 0) {
      return `${hours} giờ`;
    }
    return `${hours} giờ ${remainingMinutes} phút`;
  }

  // Nếu là chuỗi đã có định dạng tiếng Việt thì giữ nguyên
  return str;
}

/**
 * Trích xuất / parse số phút từ chuỗi thời lượng hoặc số (phục vụ đổ lại vào input dạng số).
 * Ví dụ:
 * - "60" -> "60"
 * - "1 giờ" -> "60"
 * - "1 giờ 10 phút" -> "70"
 * - "1.5 giờ" hoặc "1,5 giờ" -> "90"
 * - "45 phút" -> "45"
 */
export function parseDurationToMinutes(
  durationStr: string | number | undefined,
): string {
  if (durationStr === undefined || durationStr === null || durationStr === "") {
    return "";
  }
  if (typeof durationStr === "number") {
    return durationStr > 0 ? String(durationStr) : "";
  }

  const str = String(durationStr).trim().toLowerCase();
  if (/^\d+$/.test(str)) {
    return str;
  }

  // Trường hợp khoảng thời gian dạng "1–1,5 giờ" hoặc "1-2 giờ"
  const rangeMatch = str.match(
    /(\d+(?:[.,]\d+)?)\s*[-–]\s*(\d+(?:[.,]\d+)?)\s*(?:giờ|h)/,
  );
  if (rangeMatch) {
    const h2 = parseFloat(rangeMatch[2].replace(",", "."));
    if (!isNaN(h2)) {
      return String(Math.round(h2 * 60));
    }
  }

  // Trường hợp dạng "X giờ Y phút" hoặc "X giờ"
  const hourMinMatch = str.match(
    /(\d+(?:[.,]\d+)?)\s*(?:giờ|h)(?:\s*(\d+)\s*(?:phút|p)?)?/,
  );
  if (hourMinMatch) {
    const hours = parseFloat(hourMinMatch[1].replace(",", "."));
    const mins = hourMinMatch[2] ? parseInt(hourMinMatch[2], 10) : 0;
    if (!isNaN(hours)) {
      return String(Math.round(hours * 60 + mins));
    }
  }

  // Trường hợp dạng "Y phút"
  const minMatch = str.match(/(\d+)\s*(?:phút|p)/);
  if (minMatch) {
    return minMatch[1];
  }

  const digits = str.replace(/\D/g, "");
  return digits || "";
}
