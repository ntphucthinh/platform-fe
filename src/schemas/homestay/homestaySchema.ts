import { type ObjectSchema, object, string, array, boolean, mixed } from "yup";
import type { IHomestayFormData, IHomestayFormImageItem } from "@/types/pages/homestay/homestay";

const imageItemSchema: ObjectSchema<IHomestayFormImageItem> = object().shape({
  id: string().required(),
  url: string().required(),
  file: mixed<File>().optional(),
  isObjectUrl: boolean().optional(),
  imagePath: string().optional(),
});

export const homestaySchema: ObjectSchema<IHomestayFormData> = object().shape({
  name: string()
    .trim()
    .required("Tên homestay là bắt buộc")
    .min(3, "Tên homestay phải có ít nhất 3 ký tự"),
  address: string().trim().required("Địa điểm / Địa chỉ là bắt buộc"),
  location: string().trim().optional(),
  description: string().trim().nullable().optional(),
  images: array()
    .of(string().required())
    .optional()
    .default([]),
  imageItems: array().of(imageItemSchema).optional(),
  price: string().trim().nullable().optional(),
  // Allow empty string or null; only validate URL format if a non-empty value is entered
  googleMapsUrl: string()
    .trim()
    .nullable()
    .optional()
    .test(
      "valid-url-if-provided",
      "Link Google Map không hợp lệ (phải bắt đầu bằng https://)",
      (value) => {
        if (!value || value.trim() === "") return true;
        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }
    ),
  googleMapLink: string()
    .trim()
    .nullable()
    .optional()
    .test(
      "valid-url-if-provided-link",
      "Link Google Map không hợp lệ",
      (value) => {
        if (!value || value.trim() === "") return true;
        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }
    ),
});
