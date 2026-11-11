import { useMemo } from "react";
import { useOne } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type {
  ILocation,
  ILocationWithDetails,
} from "@/types/pages/travel-map/travelMap";
import { mapApiLocationToItem } from "@/utils/travelMapUtils";

export interface UseTravelLocationDetailResult {
  data: ILocationWithDetails | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single travel location by numeric ID using Refine's useOne.
 * Uses AppResource.TravelLocation ("travel-locations").
 * Preserves numeric id throughout mapping.
 */
export function useTravelLocationDetail(
  id?: number | null,
): UseTravelLocationDetailResult {
  const isValidId = typeof id === "number" && !isNaN(id) && id > 0;

  const { query, result } = useOne<ILocation>({
    resource: AppResource.TravelLocation,
    id: isValidId ? id : "",
    queryOptions: {
      enabled: isValidId,
    },
  });

  const data = useMemo(() => {
    if (!isValidId) return null;
    const raw = result ?? (query.data?.data as ILocation | undefined);
    if (!raw) return null;
    return mapApiLocationToItem(raw);
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

