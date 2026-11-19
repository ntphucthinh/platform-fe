import { useMemo } from "react";
import { useOne } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type {
  ITravelItinerary,
  ICreateItineraryInput,
  IUpdateItineraryInput,
} from "@/types/pages/itineraries/itinerary";
import { mapApiItineraryDetail } from "@/utils/itineraryUtils";

export interface UseItineraryDetailResult {
  data: ITravelItinerary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createItinerary: (input: ICreateItineraryInput) => ITravelItinerary;
  updateItinerary: (
    id: number | string,
    input: IUpdateItineraryInput,
  ) => ITravelItinerary | null;
}

/**
 * Custom hook to fetch itinerary detail by ID via Refine's useOne (GET /itineraries/:itineraryID).
 * Preserves numeric ID across data models.
 */
export function useItineraryDetail(
  id?: number | string | null,
): UseItineraryDetailResult {
  const numericId =
    typeof id === "string" ? Number(id) : typeof id === "number" ? id : null;
  const isValidId =
    typeof numericId === "number" && !isNaN(numericId) && numericId > 0;

  const { query, result } = useOne<ITravelItinerary>({
    resource: AppResource.ItineraryID,
    id: isValidId ? numericId : "",
    queryOptions: {
      enabled: isValidId,
    },
  });

  const data = useMemo(() => {
    if (!isValidId) return null;
    const raw = result ?? (query.data?.data as ITravelItinerary | undefined);

    if (raw) {
      return mapApiItineraryDetail(raw);
    }

    return null;
  }, [isValidId, result, query.data?.data]);

  const refetch = async () => {
    await query.refetch();
  };

  const createItinerary = (input: ICreateItineraryInput): ITravelItinerary => {
    const daysCount = input.durationDays || input.days.length || 1;
    const nightsCount =
      input.durationNights !== undefined
        ? input.durationNights
        : Math.max(0, daysCount - 1);

    const durationStr =
      input.duration || `${daysCount} ngày ${nightsCount} đêm`;

    const newId = Date.now();
    return {
      id: newId,
      locationId: input.locationId ?? undefined,
      title: input.title.trim(),
      itineraryName: input.title.trim(),
      destination: (input.destination || "").trim(),
      locationName: (input.destination || "").trim(),
      duration: durationStr,
      durationDays: daysCount,
      durationNights: nightsCount,
      description: input.description.trim(),
      coverImage: input.coverImage,
      suitableFor: input.suitableFor || "Mọi đối tượng",
      themes: input.themes.length > 0 ? input.themes : ["Du lịch", "Khám phá"],
      days: input.days.map((d, idx) => ({
        ...d,
        id: d.id || idx + 1,
        dayNumber: idx + 1,
        activities: (d.activities || []).map((act, actIdx) => ({
          ...act,
          id: act.id || actIdx + 1,
        })),
      })),
      featuredImages: input.featuredImages || [
        {
          id: 1,
          title: input.title,
          url: input.coverImage,
          caption: (input.destination || input.title || "").trim(),
        },
      ],
      travelTips:
        input.travelTips && input.travelTips.length > 0
          ? input.travelTips
          : [
              "Thời gian di chuyển có thể thay đổi tùy tình hình giao thông.",
              "Nên chuẩn bị trang phục phù hợp với thời tiết điểm đến.",
              "Lịch trình có thể tùy chỉnh linh hoạt theo nhu cầu thực tế.",
            ],
      activityCount: input.days.reduce(
        (acc, d) => acc + (d.activities?.length || 0),
        0,
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toLocaleDateString("vi-VN"),
    };
  };

  const updateItinerary = (
    id: number | string,
    input: IUpdateItineraryInput,
  ): ITravelItinerary | null => {
    if (!id || !input) return null;
    return null;
  };

  return {
    data,
    isLoading: isValidId ? query.isLoading : false,
    error: query.error?.message || null,
    refetch,
    createItinerary,
    updateItinerary,
  };
}
