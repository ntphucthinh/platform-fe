import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import { getPublicImageUrl } from "@/utils/homestayUtils";
import {
  ITINERARY_ACTIVITY_CATEGORIES,
  ItineraryActivityCategory,
  ITINERARY_CATEGORY_COLORS,
} from "@/constants/itinerary";
import type {
  IItineraryListItem,
  ITravelItinerary,
  ItineraryActivityType,
} from "@/types/pages/itineraries/itinerary";

/**
 * Lấy style màu sắc (bg, text, border) cho loại hoạt động lịch trình.
 */
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

/**
 * Maps raw backend item from GET /itineraries to frontend IItineraryListItem.
 * Handles both backend schema (itineraryName, locationName, coverImagePath)
 * and legacy/mock schema (title, destination, coverImage).
 */
export function mapApiItineraryListItem(
  raw: IItineraryListItem | Record<string, unknown>,
): IItineraryListItem {
  const id = Number(raw.id || 0);
  const itineraryName = (raw.itineraryName as string) || (raw.title as string) || "";
  const title = itineraryName;
  const locationName = (raw.locationName as string) || (raw.destination as string) || "";
  const destination = locationName;
  const locationId =
    raw.locationId !== undefined && raw.locationId !== null
      ? Number(raw.locationId)
      : null;

  const durationDays = Number(raw.durationDays || 0);
  const durationNights = Number(raw.durationNights || 0);
  const duration =
    (raw.duration as string) ||
    (durationDays > 0 ? `${durationDays} ngày ${durationNights} đêm` : "");

  const activityCount = Number(raw.activityCount || 0);
  const description = (raw.description as string) || "";
  const coverImagePath = (raw.coverImagePath as string) || null;
  const coverImage = coverImagePath
    ? getPublicImageUrl(coverImagePath)
    : ((raw.coverImage as string) || DEFAULT_NO_IMAGE);

  const updatedAt = (raw.updatedAt as string) || "";

  return {
    id,
    locationId,
    locationName,
    itineraryName,
    title,
    destination,
    duration,
    durationDays,
    durationNights,
    daysCount: durationDays,
    activityCount,
    updatedAt,
    description,
    coverImagePath,
    coverImage,
    hasDetailPreview: true,
  };
}

/**
 * Maps raw backend detail from GET /itineraries/{itineraryID} to frontend ITravelItinerary.
 * Handles nested themes, featuredImages, days, and activities.
 */
