import { useState, useMemo, useCallback } from "react";
import { useList } from "@refinedev/core";
import type {
  IHomestayItem,
  DbHomestay,
} from "@/types/pages/homestay/homestay";
import { mapDbHomestayToItem } from "@/utils/homestayUtils";

export interface PaginationModel {
  page: number; // 0-based for MUI DataGrid
  pageSize: number;
}

export interface UseHomestayListOptions {
  initialPage?: number; // 1-based (default 1)
  initialPageSize?: number; // default 10
}

export interface UseHomestayListResult {
  data: IHomestayItem[];
  total: number;
  page: number; // 1-based
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (pageSize: number | ((prev: number) => number)) => void;
  paginationModel: PaginationModel;
  setPaginationModel: (
    updater: PaginationModel | ((prev: PaginationModel) => PaginationModel),
  ) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage the list of homestays using Refine's useList.
 * Manages pagination state internally with useState.
 * Always paginated as the API always returns paginated data.
 */
export function useHomestayList(
  options?: UseHomestayListOptions,
): UseHomestayListResult {
  const [page, setPage] = useState<number>(options?.initialPage ?? 1);
  const [pageSize, setPageSize] = useState<number>(
    options?.initialPageSize ?? 10,
  );

  const { query, result } = useList<DbHomestay>({
    resource: "homestays",
    pagination: {
      currentPage: page,
      pageSize,
    },
  });

  const data = useMemo(() => {
    const rawList = result?.data ?? [];
    return rawList.map(mapDbHomestayToItem);
  }, [result?.data]);

  const total = result?.total ?? query.data?.total ?? 0;

  const paginationModel = useMemo(
    () => ({
      page: Math.max(0, page - 1), // Convert 1-based to 0-based for MUI DataGrid
      pageSize,
    }),
    [page, pageSize],
  );

  const setPaginationModel = useCallback(
    (
      updater: PaginationModel | ((prev: PaginationModel) => PaginationModel),
    ) => {
      setPage((prevPage) => {
        const currentModel: PaginationModel = {
          page: Math.max(0, prevPage - 1),
          pageSize,
        };
        const nextModel =
          typeof updater === "function" ? updater(currentModel) : updater;
        if (nextModel.pageSize !== pageSize) {
          setPageSize(nextModel.pageSize);
        }
        return nextModel.page + 1;
      });
    },
    [pageSize],
  );

  const refetch = async () => {
    await query.refetch();
  };

  return {
    data,
    total,
    page,
    pageSize,
    setPage,
    setPageSize,
    paginationModel,
    setPaginationModel,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch,
  };
}
