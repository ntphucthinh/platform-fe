import { useState, useMemo, useCallback } from "react";
import { useList } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type { IItineraryListItem } from "@/types/pages/itineraries/itinerary";
import { mapApiItineraryListItem } from "@/utils/itineraryUtils";

export interface PaginationModel {
  page: number; // 0-based for MUI DataGrid
  pageSize: number;
}

export interface UseItineraryListOptions {
  page?: number;
  perPage?: number;
  locationId?: number | null;
}

export interface UseItineraryListResult {
  data: IItineraryListItem[];
  total: number;
  page: number; // 1-based
  perPage: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPerPage: (perPage: number | ((prev: number) => number)) => void;
  paginationModel: PaginationModel;
  setPaginationModel: (
    updater: PaginationModel | ((prev: PaginationModel) => PaginationModel),
  ) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteItinerary: (id: number | string) => boolean;
}

/**
 * Custom hook to fetch a paginated list of itineraries via Refine's useList (GET /itineraries).
 * Supports server-side pagination with query params: page, perPage, locationId.
 * Provides paginationModel and setPaginationModel for MUI DataGrid integration.
 */
export function useItineraryList(
  options?: UseItineraryListOptions,
): UseItineraryListResult {
  const [page, setPage] = useState<number>(options?.page ?? 1);
  const [perPage, setPerPage] = useState<number>(options?.perPage ?? 10);

  const targetLocationId = options?.locationId;
  const [prevLocationId, setPrevLocationId] = useState(targetLocationId);
  if (targetLocationId !== prevLocationId) {
    setPrevLocationId(targetLocationId);
    setPage(1);
  }

  const { query, result } = useList<IItineraryListItem>({
    resource: AppResource.Itinerary,
    pagination: {
      currentPage: page,
      pageSize: perPage,
    },
    filters:
      targetLocationId !== undefined &&
      targetLocationId !== null &&
      !isNaN(Number(targetLocationId))
        ? [
            {
              field: "locationId",
              operator: "eq",
              value: Number(targetLocationId),
            },
          ]
        : undefined,
  });

  const data = useMemo(() => {
    const rawList =
      result?.data ?? (query.data?.data as unknown[] | undefined);

    if (rawList && Array.isArray(rawList)) {
      return rawList.map(mapApiItineraryListItem);
    }

    return [];
  }, [result?.data, query.data?.data]);

  const total =
    result?.total ??
    query.data?.total ??
    (result as { paginatorInfo?: { total?: number } })?.paginatorInfo?.total ??
    (query.data as { paginatorInfo?: { total?: number } })?.paginatorInfo?.total ??
    0;

  const paginationModel = useMemo(
    () => ({
      page: Math.max(0, page - 1), // 0-based for MUI DataGrid
      pageSize: perPage,
    }),
    [page, perPage],
  );

  const setPaginationModel = useCallback(
    (
      updater: PaginationModel | ((prev: PaginationModel) => PaginationModel),
    ) => {
      const currentModel: PaginationModel = {
        page: Math.max(0, page - 1),
        pageSize: perPage,
      };
      const nextModel =
        typeof updater === "function" ? updater(currentModel) : updater;

      if (nextModel.pageSize !== perPage) {
        setPerPage(nextModel.pageSize);
      }
      setPage(nextModel.page + 1);
    },
    [page, perPage],
  );

  const refetch = async () => {
    await query.refetch();
  };

  const deleteItinerary = (id: number | string): boolean => {
    // Temporary client-side mock delete until DELETE API is connected
    return Boolean(id);
  };

  return {
    data,
    total,
    page,
    perPage,
    setPage,
    setPerPage,
    paginationModel,
    setPaginationModel,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch,
    deleteItinerary,
  };
}
