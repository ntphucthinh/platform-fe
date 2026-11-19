import { type ObjectSchema, object, string, mixed, ValidationError } from "yup";
import { LocationStatus } from "@/constants/travelMap";
import type { ILocationFormData } from "@/types/pages/travel-map/travelMap";

/**
 * Yup schema for validating Travel Location form data.
 */
export const travelLocationSchema: ObjectSchema<ILocationFormData> =
  object().shape({
    countryCode: string()
      .trim()
      .required("Vui lòng chọn quốc gia"),
    countryName: string().optional(),
    locationName: string()
      .trim()
      .required("Vui lòng nhập tên điểm đến"),
    status: mixed<LocationStatus>()
      .oneOf(
        [LocationStatus.Visited, LocationStatus.Wishlist],
        "Vui lòng chọn trạng thái",
      )
      .nullable()
      .required("Vui lòng chọn trạng thái"),
    googleMapsUrl: string()
      .trim()
      .optional()
      .test(
        "is-valid-url-if-provided",
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
    latitude: mixed<number | "">()
      .nullable()
      .defined()
      .test("valid-latitude", function (value) {
        const { longitude } = this.parent as ILocationFormData;
        const hasLat =
          value !== "" && value !== null && value !== undefined;
        const hasLng =
          longitude !== "" && longitude !== null && longitude !== undefined;

        if (hasLat !== hasLng) {
          return this.createError({
            path: "coordinates",
            message: "Vĩ độ và kinh độ phải cùng có giá trị hoặc cùng để trống",
          });
        }

        if (hasLat) {
          const latNum = Number(value);
          if (isNaN(latNum) || latNum < -90 || latNum > 90) {
            return this.createError({
              path: "coordinates",
              message: "Vĩ độ phải nằm trong khoảng từ -90 đến 90",
            });
          }
        }
        return true;
      }),
    longitude: mixed<number | "">()
      .nullable()
      .defined()
      .test("valid-longitude", function (value) {
        const { latitude } = this.parent as ILocationFormData;
        const hasLat =
          latitude !== "" && latitude !== null && latitude !== undefined;
        const hasLng =
          value !== "" && value !== null && value !== undefined;

        if (hasLat && hasLng) {
          const lngNum = Number(value);
          if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
            return this.createError({
              path: "coordinates",
              message: "Kinh độ phải nằm trong khoảng từ -180 đến 180",
            });
          }
        }
        return true;
      }),
    coverImage: string().default(""),
    imageFile: mixed<File>().optional().nullable(),
    imagePath: string().optional(),
    description: string().optional(),
    notes: string().optional(),
  });

/**
 * Validates travel location form data using travelLocationSchema.
 * Returns an object with isValid flag and mapped field errors.
 */
export function validateLocationFormData(
  formData: ILocationFormData,
  selectedCountry?: unknown | null,
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!selectedCountry) {
    errors.country = "Vui lòng chọn quốc gia";
  }

  try {
    travelLocationSchema.validateSync(formData, { abortEarly: false });
  } catch (err) {
    if (err instanceof ValidationError) {
      err.inner.forEach((error) => {
        if (error.path && !errors[error.path]) {
          errors[error.path] = error.message;
          if (error.path === "countryCode" && !errors.country) {
            errors.country = error.message;
          }
        }
      });
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default travelLocationSchema;