export function mapApiItineraryDetail(
  raw: ITravelItinerary | Record<string, unknown>,
): ITravelItinerary {
  const id = Number(raw.id || 0);
  const itineraryName = (raw.itineraryName as string) || (raw.title as string) || "";
  const title = itineraryName;
  const locationName = (raw.locationName as string) || (raw.destination as string) || null;
  const destination = locationName || "";
  const locationId =
    raw.locationId !== undefined && raw.locationId !== null
      ? Number(raw.locationId)
      : null;

  const rawDays = Array.isArray(raw.days) ? raw.days : [];
  const durationDays = Number(raw.durationDays || rawDays.length || 1);
  const durationNights =
    raw.durationNights !== undefined && raw.durationNights !== null
      ? Number(raw.durationNights)
      : Math.max(0, durationDays - 1);

  const duration =
    (raw.duration as string) || `${durationDays} ngày ${durationNights} đêm`;
  const suitableFor = (raw.suitableFor as string) || "Cặp đôi, nhóm bạn, gia đình";
  const description = (raw.description as string) || "";
  const coverImagePath = (raw.coverImagePath as string) || null;
  const coverImage = coverImagePath
    ? getPublicImageUrl(coverImagePath)
    : ((raw.coverImage as string) || DEFAULT_NO_IMAGE);

  const travelTips = Array.isArray(raw.travelTips)
    ? (raw.travelTips as string[])
    : [];

  const rawThemes = Array.isArray(raw.themes) ? raw.themes : [];
  const themes = rawThemes.map((t: unknown) => {
    if (typeof t === "string") return t;
    if (t && typeof t === "object" && "name" in t) {
      return String((t as { name: unknown }).name);
    }
    return "";
  }).filter(Boolean);

  const themeObjects = rawThemes
    .filter((t: unknown): t is { id: number; name: string } =>
      Boolean(t && typeof t === "object" && "id" in t && "name" in t),
    )
    .map((t) => ({ id: Number(t.id), name: String(t.name) }));

  const rawImages = Array.isArray(raw.featuredImages) ? raw.featuredImages : [];
  const featuredImages = rawImages.map((img: unknown, idx: number) => {
    const item = (img && typeof img === "object" ? img : {}) as Record<string, unknown>;
    const imgId = Number(item.id || idx + 1);
    const imgPath = (item.imagePath as string) || null;
    const url = imgPath
      ? getPublicImageUrl(imgPath)
      : ((item.url as string) || DEFAULT_NO_IMAGE);

    return {
      id: imgId,
      imagePath: imgPath || undefined,
      title: (item.title as string) || `Ảnh ${idx + 1}`,
      url,
      caption: (item.caption as string) || "",
    };
  });

  const days = rawDays.map((d: unknown, dayIdx: number) => {
    const day = (d && typeof d === "object" ? d : {}) as Record<string, unknown>;
    const dayNum = Number(day.dayNumber || dayIdx + 1);
    const dayId =
      day.id !== undefined && day.id !== null ? Number(day.id) : dayNum;
    const dayImagePath = (day.imagePath as string) || null;
    const dayTips = Array.isArray(day.dayTips)
      ? (day.dayTips as string[])
      : [];

    const rawActivities = Array.isArray(day.activities) ? day.activities : [];
    const activities = rawActivities.map((a: unknown, actIdx: number) => {
      const act = (a && typeof a === "object" ? a : {}) as Record<string, unknown>;
      const actId =
        act.id !== undefined && act.id !== null ? Number(act.id) : actIdx + 1;
      const startTime =
        (act.startTime as string) || (act.time as string) || "";
      const actTitle = (act.title as string) || "";

      const rawCategory =
        (act.activityCategory as string) || (act.category as string);
      const rawType = (act.type as string) || "";
      const lowerRaw = (rawCategory || "").trim().toLowerCase();
      const lowerType = rawType.trim().toLowerCase();

      const matchedCategory = ITINERARY_ACTIVITY_CATEGORIES.find(
        (c) =>
          c.value.toLowerCase() === lowerRaw ||
          c.label.toLowerCase() === lowerRaw ||
          c.label.toLowerCase() === lowerType,
      );

      const categoryEnum =
        matchedCategory?.value ||
        (rawCategory as ItineraryActivityCategory) ||
        ItineraryActivityCategory.Other;

      const typeLabel =
        matchedCategory?.label || rawType || "Tham quan";

      const durationMinutes =
        act.durationMinutes !== undefined && act.durationMinutes !== null
          ? Number(act.durationMinutes)
          : act.duration
            ? parseDurationToMinutes(act.duration as string)
            : undefined;

      const durationText =
        (act.duration as string) ||
        (durationMinutes !== undefined
          ? formatMinutesToDuration(durationMinutes)
          : "");

      const location = (act.location as string) || "";
      const googleMapsUrl =
        (act.googleMapsUrl as string) || (act.mapUrl as string) || "";
      const actDesc = (act.description as string) || "";
      const notes = (act.notes as string) || "";
      const actImagePath = (act.imagePath as string) || null;
      const actImage = actImagePath
        ? getPublicImageUrl(actImagePath)
        : ((act.image as string) || DEFAULT_NO_IMAGE);

      return {
        id: actId,
        time: startTime,
        startTime,
        title: actTitle,
        type: typeLabel as ItineraryActivityType,
        category: categoryEnum,
        activityCategory: categoryEnum,
        duration: durationText,
        durationMinutes:
          durationMinutes !== undefined && !isNaN(Number(durationMinutes))
            ? Number(durationMinutes)
            : undefined,
        location,
        mapUrl: googleMapsUrl,
        googleMapsUrl,
        description: actDesc,
        notes,
        imagePath: actImagePath,
        image: actImage,
      };
    });

    return {
      id: dayId,
      dayNumber: dayNum,
      title: (day.title as string) || `Ngày ${dayNum}`,
      subtitle: (day.subtitle as string) || undefined,
      date: (day.date as string) || undefined,
      summary: (day.summary as string) || undefined,
      description: (day.description as string) || (day.summary as string) || undefined,
      imagePath: dayImagePath,
      coverImage: dayImagePath
        ? getPublicImageUrl(dayImagePath)
        : ((day.coverImage as string) || ""),
      dayTips,
      dayTipsText: dayTips.join("\n"),
      activities,
    };
  });

  const activityCount =
    raw.activityCount !== undefined && raw.activityCount !== null
      ? Number(raw.activityCount)
      : days.reduce((acc, d) => acc + d.activities.length, 0);

  return {
    id,
    locationId,
    locationName,
    itineraryName,
    title,
    destination,
    duration,
    durationDays,
    durationNights,
    description,
    coverImagePath,
    coverImage,
    suitableFor,
    themes,
    themeObjects,
    days,
    featuredImages,
    travelTips,
    activityCount,
    createdAt: (raw.createdAt as string) || undefined,
    updatedAt: (raw.updatedAt as string) || undefined,
  };
}
