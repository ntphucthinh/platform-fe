import { useState, useCallback } from "react";
import { useCreate } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import { useUploadFile } from "@/hooks/common/useUploadFile";
import { buildTravelLocationPayload } from "@/utils/travelMapUtils";
import type {
  ILocation,
  ILocationFormData,
} from "@/types/pages/travel-map/travelMap";

export interface UseCreateTravelLocationResult {
  createLocation: (
    formData: ILocationFormData,
  ) => Promise<{ data: ILocation | null; error: string | null; rawError?: unknown }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for creating a travel location using Refine's useCreate.
 * Automatically handles image uploading to /uploads and auto-fills countryName/name.
 */
export function useCreateTravelLocation(): UseCreateTravelLocationResult {
  const { uploadFile } = useUploadFile();
  const { mutateAsync: createMutate, mutation } = useCreate<ILocation>({
    successNotification: false,
    errorNotification: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLocation = useCallback(
    async (formData: ILocationFormData) => {
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

        const response = await createMutate({
          resource: AppResource.TravelLocation,
          values: payload,
          successNotification: false,
          errorNotification: false,
        });

        const createdItem = response.data || null;
        return { data: createdItem, error: null };
      } catch (err: unknown) {
        setIsUploading(false);
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
          "Lỗi kết nối khi tạo mới địa điểm.";
        setError(message);
        return { data: null, error: message, rawError: err };
      }
    },
    [createMutate, uploadFile],
  );

  return {
    createLocation,
    isLoading: mutation.isPending || isUploading,
    error: error || mutation.error?.message || null,
  };
}

