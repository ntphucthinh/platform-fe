import { type ObjectSchema, object, string, number, array, boolean, mixed } from "yup";
import type {
  IHomestayFormData,
  IHomestayRoomFormData,
  IRoomFormImageItem,
} from "@/types/pages/homestay/homestay";

const roomImageItemSchema: ObjectSchema<IRoomFormImageItem> = object().shape({
  id: string().required(),
  imageId: number().optional(),
  url: string().required(),
  file: mixed<File>().optional(),
  isObjectUrl: boolean().optional(),
  imagePath: string().optional(),
  sortOrder: number().required(),
  isCover: boolean().required(),
});

const roomSchema: ObjectSchema<IHomestayRoomFormData> = object().shape({
  id: number().optional(),
  name: string().trim().required("Tên loại phòng là bắt buộc"),
  description: string().trim().nullable().optional(),
  priceText: string().trim().nullable().optional(),
  sortOrder: number().required(),
  images: array()
    .of(string().required())
    .max(50, "Mỗi loại phòng chỉ được phép có tối đa 50 hình ảnh.")
    .optional()
    .default([]),
  imageItems: array()
    .of(roomImageItemSchema)
    .max(50, "Mỗi loại phòng chỉ được phép có tối đa 50 hình ảnh.")
    .optional(),
});

export const homestaySchema: ObjectSchema<IHomestayFormData> = object().shape({
  name: string()
    .trim()
    .required("Tên homestay là bắt buộc")
    .min(3, "Tên homestay phải có ít nhất 3 ký tự"),
  address: string().trim().required("Địa điểm / Địa chỉ là bắt buộc"),
  location: string().trim().optional(),
  description: string().trim().nullable().optional(),
  price: string().trim().nullable().optional(),
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
  rooms: array()
    .of(roomSchema)
    .min(1, "Danh sách loại phòng phải có ít nhất 1 loại phòng.")
    .required("Vui lòng thêm ít nhất 1 loại phòng.")
    .default([]),
  images: array().of(string().required()).optional(),
  imageItems: array().of(roomImageItemSchema).optional(),
});
