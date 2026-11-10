import { useMemo } from "react";
import { useOne } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import { normalizeTravelMemory } from "@/utils/travelMemoryUtils";

export interface UseTravelMemoryDetailResult {
  data: ITravelMemory | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single travel memory by ID using Refine's useOne.
 * Uses AppResource.TravelMemoryID ("travel-memories/:id").
 */
export function useTravelMemoryDetail(
  id?: number | null,
): UseTravelMemoryDetailResult {
  const isValidId = typeof id === "number" && !isNaN(id) && id > 0;

  const { query, result } = useOne<ITravelMemory>({
    resource: AppResource.TravelMemoryID,
    id: isValidId ? id : "",
    queryOptions: {
      enabled: isValidId,
    },
  });

  const data = useMemo(() => {
    if (!isValidId) return null;
    const raw = result ?? (query.data?.data as ITravelMemory | undefined);
    if (!raw) return null;
    return normalizeTravelMemory(raw);
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

