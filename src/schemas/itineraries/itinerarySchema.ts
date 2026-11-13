import { type ObjectSchema, object, string, number } from "yup";
import type { IItineraryFormData } from "@/types/pages/itineraries/itinerary";

export const itinerarySchema: ObjectSchema<IItineraryFormData> = object().shape(
  {
    title: string().trim().required("Vui lòng nhập tên lịch trình"),
    destination: string().trim().required("Vui lòng chọn địa điểm"),
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

