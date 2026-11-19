import { type ObjectSchema, object, string, number, ValidationError } from "yup";
import type { IItineraryFormData } from "@/types/pages/itineraries/itinerary";

export const itinerarySchema: ObjectSchema<IItineraryFormData> = object().shape(
  {
    title: string().trim().required("Vui lòng nhập tên lịch trình"),
    destination: string().trim().nullable().optional(),
    locationId: number().nullable().optional(),
    durationDays: number()
      .min(1, "Số ngày tối thiểu là 1")
      .max(30, "Số ngày tối đa là 30")
      .required("Vui lòng nhập số ngày"),
    durationNights: number()
      .min(0, "Số đêm không hợp lệ")
      .max(30, "Số đêm tối đa là 30")
      .required("Vui lòng nhập số đêm"),
    suitableFor: string().optional(),
    description: string().optional(),
    coverImage: string().default(""),
  },
);

export const itineraryDaySchema = object().shape({
  title: string().trim().required("Vui lòng nhập tiêu đề ngày"),
  summary: string().optional(),
  notes: string().optional(),
});

export const itineraryActivitySchema = object().shape({
  title: string().trim().required("Vui lòng nhập tên hoạt động"),
  time: string().trim().required("Vui lòng chọn giờ bắt đầu"),
  type: string().trim().required("Vui lòng chọn danh mục hoạt động"),
  duration: string().optional(),
  location: string().optional(),
  mapUrl: string()
    .trim()
    .nullable()
    .optional()
    .test(
      "valid-map-url",
      "Đường dẫn Google Maps không hợp lệ",
      (value) => {
        if (!value || value.trim() === "") return true;
        try {
          const url = new URL(value.trim());
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
    ),
  description: string().optional(),
  image: string().optional(),
});

/**
 * Returns validation error message for itinerary day title from itineraryDaySchema.
 */
export function getItineraryDayTitleError(title: string): string | undefined {
  try {
    itineraryDaySchema.validateSyncAt("title", { title });
    return undefined;
  } catch (err) {
    if (err instanceof ValidationError) {
      return err.message;
    }
    return undefined;
  }
}

/**
 * Validates itinerary activity fields against itineraryActivitySchema.
 */
export function validateItineraryActivity(activity: {
  title?: string;
  time?: string;
  type?: string;
  mapUrl?: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  try {
    itineraryActivitySchema.validateSync(activity, { abortEarly: false });
  } catch (err) {
    if (err instanceof ValidationError) {
      err.inner.forEach((error) => {
        if (error.path && !errors[error.path]) {
          errors[error.path] = error.message;
        }
      });
    }
  }
  return errors;
}

export default itinerarySchema;
