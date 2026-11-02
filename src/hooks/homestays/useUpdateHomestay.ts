import { useState, useCallback } from "react";
import { useUpdate } from "@refinedev/core";
import type {
  IHomestayFormData,
  IHomestayItem,
  IRoomFormImageItem,
  DbHomestay,
} from "@/types/pages/homestay/homestay";
import { mapDbHomestayToItem } from "@/utils/homestayUtils";
import { useUploadFile } from "@/hooks/common/useUploadFile";

export interface UseUpdateHomestayResult {
  updateHomestay: (
    id: number,
    formData: IHomestayFormData,
    originalData?: IHomestayItem,
    onProgress?: (completed: number, total: number) => void,
  ) => Promise<{ data: IHomestayItem | null; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to update an existing homestay using Refine's useUpdate and useUploadFile.
 */
export function useUpdateHomestay(): UseUpdateHomestayResult {
  const { uploadBatch } = useUploadFile();
  const { mutateAsync: updateMutate, mutation } = useUpdate<DbHomestay>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateHomestay = useCallback(
    async (
      id: number,
      formData: IHomestayFormData,
      _originalData?: IHomestayItem,
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
            "homestays",
            3,
            onProgress,
          );
          setIsUploading(false);

          if (uploadResult.failed.length > 0) {
            const msg = `Tải ảnh mới lên máy chủ thất bại: ${uploadResult.failed[0].error}`;
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
            const roomId =
              typeof room.id === "number" && room.id > 0 ? room.id : null;
            const imageItems = room.imageItems || [];
            const images = imageItems.map((img, imgIdx) => {
              const imageId =
                typeof img.imageId === "number" && img.imageId > 0
                  ? img.imageId
                  : null;
              return {
                ...(imageId ? { id: imageId } : {}),
                imagePath: uploadedMap.get(img.id) || img.imagePath || img.url || "",
                sortOrder: img.sortOrder ?? (imgIdx + 1),
                isCover: Boolean(img.isCover),
              };
            });

            return {
              ...(roomId ? { id: roomId } : {}),
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

        const response = await updateMutate({
          resource: "homestays",
          id,
          values: payload,
        });

        const updatedItem = response.data
          ? mapDbHomestayToItem(response.data)
          : null;

        return { data: updatedItem, error: null };
      } catch (err: unknown) {
        setIsUploading(false);
        const message =
          err instanceof Error ? err.message : "Lỗi khi cập nhật homestay.";
        setError(message);
        return { data: null, error: message };
      }
    },
    [uploadBatch, updateMutate],
  );

  return {
    updateHomestay,
    isLoading: isUploading || mutation.isPending,
    error: error || mutation.error?.message || null,
  };
}
