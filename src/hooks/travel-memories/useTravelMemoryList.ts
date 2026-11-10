import { useMemo } from "react";
import { useList } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import { normalizeTravelMemory } from "@/utils/travelMemoryUtils";

export interface UseTravelMemoryListOptions {
  page?: number;
  // Query parameters reserved for future search/filter implementation
  locationId?: number;
  countryCode?: string;
}

export interface UseTravelMemoryListResult {
  data: ITravelMemory[];
  total: number;
  page: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch the list of travel memories using Refine's useList.
 * Sends the required 'page' parameter without 'perPage' (backend defaults to 10).
 */
export function useTravelMemoryList(
  options?: UseTravelMemoryListOptions,
): UseTravelMemoryListResult {
  const page = options?.page ?? 1;

  const { query, result } = useList<ITravelMemory>({
    resource: AppResource.TravelMemory,
    pagination: {
      mode: "off",
    },
    meta: {
      queryParams: {
        page: page.toString(),
        ...(options?.locationId ? { locationId: options.locationId } : {}),
        ...(options?.countryCode ? { countryCode: options.countryCode } : {}),
      },
    },
  });

  const data = useMemo(() => {
    const rawList = result?.data ?? [];
    return rawList.map(normalizeTravelMemory);
  }, [result?.data]);

  const total = result?.total ?? query.data?.total ?? 0;

  const refetch = async () => {
    await query.refetch();
  };

  return {
    data,
    total,
    page,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch,
  };
}

