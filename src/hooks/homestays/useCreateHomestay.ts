import { useState, useCallback } from "react";
import { useCreate } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import type {
  IHomestayFormData,
  IHomestayItem,
  IRoomFormImageItem,
  DbHomestay,
} from "@/types/pages/homestay/homestay";
import { mapDbHomestayToItem } from "@/utils/homestayUtils";
import { useUploadFile } from "@/hooks/common/useUploadFile";

export interface UseCreateHomestayResult {
  createHomestay: (
    formData: IHomestayFormData,
    onProgress?: (completed: number, total: number) => void,
  ) => Promise<{ data: IHomestayItem | null; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to create a new homestay using Refine's useCreate and useUploadFile.
 */
export function useCreateHomestay(): UseCreateHomestayResult {
  const { uploadBatch } = useUploadFile();
  const { mutateAsync: createMutate, mutation } = useCreate<DbHomestay>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHomestay = useCallback(
    async (
      formData: IHomestayFormData,
      onProgress?: (completed: number, total: number) => void,
    ) => {
      setError(null);
      try {
        const rooms = formData.rooms || [];
        if (rooms.length === 0) {
          setError("Homestay phải có ít nhất một loại phòng.");
          return { data: null, error: "Homestay phải có ít nhất một loại phòng." };
        }

        for (const room of rooms) {
          const count = room.imageItems?.length || 0;
          if (count > 50) {
            const msg = `Loại phòng "${room.name}" vượt quá giới hạn 50 hình ảnh. Vui lòng giảm bớt ảnh trước khi tiếp tục.`;
            setError(msg);
            return { data: null, error: msg };
          }
        }

        const allFilesToUpload: { item: IRoomFormImageItem; file: File }[] = [];
        rooms.forEach((room) => {
          (room.imageItems || []).forEach((item) => {
            if (item.file) {
              allFilesToUpload.push({ item, file: item.file });
            }
          });
        });

        const uploadedMap = new Map<string, string>();
        if (allFilesToUpload.length > 0) {
          setIsUploading(true);
          const uploadResult = await uploadBatch(
            allFilesToUpload,
            AppResource.Homestay,
            3,
            onProgress,
          );
          setIsUploading(false);

          if (uploadResult.failed.length > 0) {
            const msg = `Tải ảnh lên máy chủ thất bại: ${uploadResult.failed[0].error}`;
            setError(msg);
            return { data: null, error: msg };
          }

          uploadResult.successful.forEach(({ item, path }) => {
            uploadedMap.set(item.id, path);
          });
        }

        const payload = {
          name: formData.name.trim(),
          address: (formData.address || formData.location || "").trim(),
          description: formData.description?.trim() || null,
          googleMapsUrl:
            formData.googleMapsUrl?.trim() || formData.googleMapLink?.trim() || null,
          rooms: rooms.map((room, roomIdx) => {
            const imageItems = room.imageItems || [];
            const images = imageItems.map((img, imgIdx) => ({
              imagePath: uploadedMap.get(img.id) || img.imagePath || img.url || "",
              sortOrder: img.sortOrder ?? (imgIdx + 1),
              isCover: Boolean(img.isCover),
            }));

            return {
              name: room.name.trim() || `Phòng ${roomIdx + 1}`,
              description: room.description?.trim() || null,
              priceAmount:
                room.priceAmount !== undefined &&
                room.priceAmount !== null &&
                !isNaN(Number(room.priceAmount))
                  ? Number(room.priceAmount)
                  : null,
              priceUnit: room.priceUnit || null,
              sortOrder: room.sortOrder ?? (roomIdx + 1),
              images,
            };
          }),
        };

        const response = await createMutate({
          resource: AppResource.Homestay,
          values: payload,
        });

        const createdItem = response.data
          ? mapDbHomestayToItem(response.data)
          : null;

        return { data: createdItem, error: null };
      } catch (err: unknown) {
        setIsUploading(false);
        const message =
          err instanceof Error ? err.message : "Lỗi khi tạo homestay.";
        setError(message);
        return { data: null, error: message };
      }
    },
    [uploadBatch, createMutate],
  );

  return {
    createHomestay,
    isLoading: isUploading || mutation.isPending,
    error: error || mutation.error?.message || null,
  };
}
