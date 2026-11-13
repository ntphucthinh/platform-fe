import { useCallback } from "react";
import { useDelete } from "@refinedev/core";
import { AppResource } from "@/constants/resources";

export interface UseDeleteTravelMemoryResult {
  deleteTravelMemory: (
    id: number,
  ) => Promise<{ success: boolean; error: string | null }>;
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
        });

        return { success: true, error: null };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Lỗi kết nối khi xóa kỷ niệm chuyến đi.";
        return { success: false, error: message };
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
