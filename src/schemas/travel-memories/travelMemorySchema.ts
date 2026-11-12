import { type ObjectSchema, object, string, number } from "yup";
import type { ITravelMemoryFormData } from "@/types/pages/travel-memories/travelMemory";

export const travelMemorySchema: ObjectSchema<ITravelMemoryFormData> = object().shape({
  title: string().trim().required("Vui lòng nhập tên chuyến đi."),
  destination: string().trim().required("Vui lòng nhập địa điểm chuyến đi."),
  locationId: number().nullable().optional(),
  startDate: string().required("Vui lòng chọn ngày khởi hành."),
  endDate: string().required("Vui lòng chọn ngày kết thúc."),
  description: string().optional(),
  coverImage: string().default(""),
});
