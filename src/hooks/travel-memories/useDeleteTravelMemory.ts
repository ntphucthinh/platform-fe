import { useCallback } from "react";
import { useDelete } from "@refinedev/core";
import { AppResource } from "@/constants/resources";

export interface UseDeleteTravelMemoryResult {
  deleteTravelMemory: (
    id: number,
  ) => Promise<{ success: boolean; error: string | null; rawError?: unknown }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for deleting a travel memory by ID using Refine's useDelete.
 */
export function useDeleteTravelMemory(): UseDeleteTravelMemoryResult {
  const { mutateAsync: deleteMutate, mutation } = useDelete();

  const deleteTravelMemory = useCallback(
    async (id: number) => {
      try {
        if (!id || id <= 0) {
          return { success: false, error: "Mã chuyến đi không hợp lệ." };
        }

        await deleteMutate({
          resource: AppResource.TravelMemory,
          id,
          successNotification: false,
          errorNotification: false,
        });

        return { success: true, error: null };
      } catch (err: unknown) {
        const errObj = err as {
          message?: string;
          statusCode?: number;
          body?: { error?: string; message?: string; msg?: string };
        };
        const message =
          errObj?.body?.error ||
          errObj?.body?.message ||
          errObj?.body?.msg ||
          errObj?.message ||
          (err instanceof Error ? err.message : null) ||
          "Lỗi kết nối khi xóa kỷ niệm chuyến đi.";
        return { success: false, error: message, rawError: err };
      }
    },
    [deleteMutate],
  );

  return {
    deleteTravelMemory,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}
