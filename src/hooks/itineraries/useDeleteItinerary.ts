import { useCallback } from "react";
import { useDelete } from "@refinedev/core";
import { AppResource } from "@/constants/resources";

export interface UseDeleteItineraryResult {
  deleteItinerary: (
    id: number | string,
  ) => Promise<{ success: boolean; error: string | null; rawError?: unknown }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for deleting an itinerary by ID using Refine's useDelete (DELETE /itineraries/{itineraryID}).
 */
export function useDeleteItinerary(): UseDeleteItineraryResult {
  const { mutateAsync: deleteMutate, mutation } = useDelete();

  const deleteItinerary = useCallback(
    async (id: number | string) => {
      try {
        const numericId = Number(id);
        if (!numericId || isNaN(numericId) || numericId <= 0) {
          return { success: false, error: "Mã lịch trình không hợp lệ." };
        }

        await deleteMutate({
          resource: AppResource.Itinerary,
          id: numericId,
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
          "Lỗi kết nối khi xóa lịch trình.";
        return { success: false, error: message, rawError: err };
      }
    },
    [deleteMutate],
  );

  return {
    deleteItinerary,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}

export default useDeleteItinerary;
