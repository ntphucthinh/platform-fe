import { useCallback } from "react";
import { useDelete } from "@refinedev/core";
import { AppResource } from "@/constants/resources";

export interface UseDeleteTravelLocationResult {
  deleteLocation: (
    id: number,
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for deleting a travel location by ID using Refine's useDelete.
 */
export function useDeleteTravelLocation(): UseDeleteTravelLocationResult {
  const { mutateAsync: deleteMutate, mutation } = useDelete();

  const deleteLocation = useCallback(
    async (id: number) => {
      try {
        await deleteMutate({
          resource: AppResource.TravelLocation,
          id,
        });
        return { success: true, error: null };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Lỗi kết nối khi xóa địa điểm du lịch.";
        return { success: false, error: message };
      }
    },
    [deleteMutate],
  );

  return {
    deleteLocation,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}

