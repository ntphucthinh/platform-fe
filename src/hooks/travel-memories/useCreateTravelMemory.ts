import { useState, useCallback } from "react";
import { useCreate } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import { useUploadFile } from "@/hooks/common/useUploadFile";
import type {
  ICreateTravelMemoryPayload,
  ICreateTravelMemoryPhotoPayload,
  ITravelMemoryFormSubmitData,
  ITravelMemoryPhoto,
} from "@/types/pages/travel-memories/travelMemory";

export interface UseCreateTravelMemoryResult {
  createTravelMemory: (
    formData: ITravelMemoryFormSubmitData,
    onProgress?: (completed: number, total: number) => void,
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to create a new travel memory using Refine's useCreate and useUploadFile.
 * Handles single cover upload and batch daily photos upload to folder "travel_memories".
 */
export function useCreateTravelMemory(): UseCreateTravelMemoryResult {
  const { uploadFile, uploadBatch } = useUploadFile();
  const { mutateAsync: createMutate, mutation } = useCreate<{ message: string }>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTravelMemory = useCallback(
    async (
      formData: ITravelMemoryFormSubmitData,
      onProgress?: (completed: number, total: number) => void,
    ) => {
      setError(null);
      try {
        if (!formData.locationId || Number(formData.locationId) <= 0) {
          const msg = "Vui lòng chọn địa điểm du lịch hợp lệ.";
          setError(msg);
          return { success: false, error: msg };
        }

        let coverImagePath: string | null = formData.coverImagePath ?? null;

        // 1. Upload Cover Image if a new file was chosen
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

        // 2. Collect and batch upload any new daily photos
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

        // 3. Construct API payload matching POST /travel-memories
        const payload: ICreateTravelMemoryPayload = {
          locationId: Number(formData.locationId),
          title: formData.title.trim(),
          startDate: formData.startDate,
          endDate: formData.endDate,
          description: formData.description?.trim() || null,
          coverImagePath: coverImagePath || null,
          days: (formData.days || []).map((day) => {
            const photos: ICreateTravelMemoryPhotoPayload[] = [];
            for (const photo of day.photos || []) {
              const finalPath = photo.file
                ? uploadedMap.get(photo.id)
                : photo.imagePath;
              if (finalPath) {
                photos.push({ imagePath: finalPath });
              }
            }

            return {
              date: day.date,
              description: day.description?.trim() || null,
              photos,
            };
          }),
        };

        await createMutate({
          resource: AppResource.TravelMemory,
          values: payload,
        });

        return { success: true, error: null };
      } catch (err: unknown) {
        setIsUploading(false);
        const message =
          err instanceof Error
            ? err.message
            : "Lỗi kết nối khi tạo mới kỷ niệm chuyến đi.";
        setError(message);
        return { success: false, error: message };
      }
    },
    [createMutate, uploadBatch, uploadFile],
  );

  return {
    createTravelMemory,
    isLoading: mutation.isPending || isUploading,
    error: error || mutation.error?.message || null,
  };
}

