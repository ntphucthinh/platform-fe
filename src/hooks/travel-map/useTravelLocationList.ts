import { useMemo } from "react";
import { useList } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type {
  ILocation,
  ILocationWithDetails,
} from "@/types/pages/travel-map/travelMap";
import { LocationStatus } from "@/constants/travelMap";
import { mapApiLocationToItem } from "@/utils/travelMapUtils";

export interface UseTravelLocationListOptions {
  search?: string;
  status?: LocationStatus;
  year?: number;
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
  const { query, result } = useList<ILocation>({
    resource: AppResource.TravelLocation,
    pagination: {
      mode: "off",
    },
    meta: {
      queryParams: {
        ...(options?.search?.trim() ? { search: options.search.trim() } : {}),
        ...(options?.status ? { status: options.status } : {}),
        ...(options?.year !== undefined && options?.year !== null
          ? { year: options.year }
          : {}),
        ...(options?.countryCode?.trim()
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

