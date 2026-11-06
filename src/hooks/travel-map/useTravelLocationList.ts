import { useMemo } from "react";
import { useList } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type {
  ApiTravelLocation,
  ILocationWithDetails,
} from "@/types/pages/travel-map/travelMap";
import { mapApiLocationToItem } from "@/utils/travelMapUtils";

export interface UseTravelLocationListOptions {
  search?: string;
  status?: string;
  year?: number | string;
  countryCode?: string;
}

export interface UseTravelLocationListResult {
  data: ILocationWithDetails[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch the list of travel locations using Refine's useList.
 * Preserves numeric id throughout mapping.
 */
export function useTravelLocationList(
  options?: UseTravelLocationListOptions,
): UseTravelLocationListResult {
  const { query, result } = useList<ApiTravelLocation>({
    resource: AppResource.TravelLocation,
    pagination: {
      mode: "off",
    },
    meta: {
      queryParams: {
        ...(options?.search ? { search: options.search } : {}),
        ...(options?.status && options.status !== "ALL"
          ? { status: options.status.toLowerCase() }
          : {}),
        ...(options?.year && options.year !== "ALL"
          ? { year: options.year }
          : {}),
        ...(options?.countryCode
          ? { countryCode: options.countryCode.trim().toUpperCase() }
          : {}),
      },
    },
  });

  const data = useMemo(() => {
    const rawList = result?.data ?? [];
    return rawList.map(mapApiLocationToItem);
  }, [result?.data]);

  const total = result?.total ?? query.data?.total ?? data.length;

  const refetch = async () => {
    await query.refetch();
  };

  return {
    data,
    total,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch,
  };
}

