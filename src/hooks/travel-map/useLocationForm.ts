import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import type {
  ILocation,
  ILocationFormData,
} from "@/types/pages/travel-map/travelMap";
import { validateLocationFormData } from "@/schemas/travel-map/travelLocationSchema";
import {
  extractRelativeImagePath,
  getGoogleMapsUrl,
  loadCountryBoundaries,
} from "@/utils/travelMapUtils";
import {
  useCountries,
  useGlobalGeo,
  type IGlobalCountry,
} from "@/hooks/common/useGlobalGeo";

export type LocationFormSubmitResult =
  | { success: boolean; error?: string | null }
  | boolean
  | void;

export interface UseLocationFormOptions {
  initialData?: ILocation | null;
  onSubmit: (
    formData: ILocationFormData,
  ) => Promise<LocationFormSubmitResult> | LocationFormSubmitResult;
  onClose: () => void;
}

export function getInitialLocationFormData(
  initialData?: ILocation | null,
  initialCountry?: IGlobalCountry | null,
): ILocationFormData {
  if (initialData) {
    const locName = initialData.locationName || initialData.name || "";
    return {
      countryCode: initialData.countryCode || initialCountry?.iso2,
      countryName: initialData.countryName || initialCountry?.name,
      locationName: locName,
      latitude:
        initialData.latitude !== undefined && initialData.latitude !== null
          ? initialData.latitude
          : "",
      longitude:
        initialData.longitude !== undefined && initialData.longitude !== null
          ? initialData.longitude
          : "",
      coverImage: initialData.coverImage || "",
      imageFile: null,
      imagePath:
        initialData.imagePath ||
        extractRelativeImagePath(initialData.coverImage),
      status: initialData.status ?? null,
      description: initialData.description || "",
      notes: initialData.notes || "",
      googleMapsUrl: initialData.googleMapsUrl || "",
    };
  }

  return {
    countryCode: undefined,
    countryName: undefined,
    locationName: "",
    latitude: "",
    longitude: "",
    coverImage: "",
    imageFile: null,
    imagePath: undefined,
    status: null,
    description: "",
    notes: "",
    googleMapsUrl: "",
  };
}

export interface IUseLocationFormReturn {
  isEdit: boolean;
  selectedCountry: IGlobalCountry | null;
  allCountries: IGlobalCountry[];
  formData: ILocationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ILocationFormData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  locationWarning: string | null;
  setLocationWarning: (warning: string | null) => void;
  isSubmitting: boolean;
  initialCoordinates: { lat: number; lng: number } | null;

  // File upload state & handlers
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  imageError: string | null;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleRemoveImage: () => void;

  // Handlers
  handleCountryChange: (newCountry: IGlobalCountry | null) => void;
  handleLocationSelect: (lat: number, lng: number) => void;
  handleSave: () => Promise<void>;
}

export function useLocationForm({
  initialData,
  onSubmit,
  onClose,
}: UseLocationFormOptions): IUseLocationFormReturn {
  const isEdit = Boolean(initialData);
  const { findCountry, findLegacyDestination } = useGlobalGeo();

  // Xác định Quốc gia ban đầu khi mở form
  const initialResolved = useMemo<{
    country: IGlobalCountry | null;
  }>(() => {
    if (!initialData) return { country: null };

    if (initialData.countryCode) {
      const c = findCountry(initialData.countryCode) || null;
      if (c) return { country: c };
    }

    const legacy = findLegacyDestination(
      initialData.locationName || initialData.name || initialData.address,
    );
    if (legacy) {
      return { country: legacy.country };
    }

    return { country: null };
  }, [initialData, findCountry, findLegacyDestination]);

  // Tọa độ gốc ban đầu khi chỉnh sửa địa điểm
  const initialCoordinates = useMemo<{
    lat: number;
    lng: number;
  } | null>(() => {
    if (
      initialData &&
      initialData.latitude !== null &&
      initialData.latitude !== undefined &&
      !isNaN(Number(initialData.latitude)) &&
      initialData.longitude !== null &&
      initialData.longitude !== undefined &&
      !isNaN(Number(initialData.longitude))
    ) {
      return {
        lat: Number(initialData.latitude),
        lng: Number(initialData.longitude),
      };
    }
    return null;
  }, [initialData]);

  const [selectedCountry, setSelectedCountry] = useState<IGlobalCountry | null>(
    initialResolved.country,
  );

  const allCountries = useCountries();

  const [formData, setFormData] = useState<ILocationFormData>(() =>
    getInitialLocationFormData(initialData, initialResolved.country),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationWarning, setLocationWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tải trước dữ liệu GeoJSON ranh giới các quốc gia
  useEffect(() => {
    loadCountryBoundaries();
  }, []);

  // File upload & Drag-and-drop cho ảnh đại diện
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const processImageFile = (file: File) => {
    setImageError(null);
    if (!file.type.startsWith("image/")) {
      setImageError("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError("Kích thước tệp quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({
          ...prev,
          coverImage: reader.result as string,
          imageFile: file,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
      imageFile: null,
      imagePath: "",
    }));
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Xử lý khi thay đổi Quốc gia
  const handleCountryChange = (newCountry: IGlobalCountry | null) => {
    setSelectedCountry(newCountry);
    setLocationWarning(null);

    setFormData((prev) => ({
      ...prev,
      countryCode: newCountry?.iso2,
      countryName: newCountry?.name,
      latitude: "",
      longitude: "",
      googleMapsUrl: "",
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.country;
      delete next.coordinates;
      return next;
    });
  };

  // Xử lý khi người dùng click hoặc kéo ghim trên bản đồ để chọn tọa độ
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    const autoMapUrl = getGoogleMapsUrl(lat, lng) || "";
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      googleMapsUrl:
        !prev.googleMapsUrl ||
        prev.googleMapsUrl.startsWith("https://www.google.com/maps?q=")
          ? autoMapUrl
          : prev.googleMapsUrl,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.coordinates;
      return next;
    });
  }, []);

  const validate = (): boolean => {
    const { isValid, errors: validationErrors } = validateLocationFormData(
      formData,
      selectedCountry,
    );
    setErrors(validationErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (typeof result === "object" && result !== null) {
        if (!result.success) {
          return;
        }
        onClose();
      } else if (result === false) {
        return;
      } else {
        onClose();
      }
    } catch {
      // Toast notification tại trang cha sẽ hiển thị thông báo lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEdit,
    selectedCountry,
    allCountries,
    formData,
    setFormData,
    errors,
    setErrors,
    locationWarning,
    setLocationWarning,
    isSubmitting,
    initialCoordinates,

    // File upload state & handlers
    fileInputRef,
    isDragging,
    imageError,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveImage,

    // Handlers
    handleCountryChange,
    handleLocationSelect,
    handleSave,
  };
}
