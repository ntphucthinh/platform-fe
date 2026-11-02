import { useCallback } from "react";
import { useDelete } from "@refinedev/core";

export interface UseDeleteHomestayResult {
  deleteHomestay: (
    id: number,
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to delete a homestay by ID using Refine's useDelete.
 */
export function useDeleteHomestay(): UseDeleteHomestayResult {
  const { mutateAsync, mutation } = useDelete();

  const deleteHomestay = useCallback(
    async (id: number) => {
      try {
        await mutateAsync({
          resource: "homestays",
          id,
        });
        return { success: true, error: null };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Lỗi khi xóa homestay.";
        return { success: false, error: message };
      }
    },
    [mutateAsync],
  );

  return {
    deleteHomestay,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}
