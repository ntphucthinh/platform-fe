import { useMemo } from "react";
import { useOne } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type { IHomestayItem, DbHomestay } from "@/types/pages/homestay/homestay";
import { mapDbHomestayToItem } from "@/utils/homestayUtils";

export interface UseHomestayDetailResult {
  data: IHomestayItem | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single homestay detail by ID using Refine's useOne.
 */
export function useHomestayDetail(
  id?: number | string | null,
): UseHomestayDetailResult {
  const numericId = id ? Number(id) : NaN;
  const isValidId = !isNaN(numericId) && numericId > 0;

  const { query, result } = useOne<DbHomestay>({
    resource: AppResource.Homestay,
    id: isValidId ? numericId : "",
    queryOptions: {
      enabled: isValidId,
    },
  });

  const data = useMemo(() => {
    if (!isValidId || !result) return null;
    return mapDbHomestayToItem(result);
  }, [isValidId, result]);

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
