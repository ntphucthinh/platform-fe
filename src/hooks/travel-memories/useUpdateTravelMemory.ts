import { useState, useCallback } from "react";
import { useUpdate } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import { useUploadFile } from "@/hooks/common/useUploadFile";
import type {
  IUpdateTravelMemoryPayload,
  IUpdateTravelMemoryPhotoPayload,
  ITravelMemoryFormSubmitData,
  ITravelMemoryPhoto,
} from "@/types/pages/travel-memories/travelMemory";

export interface UseUpdateTravelMemoryResult {
  updateTravelMemory: (
    id: number,
    formData: ITravelMemoryFormSubmitData,
    onProgress?: (completed: number, total: number) => void,
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to update an existing travel memory using Refine's useUpdate and useUploadFile.
 * Manages existing vs newly uploaded daily photos and cover image.
 */
export function useUpdateTravelMemory(): UseUpdateTravelMemoryResult {
  const { uploadFile, uploadBatch } = useUploadFile();
  const { mutateAsync: updateMutate, mutation } = useUpdate<{ message: string }>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTravelMemory = useCallback(
    async (
      id: number,
      formData: ITravelMemoryFormSubmitData,
      onProgress?: (completed: number, total: number) => void,
    ) => {
      setError(null);
      try {
        if (!id || id <= 0) {
          const msg = "Mã chuyến đi không hợp lệ.";
          setError(msg);
          return { success: false, error: msg };
        }

        if (!formData.locationId || Number(formData.locationId) <= 0) {
          const msg = "Vui lòng chọn địa điểm du lịch hợp lệ.";
          setError(msg);
          return { success: false, error: msg };
        }

        let coverImagePath: string | null = formData.coverImagePath ?? null;

        // 1. Upload new Cover Image if provided
        if (formData.coverImageFile) {
          setIsUploading(true);
          const uploadRes = await uploadFile(
            formData.coverImageFile,
            "travel_memories",
          );
          setIsUploading(false);
          if (uploadRes.error) {
            setError(uploadRes.error);
            return { success: false, error: uploadRes.error };
          }
          if (uploadRes.path) {
            coverImagePath = uploadRes.path;
          }
        }

        // 2. Collect and batch upload any new daily photos (those that have File object)
        const filesToUpload: { item: ITravelMemoryPhoto; file: File }[] = [];
        (formData.days || []).forEach((day) => {
          (day.photos || []).forEach((photo) => {
            if (photo.file) {
              filesToUpload.push({ item: photo, file: photo.file });
            }
          });
        });

        const uploadedMap = new Map<number, string>();
        if (filesToUpload.length > 0) {
          setIsUploading(true);
          const uploadBatchRes = await uploadBatch(
            filesToUpload,
            "travel_memories",
            3,
            onProgress,
          );
          setIsUploading(false);

          if (uploadBatchRes.failed.length > 0) {
            const msg = `Tải ảnh lên máy chủ thất bại: ${uploadBatchRes.failed[0].error}`;
            setError(msg);
            return { success: false, error: msg };
          }

          uploadBatchRes.successful.forEach(({ item, path }) => {
            uploadedMap.set(item.id, path);
          });
        }

        // 3. Construct API payload matching PUT /travel-memories/{id}
        // Notice: Temporary frontend IDs (> 1_000_000_000 from Date.now()) must be mapped to null.
        const payload: IUpdateTravelMemoryPayload = {
          locationId: Number(formData.locationId),
          title: formData.title.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description?.trim() || null,
          coverImagePath: coverImagePath || null,
          days: (formData.days || []).map((day) => {
            const photos: IUpdateTravelMemoryPhotoPayload[] = [];
            for (const photo of day.photos || []) {
              if (photo.file) {
                const uploadedPath = uploadedMap.get(photo.id);
                if (uploadedPath) {
                  photos.push({ id: null, imagePath: uploadedPath });
                }
              } else if (photo.imagePath) {
                photos.push({
                  id:
                    photo.id && photo.id > 0 && photo.id < 1_000_000_000
                      ? photo.id
                      : null,
                  imagePath: photo.imagePath,
                });
              }
            }

            return {
              id:
                day.id && day.id > 0 && day.id < 1_000_000_000
                  ? day.id
                  : null,
              date: day.date,
              description: day.description?.trim() || null,
              photos,
            };
          }),
        };

        await updateMutate({
          resource: AppResource.TravelMemory,
          id,
          values: payload,
        });

        return { success: true, error: null };
      } catch (err: unknown) {
        setIsUploading(false);
        const message =
          err instanceof Error
            ? err.message
            : "Lỗi kết nối khi cập nhật kỷ niệm chuyến đi.";
        setError(message);
        return { success: false, error: message };
      }
    },
    [updateMutate, uploadBatch, uploadFile],
  );

  return {
    updateTravelMemory,
    isLoading: mutation.isPending || isUploading,
    error: error || mutation.error?.message || null,
  };
}

