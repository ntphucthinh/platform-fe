import { useCallback } from "react";
import { useDelete } from "@refinedev/core";
import { AppResource } from "@/constants/resources";

export interface UseDeleteHomestayResult {
  deleteHomestay: (
    id: number,
  ) => Promise<{ success: boolean; error: string | null; rawError?: unknown }>;
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
          resource: AppResource.Homestay,
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
          "Lỗi khi xóa homestay.";
        return { success: false, error: message, rawError: err };
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
