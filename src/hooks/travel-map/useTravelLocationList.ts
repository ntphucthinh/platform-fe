import { useMemo } from "react";
import { useCustom } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type {
  ILocation,
  ILocationWithDetails,
  ILocationStatusCounts,
  ITravelLocationListApiResponse,
} from "@/types/pages/travel-map/travelMap";
import { LocationStatus } from "@/constants/travelMap";
import { mapApiLocationToItem } from "@/utils/travelMapUtils";

export interface UseTravelLocationListOptions {
  status?: LocationStatus;
  countryCode?: string;
}

export interface UseTravelLocationListResult {
  data: ILocationWithDetails[];
  total: number;
  statusCounts: ILocationStatusCounts;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch the list of travel locations using Refine's useCustom.
 * Preserves numeric id throughout mapping and consumes API statusCounts & total directly.
 */
export function useTravelLocationList(
  options?: UseTravelLocationListOptions,
): UseTravelLocationListResult {
  const status = options?.status;
  const countryCode = options?.countryCode;

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (status) {
      params.status = status;
    }
    if (countryCode?.trim()) {
      params.countryCode = countryCode.trim().toUpperCase();
    }
    return Object.keys(params).length > 0 ? params : undefined;
  }, [status, countryCode]);

  const { query, result } = useCustom<ITravelLocationListApiResponse>({
    url: AppResource.TravelLocation,
    method: "get",
    meta: {
      query: queryParams,
    },
  });

  const apiResponse = (result?.data ?? query.data?.data) as
    | ITravelLocationListApiResponse
    | ILocation[]
    | undefined;

  const rawList = useMemo<ILocation[]>(() => {
    if (!apiResponse) return [];
    if (Array.isArray(apiResponse)) return apiResponse;
    if (Array.isArray(apiResponse.data)) return apiResponse.data;
    return [];
  }, [apiResponse]);

  const data = useMemo(() => {
    return rawList.map(mapApiLocationToItem);
  }, [rawList]);

  const statusCounts = useMemo<ILocationStatusCounts>(() => {
    const responseCounts =
      apiResponse && !Array.isArray(apiResponse)
        ? apiResponse.statusCounts
        : undefined;

    if (
      responseCounts &&
      typeof responseCounts.visited === "number" &&
      typeof responseCounts.wishlist === "number"
    ) {
      return {
        visited: responseCounts.visited,
        wishlist: responseCounts.wishlist,
      };
    }

    let visited = 0;
    let wishlist = 0;
    for (const loc of data) {
      if (loc.status === LocationStatus.Visited) visited++;
      else if (loc.status === LocationStatus.Wishlist) wishlist++;
    }
    return { visited, wishlist };
  }, [apiResponse, data]);

  const total = useMemo<number>(() => {
    const responseTotal =
      apiResponse && !Array.isArray(apiResponse)
        ? apiResponse.total
        : undefined;

    if (
      typeof responseTotal === "number" &&
      !isNaN(responseTotal) &&
      responseTotal > 0
    ) {
      return responseTotal;
    }
    return (statusCounts.visited ?? 0) + (statusCounts.wishlist ?? 0);
  }, [apiResponse, statusCounts]);

  const refetch = async () => {
    await query.refetch();
  };

  return {
    data,
    total,
    statusCounts,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch,
  };
}
