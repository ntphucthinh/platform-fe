import { type ObjectSchema, object, string, array } from "yup";
import type { IHomestayFormData } from "@/types/pages/homestay/homestay";

/**
 * Validation schema for homestay create/edit form.
 * Required fields: name, location, images.
 * Optional fields: description, price, googleMapLink.
 */
export const homestaySchema: ObjectSchema<IHomestayFormData> = object().shape({
  name: string()
    .trim()
    .required("Tên homestay là bắt buộc")
    .min(3, "Tên homestay phải có ít nhất 3 ký tự"),
  location: string().trim().required("Địa điểm / Địa chỉ là bắt buộc"),
  description: string().trim().optional(),
  images: array()
    .of(string().required())
    .required("Vui lòng chọn ít nhất 1 hình ảnh")
    .min(1, "Vui lòng chọn ít nhất 1 hình ảnh"),
  price: string().trim().optional(),
  googleMapLink: string().trim().url("Link Google Map không hợp lệ").nullable().optional(),
});
