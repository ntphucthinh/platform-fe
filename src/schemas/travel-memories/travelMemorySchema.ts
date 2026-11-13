import { type ObjectSchema, object, string, number } from "yup";
import type { ITravelMemoryFormData } from "@/types/pages/travel-memories/travelMemory";
import { validateDateRange } from "@/utils/travelMemoryUtils";

export const travelMemorySchema: ObjectSchema<ITravelMemoryFormData> =
  object().shape({
    title: string().trim().required("Vui lòng nhập tên chuyến đi."),
    destination: string().trim().required("Vui lòng chọn địa điểm chuyến đi."),
    locationId: number()
      .nullable()
      .required("Vui lòng chọn địa điểm từ danh sách."),
    startDate: string().required("Vui lòng chọn ngày khởi hành."),
    endDate: string()
      .required("Vui lòng chọn ngày kết thúc.")
      .test("valid-date-range", function (value) {
        const { startDate } = this.parent as ITravelMemoryFormData;
        if (!startDate || !value) return true;
        const result = validateDateRange(startDate, value);
        if (!result.isValid) {
          return this.createError({
            message: result.error || "Khoảng thời gian không hợp lệ.",
          });
        }
        return true;
      }),
    description: string().optional(),
    coverImage: string().default(""),
  });
