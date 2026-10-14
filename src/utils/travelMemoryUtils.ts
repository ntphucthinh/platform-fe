import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import type {
  IDateRangeDuration,
  IRemovedDatePhotoSummary,
  ITravelMemoryDay,
  ITravelMemoryPhoto,
} from "@/types/pages/travel-memories/travelMemory";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const MAX_TRIP_DAYS = 60;

/**
 * Formats an ISO date string (YYYY-MM-DD) to Vietnamese standard DD/MM/YYYY.
 */
export function formatDateVietnamese(dateStr: string): string {
  if (!dateStr) return "";
  const parsed = dayjs(dateStr, "YYYY-MM-DD");
  if (!parsed.isValid()) return dateStr;
  return parsed.format("DD/MM/YYYY");
}

/**
 * Formats a date range into Vietnamese string: e.g. "12/06/2026 – 14/06/2026".
 */
export function formatDateRangeVietnamese(startDate: string, endDate: string): string {
  if (!startDate && !endDate) return "";
  if (startDate && !endDate) return formatDateVietnamese(startDate);
  if (!startDate && endDate) return formatDateVietnamese(endDate);
  return `${formatDateVietnamese(startDate)} – ${formatDateVietnamese(endDate)}`;
}

/**
 * Calculates calendar duration from two dates (both inclusive).
 * Example:
 * - Same day: 1 ngày 0 đêm
 * - 3 calendar days: 3 ngày 2 đêm
 * - 4 calendar days: 4 ngày 3 đêm
 */
export function calculateCalendarDuration(
  startDate: string,
  endDate: string,
): IDateRangeDuration {
  if (!startDate || !endDate) {
    return { days: 0, nights: 0, label: "0 ngày" };
  }

  const start = dayjs(startDate, "YYYY-MM-DD").startOf("day");
  const end = dayjs(endDate, "YYYY-MM-DD").startOf("day");

  if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
    return { days: 0, nights: 0, label: "0 ngày" };
  }

  const days = end.diff(start, "day") + 1;
  const nights = Math.max(0, days - 1);

  return {
    days,
    nights,
    label: `${days} ngày ${nights} đêm`,
  };
}

/**
 * Generates an inclusive array of 'YYYY-MM-DD' calendar date strings
 * from startDate to endDate.
 * Handles month boundaries, year boundaries, and leap years reliably.
 */
export function generateCalendarDateRange(
  startDate: string,
  endDate: string,
): string[] {
  if (!startDate || !endDate) return [];

  const start = dayjs(startDate, "YYYY-MM-DD").startOf("day");
  const end = dayjs(endDate, "YYYY-MM-DD").startOf("day");

  if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
    return [];
  }

  const daysDiff = end.diff(start, "day");
  // Limit to MAX_TRIP_DAYS
  if (daysDiff + 1 > MAX_TRIP_DAYS) {
    return [];
  }

  const dates: string[] = [];
  let current = start;
  while (current.isSameOrBefore(end, "day")) {
    dates.push(current.format("YYYY-MM-DD"));
    current = current.add(1, "day");
  }

  return dates;
}

/**
 * Validates a travel trip date range.
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
): { isValid: boolean; error?: string; days: number } {
  if (!startDate) {
    return { isValid: false, error: "Vui lòng chọn ngày khởi hành.", days: 0 };
  }
  if (!endDate) {
    return { isValid: false, error: "Vui lòng chọn ngày kết thúc.", days: 0 };
  }

  const start = dayjs(startDate, "YYYY-MM-DD").startOf("day");
  const end = dayjs(endDate, "YYYY-MM-DD").startOf("day");

  if (!start.isValid() || !end.isValid()) {
    return { isValid: false, error: "Định dạng ngày không hợp lệ.", days: 0 };
  }

  if (end.isBefore(start)) {
    return {
      isValid: false,
      error: "Ngày kết thúc phải diễn ra sau hoặc cùng ngày với ngày khởi hành.",
      days: 0,
    };
  }

  const days = end.diff(start, "day") + 1;
  if (days > MAX_TRIP_DAYS) {
    return {
      isValid: false,
      error: `Thời gian chuyến đi tối đa là ${MAX_TRIP_DAYS} ngày (hiện tại: ${days} ngày).`,
      days,
    };
  }

  return { isValid: true, days };
}

/**
 * Sums all photos across all days of a trip.
 */
export function countTotalPhotos(days: ITravelMemoryDay[] = []): number {
  return days.reduce((total, day) => total + (day.photos?.length || 0), 0);
}

/**
 * Identifies dates that have photos in current state but are NOT in the new dates list.
 */
export function findRemovedDatesWithPhotos(
  photosByDate: Record<string, ITravelMemoryPhoto[]>,
  newDateRange: string[],
): IRemovedDatePhotoSummary[] {
  const newDateSet = new Set(newDateRange);
  const removed: IRemovedDatePhotoSummary[] = [];

  Object.entries(photosByDate).forEach(([date, photos]) => {
    if (!newDateSet.has(date) && photos && photos.length > 0) {
      removed.push({
        date,
        formattedDate: formatDateVietnamese(date),
        photoCount: photos.length,
      });
    }
  });

  return removed.sort((a, b) => a.date.localeCompare(b.date));
}
