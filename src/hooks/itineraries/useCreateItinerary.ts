import { useState, useCallback } from "react";
import { useCreate } from "@refinedev/core";
import { AppResource } from "@/constants/resources";
import { useUploadFile } from "@/hooks/common/useUploadFile";
import {
  ITINERARY_ACTIVITY_CATEGORIES,
  parseDurationToMinutes,
} from "@/constants/itinerary";
import type {
  ICreateItineraryInput,
  ICreateItineraryPayload,
  ICreateItineraryDayPayload,
  ICreateItineraryActivityPayload,
} from "@/types/pages/itineraries/itinerary";

export interface UseCreateItineraryResult {
  createItinerary: (
    formData: ICreateItineraryInput,
  ) => Promise<{ success: boolean; error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to create a new itinerary using Refine's useCreate (POST /itineraries)
 * and useUploadFile for cover ("itineraries"), daily ("itineraries/days"),
 * and activity ("itineraries/activities") images.
 */
export function useCreateItinerary(): UseCreateItineraryResult {
  const { uploadFile, uploadBatch } = useUploadFile();
  const { mutateAsync: createMutate, mutation } = useCreate<{
    message: string;
  }>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createItinerary = useCallback(
    async (formData: ICreateItineraryInput) => {
      setError(null);
      try {
        if (!formData.title?.trim()) {
          const msg = "Vui lòng nhập tên lịch trình.";
          setError(msg);
          return { success: false, error: msg };
        }

        let coverImagePath: string | null = formData.coverImagePath ?? null;

        // 1. Upload Cover Image if a new file was selected (folder: "itineraries")
        if (formData.coverImageFile) {
          setIsUploading(true);
          const uploadRes = await uploadFile(
            formData.coverImageFile,
            "itineraries",
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

        // 2. Collect and upload any new day cover images (folder: "itineraries/days")
        const dayFilesToUpload: { item: number; file: File }[] = [];
        (formData.days || []).forEach((day, dIdx) => {
          if (day.imageFile) {
            dayFilesToUpload.push({ item: dIdx, file: day.imageFile });
          }
        });

        const uploadedDayImages = new Map<number, string>();
        if (dayFilesToUpload.length > 0) {
          setIsUploading(true);
          const dayBatchRes = await uploadBatch(
            dayFilesToUpload,
            "itineraries/days",
            3,
          );
          setIsUploading(false);

          if (dayBatchRes.failed.length > 0) {
            const msg = `Tải ảnh ngày lên máy chủ thất bại: ${dayBatchRes.failed[0].error}`;
            setError(msg);
            return { success: false, error: msg };
          }

          dayBatchRes.successful.forEach(({ item, path }) => {
            uploadedDayImages.set(item, path);
          });
        }

        // 3. Collect and upload any new activity images (folder: "itineraries/activities")
        const actFilesToUpload: { item: string; file: File }[] = [];
        (formData.days || []).forEach((day, dIdx) => {
          (day.activities || []).forEach((act, aIdx) => {
            if (act.imageFile) {
              actFilesToUpload.push({
                item: `${dIdx}_${aIdx}`,
                file: act.imageFile,
              });
            }
          });
        });

        const uploadedActImages = new Map<string, string>();
        if (actFilesToUpload.length > 0) {
          setIsUploading(true);
          const actBatchRes = await uploadBatch(
            actFilesToUpload,
            "itineraries/activities",
            3,
          );
          setIsUploading(false);

          if (actBatchRes.failed.length > 0) {
            const msg = `Tải ảnh hoạt động lên máy chủ thất bại: ${actBatchRes.failed[0].error}`;
            setError(msg);
            return { success: false, error: msg };
          }

          actBatchRes.successful.forEach(({ item, path }) => {
            uploadedActImages.set(item, path);
          });
        }

        // 4. Construct API payload matching POST /itineraries (CreateItineraryRequest)
        const daysPayload: ICreateItineraryDayPayload[] = (
          formData.days || []
        ).map((day, dIdx) => {
          const dayNumber = dIdx + 1;
          const dayImagePath = day.imageFile
            ? (uploadedDayImages.get(dIdx) ?? null)
            : (day.imagePath || null);

          const rawDayTips =
            day.dayTips ??
            (day.dayTipsText ? day.dayTipsText.split("\n") : []);
          const dayTips = rawDayTips.map((t) => t.trim()).filter(Boolean);

          const activitiesPayload: ICreateItineraryActivityPayload[] = (
            day.activities || []
          ).map((act, aIdx) => {
            const actKey = `${dIdx}_${aIdx}`;
            const actImagePath = act.imageFile
              ? (uploadedActImages.get(actKey) ?? null)
              : (act.imagePath || null);

            const rawCat = (
              act.activityCategory ||
              act.category ||
              act.type ||
              ""
            )
              .trim()
              .toLowerCase();
            const matchedCat = ITINERARY_ACTIVITY_CATEGORIES.find(
              (c) =>
                c.value.toLowerCase() === rawCat ||
                c.label.toLowerCase() === rawCat,
            );
            const activityCategory = matchedCat ? matchedCat.value : null;

            const rawMinutes =
              act.durationMinutes !== undefined && act.durationMinutes !== null
                ? Number(act.durationMinutes)
                : act.duration
                  ? Number(parseDurationToMinutes(act.duration))
                  : NaN;
            const durationMinutes =
              !isNaN(rawMinutes) && rawMinutes >= 1
                ? Math.round(rawMinutes)
                : null;

            const rawTime = (act.startTime || act.time || "08:00").trim();
            const startTime =
              rawTime.length >= 5 ? rawTime.slice(0, 5) : rawTime;

            return {
              startTime,
              title: act.title.trim(),
              activityCategory,
              durationMinutes,
              location: act.location?.trim() || null,
              googleMapsUrl:
                (act.googleMapsUrl || act.mapUrl || "").trim() || null,
              description: act.description?.trim() || null,
              notes: act.notes?.trim() || null,
              imagePath: actImagePath,
            };
          });

          return {
            dayNumber,
            title: day.title.trim() || `Ngày ${dayNumber}`,
            subtitle: day.subtitle?.trim() || null,
            summary: day.summary?.trim() || null,
            imagePath: dayImagePath,
            dayTips,
            activities: activitiesPayload,
          };
        });

        const payload: ICreateItineraryPayload = {
          itineraryName: formData.title.trim(),
          locationId:
            formData.locationId && Number(formData.locationId) > 0
              ? Number(formData.locationId)
              : null,
          suitableFor: formData.suitableFor?.trim() || null,
          description: formData.description?.trim() || null,
          coverImagePath: coverImagePath || null,
          travelTips: (formData.travelTips || [])
            .map((t) => t.trim())
            .filter(Boolean),
          themeIds: formData.themeIds || [],
          days: daysPayload,
        };

        await createMutate({
          resource: AppResource.Itinerary,
          values: payload,
        });

        return { success: true, error: null };
      } catch (err: unknown) {
        setIsUploading(false);
        const message =
          err instanceof Error
            ? err.message
            : "Lỗi kết nối khi tạo lịch trình mới.";
        setError(message);
        return { success: false, error: message };
      }
    },
    [createMutate, uploadBatch, uploadFile],
  );

  return {
    createItinerary,
    isLoading: mutation.isPending || isUploading,
    error: error || mutation.error?.message || null,
  };
}

export default useCreateItinerary;
