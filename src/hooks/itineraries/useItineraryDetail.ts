import { useMemo } from "react";
import { useOne } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type { ITravelItinerary } from "@/types/pages/itineraries/itinerary";
import { mapApiItineraryDetail } from "@/utils/itineraryUtils";

export interface UseItineraryDetailResult {
  data: ITravelItinerary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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

  return {
    data,
    isLoading: isValidId ? query.isLoading : false,
    error: query.error?.message || null,
    refetch,
  };
}
