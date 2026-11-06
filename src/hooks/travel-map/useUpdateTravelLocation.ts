import { useState, useCallback } from "react";
import { useUpdate } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import { useUploadFile } from "@/hooks/common/useUploadFile";
import { buildTravelLocationPayload } from "@/utils/travelMapUtils";
import type {
  ApiTravelLocation,
  ILocationFormData,
} from "@/types/pages/travel-map/travelMap";

export interface UseUpdateTravelLocationResult {
  updateLocation: (
    id: number,
    formData: ILocationFormData,
  ) => Promise<{ data: ApiTravelLocation | null; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for updating an existing travel location using Refine's useUpdate.
 * Automatically handles image uploading to /uploads and auto-fills countryName/name.
 */
export function useUpdateTravelLocation(): UseUpdateTravelLocationResult {
  const { uploadFile } = useUploadFile();
  const { mutateAsync: updateMutate, mutation } = useUpdate<ApiTravelLocation>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = useCallback(
    async (id: number, formData: ILocationFormData) => {
      setError(null);
      try {
        let uploadedPath: string | undefined = undefined;

        // If a new image file was selected, upload it first to folder "travel_location"
        if (formData.imageFile) {
          setIsUploading(true);
          const uploadRes = await uploadFile(
            formData.imageFile,
            "travel_location",
          );
          setIsUploading(false);
          if (uploadRes.error) {
            setError(uploadRes.error);
            return { data: null, error: uploadRes.error };
          }
          if (uploadRes.path) {
            uploadedPath = uploadRes.path;
          }
        }

        const payload = buildTravelLocationPayload(formData, uploadedPath);

        const response = await updateMutate({
          resource: AppResource.TravelLocation,
          id,
          values: payload,
        });

        const updatedItem = response.data || null;
        return { data: updatedItem, error: null };
      } catch (err: unknown) {
        setIsUploading(false);
        const message =
          err instanceof Error
            ? err.message
            : "Lỗi kết nối khi cập nhật địa điểm.";
        setError(message);
        return { data: null, error: message };
      }
    },
    [updateMutate, uploadFile],
  );

  return {
    updateLocation,
    isLoading: mutation.isPending || isUploading,
    error: error || mutation.error?.message || null,
  };
}

