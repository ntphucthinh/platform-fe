import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import type {
  UseFormRegister,
  Control,
  UseFormSetValue,
  UseFormSetError,
  UseFormClearErrors,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  ITravelMemory,
  ITravelMemoryDay,
  ITravelMemoryPhoto,
  IRemovedDatePhotoSummary,
  ITravelMemoryFormData,
  ITravelMemoryFormSubmitData,
} from "@/types/pages/travel-memories/travelMemory";
import { travelMemorySchema } from "@/schemas/travel-memories/travelMemorySchema";
import {
  calculateCalendarDuration,
  generateCalendarDateRange,
  validateDateRange,
  findRemovedDatesWithPhotos,
} from "@/utils/travelMemoryUtils";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import useTravelLocationSelection from "@/hooks/selections/useTravelLocationSelection";

export interface UseTravelMemoryFormOptions {
  initialData?: ITravelMemory | null;
  onSubmit: (formData: ITravelMemoryFormSubmitData) => void;
}

export interface ITravelMemoryFormReturn {
  // Form handlers
  register: UseFormRegister<ITravelMemoryFormData>;
  control: Control<ITravelMemoryFormData>;
  setValue: UseFormSetValue<ITravelMemoryFormData>;
  setError: UseFormSetError<ITravelMemoryFormData>;
  clearErrors: UseFormClearErrors<ITravelMemoryFormData>;
  handleFormSubmit: UseFormHandleSubmit<ITravelMemoryFormData>;
  errors: FieldErrors<ITravelMemoryFormData>;
  onFormValid: (values: ITravelMemoryFormData) => void;

  // Form fields
  locationId: number | null;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  selectedLocation: { label: string; value: string | number } | null;

  // Validation & Derived
  startDateError?: string;
  endDateError?: string;
  dateRangeValidation: { isValid: boolean; error?: string };
  activeDates: string[];
  duration: { days: number; nights: number; label: string };

  // Location selection data
  travelLocationsSelections: { label: string; value: string | number }[];
  isLoadingLocations: boolean;
  refetchLocations: () => void;

  // Cover image state & handlers
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  coverImageFile: File | null;
  coverImagePath: string | null;
  handleCoverFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveCover: () => void;

  // Days & Photos state & handlers
  photosByDate: Record<string, ITravelMemoryPhoto[]>;
  descriptionsByDate: Record<string, string>;
  setDescriptionsByDate: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  collapsedDays: Record<string, boolean>;
  setCollapsedDays: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  toggleDayCollapse: (date: string) => void;
  dayInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  handleDayFilesChange: (
    date: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  // Drag and drop
  dragOverDate: string | null;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, date: string) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, date: string) => void;

  // Batch selection & Delete
  selectedPhotoIdsByDate: Record<string, number[]>;
  handleTogglePhotoSelect: (date: string, photoId: number) => void;
  handleSelectAllPhotos: (date: string) => void;
  handleDeleteSelectedPhotos: (date: string) => void;
  handleRemovePhoto: (date: string, photoId: number) => void;

  // Undo buffer & snackbar
  undoBuffer: { date: string; photos: ITravelMemoryPhoto[] } | null;
  showUndoSnackbar: boolean;
  setShowUndoSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  handleUndoDelete: () => void;

  // Date change confirmation dialog
  pendingDateChange: { newStartDate: string; newEndDate: string } | null;
  removedDatesWarning: IRemovedDatePhotoSummary[];
  handleDateChangeAttempt: (newStart: string, newEnd: string) => void;
  handleConfirmDateChange: () => void;
  handleCancelDateChange: () => void;

  // Lightbox
  lightboxState: {
    open: boolean;
    photos: ITravelMemoryPhoto[];
    currentIndex: number;
    dateLabel?: string;
  };
  setLightboxState: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      photos: ITravelMemoryPhoto[];
      currentIndex: number;
      dateLabel?: string;
    }>
  >;
}

export function useTravelMemoryForm({
  initialData,
  onSubmit,
}: UseTravelMemoryFormOptions): ITravelMemoryFormReturn {
  // Hook selection location
  const {
    travelLocationsSelections,
    data: locationData,
    isLoading: isLoadingLocations,
    refetch: refetchLocations,
  } = useTravelLocationSelection();

  const handleRefetchLocations = useCallback(() => {
    void refetchLocations();
  }, [refetchLocations]);

  // Initial location ID resolver
  const initialLocationId = useMemo<number | null>(() => {
    if (initialData?.locationId) return Number(initialData.locationId);
    if (initialData?.location?.id) return Number(initialData.location.id);
    return null;
  }, [initialData]);

  // React Hook Form + Yup Resolver
  const {
    register,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<ITravelMemoryFormData>({
    resolver: yupResolver(travelMemorySchema),
    defaultValues: {
      title: initialData?.title || "",
      locationId: initialLocationId,
      destination: initialData?.destination || initialData?.locationName || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      description: initialData?.description || "",
      coverImage: initialData?.coverImage || "",
    },
  });

  const locationId = useWatch({ control, name: "locationId" }) ?? null;
  const destination = useWatch({ control, name: "destination" }) ?? "";
  const startDate = useWatch({ control, name: "startDate" }) ?? "";
  const endDate = useWatch({ control, name: "endDate" }) ?? "";
  const coverImage = useWatch({ control, name: "coverImage" }) ?? "";

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePath, setCoverImagePath] = useState<string | null>(
    initialData?.coverImagePath || null,
  );

  // Photo collections mapped strictly by ISO date string: 'YYYY-MM-DD'
  const [photosByDate, setPhotosByDate] = useState<
    Record<string, ITravelMemoryPhoto[]>
  >(() => {
    const map: Record<string, ITravelMemoryPhoto[]> = {};
    if (initialData?.days) {
      initialData.days.forEach((day) => {
        map[day.date] = [...day.photos];
      });
    }
    return map;
  });

  // Descriptions per day: key = ISO date, value = text
  const [descriptionsByDate, setDescriptionsByDate] = useState<
    Record<string, string>
  >(() => {
    const map: Record<string, string> = {};
    if (initialData?.days) {
      initialData.days.forEach((day) => {
        if (day.description) {
          map[day.date] = day.description;
        }
      });
    }
    return map;
  });

  // Batch selection per date: key = ISO date, value = array of selected photo IDs
  const [selectedPhotoIdsByDate, setSelectedPhotoIdsByDate] = useState<
    Record<string, number[]>
  >({});

  // Soft-delete undo buffer
  const [undoBuffer, setUndoBuffer] = useState<{
    date: string;
    photos: ITravelMemoryPhoto[];
  } | null>(null);
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);

  // Track created blob object URLs to safely revoke them on unmount / replacement
  const createdObjectUrlsRef = useRef<Set<string>>(new Set());

  const registerObjectUrl = useCallback((url: string) => {
    createdObjectUrlsRef.current.add(url);
    return url;
  }, []);

  const revokeObjectUrl = useCallback((url: string) => {
    if (url && url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
        createdObjectUrlsRef.current.delete(url);
      } catch {
        // Ignore revoke errors
      }
    }
  }, []);

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    const urls = createdObjectUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore
        }
      });
      urls.clear();
    };
  }, []);

  // Date range confirmation state
  const [pendingDateChange, setPendingDateChange] = useState<{
    newStartDate: string;
    newEndDate: string;
  } | null>(null);
  const [removedDatesWarning, setRemovedDatesWarning] = useState<
    IRemovedDatePhotoSummary[]
  >([]);

  // Lightbox state for viewing thumbnails inside form
  const [lightboxState, setLightboxState] = useState<{
    open: boolean;
    photos: ITravelMemoryPhoto[];
    currentIndex: number;
    dateLabel?: string;
  }>({
    open: false,
    photos: [],
    currentIndex: 0,
  });

  // Collapse state per day: key = ISO date, value = collapsed boolean
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>(
    {},
  );

  const toggleDayCollapse = useCallback((date: string) => {
    setCollapsedDays((prev) => ({ ...prev, [date]: !prev[date] }));
  }, []);

  // Derived calendar dates in range
  const dateRangeValidation = useMemo(
    () => validateDateRange(startDate, endDate),
    [startDate, endDate],
  );

  const activeDates = useMemo(() => {
    if (!dateRangeValidation.isValid) return [];
    return generateCalendarDateRange(startDate, endDate);
  }, [startDate, endDate, dateRangeValidation]);

  const duration = useMemo(
    () => calculateCalendarDuration(startDate, endDate),
    [startDate, endDate],
  );

  // Resolve specific validation messages for each date field
  const startDateError = errors.startDate?.message;
  const endDateError = errors.endDate?.message;

  // Selected location object for Autocomplete
  const selectedLocation = useMemo(() => {
    if (locationId !== null && locationId !== undefined) {
      const foundInOptions = travelLocationsSelections.find(
        (loc) => Number(loc.value) === Number(locationId),
      );
      if (foundInOptions) return foundInOptions;

      const foundInRaw = locationData.find(
        (l) => Number(l.id) === Number(locationId),
      );
      if (foundInRaw) {
        return { label: foundInRaw.name, value: foundInRaw.id };
      }

      if (destination) {
        return { label: destination, value: locationId };
      }
      return null;
    }

    if (destination) {
      const foundByName = travelLocationsSelections.find(
        (loc) => loc.label.toLowerCase() === destination.trim().toLowerCase(),
      );
      if (foundByName) return foundByName;
    }

    return null;
  }, [travelLocationsSelections, locationData, locationId, destination]);

  // Hidden file inputs refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dayInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Handle Cover Image selection
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("coverImage", {
        type: "manual",
        message: "Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP).",
      });
      return;
    }

    if (coverImage && coverImage.startsWith("blob:")) {
      revokeObjectUrl(coverImage);
    }

    const previewUrl = registerObjectUrl(URL.createObjectURL(file));
    setValue("coverImage", previewUrl, { shouldDirty: true });
    setCoverImageFile(file);
    setCoverImagePath(null);
    clearErrors("coverImage");

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleRemoveCover = () => {
    if (coverImage && coverImage.startsWith("blob:")) {
      revokeObjectUrl(coverImage);
    }
    setValue("coverImage", "", { shouldDirty: true });
    setCoverImageFile(null);
    setCoverImagePath(null);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  // Handle Date Changes with Confirmation Guard
  const handleDateChangeAttempt = (newStart: string, newEnd: string) => {
    const validation = validateDateRange(newStart, newEnd);

    if (!validation.isValid) {
      setValue("startDate", newStart, { shouldDirty: true });
      setValue("endDate", newEnd, { shouldDirty: true });
      if (newStart) clearErrors("startDate");
      if (newEnd) clearErrors("endDate");
      if (newStart && newEnd && validation.error) {
        setError("endDate", { type: "manual", message: validation.error });
      }
      return;
    }

    clearErrors(["startDate", "endDate"]);

    const newDates = generateCalendarDateRange(newStart, newEnd);
    const affectedDates = findRemovedDatesWithPhotos(photosByDate, newDates);

    if (affectedDates.length > 0) {
      setPendingDateChange({ newStartDate: newStart, newEndDate: newEnd });
      setRemovedDatesWarning(affectedDates);
    } else {
      setValue("startDate", newStart, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("endDate", newEnd, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleConfirmDateChange = () => {
    if (!pendingDateChange) return;

    const { newStartDate, newEndDate } = pendingDateChange;
    const newDates = generateCalendarDateRange(newStartDate, newEndDate);
    const newDateSet = new Set(newDates);

    setPhotosByDate((prev) => {
      const updated: Record<string, ITravelMemoryPhoto[]> = {};
      Object.entries(prev).forEach(([date, photos]) => {
        if (newDateSet.has(date)) {
          updated[date] = photos;
        } else {
          photos.forEach((p) => {
            if (p.imageUrl && p.imageUrl.startsWith("blob:")) {
              revokeObjectUrl(p.imageUrl);
            }
          });
        }
      });
      return updated;
    });

    setDescriptionsByDate((prev) => {
      const updated: Record<string, string> = {};
      Object.entries(prev).forEach(([date, text]) => {
        if (newDateSet.has(date)) {
          updated[date] = text;
        }
      });
      return updated;
    });

    setValue("startDate", newStartDate, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("endDate", newEndDate, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setPendingDateChange(null);
    setRemovedDatesWarning([]);
  };

  const handleCancelDateChange = () => {
    setPendingDateChange(null);
    setRemovedDatesWarning([]);
  };

  // Shared helper: process image files and append to a given date's photo list
  const processImageFiles = useCallback(
    (date: string, files: File[]) => {
      const newPhotos: ITravelMemoryPhoto[] = [];
      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const previewUrl = registerObjectUrl(URL.createObjectURL(file));
          newPhotos.push({
            id: Date.now() + Math.floor(Math.random() * 10000),
            imageUrl: previewUrl,
            fileName: file.name,
            fileSize: file.size,
            file,
            caption: "",
          });
        }
      });
      if (newPhotos.length > 0) {
        setPhotosByDate((prev) => ({
          ...prev,
          [date]: [...(prev[date] || []), ...newPhotos],
        }));
        setCollapsedDays((prev) => ({ ...prev, [date]: false }));
      }
    },
    [registerObjectUrl],
  );

  // Handle Daily Photos selection
  const handleDayFilesChange = (
    date: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processImageFiles(date, Array.from(files));
    const inputElement = dayInputRefs.current[date];
    if (inputElement) inputElement.value = "";
  };

  // Drag-and-drop handlers (per-day drop zones)
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, date: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverDate(date);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget && !e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverDate(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverDate(null);
    processImageFiles(date, Array.from(e.dataTransfer.files));
  };

  // Batch selection handlers
  const handleTogglePhotoSelect = (date: string, photoId: number) => {
    setSelectedPhotoIdsByDate((prev) => {
      const current = prev[date] || [];
      const exists = current.includes(photoId);
      return {
        ...prev,
        [date]: exists
          ? current.filter((id) => id !== photoId)
          : [...current, photoId],
      };
    });
  };

  const handleSelectAllPhotos = (date: string) => {
    const currentPhotos = photosByDate[date] || [];
    const currentSelected = selectedPhotoIdsByDate[date] || [];
    setSelectedPhotoIdsByDate((prev) => ({
      ...prev,
      [date]:
        currentSelected.length === currentPhotos.length
          ? []
          : currentPhotos.map((p) => p.id),
    }));
  };

  const handleDeleteSelectedPhotos = (date: string) => {
    const selected = selectedPhotoIdsByDate[date] || [];
    if (selected.length === 0) return;
    const currentPhotos = photosByDate[date] || [];
    const removed = currentPhotos.filter((p) => selected.includes(p.id));

    setUndoBuffer({ date, photos: removed });
    setShowUndoSnackbar(true);

    setPhotosByDate((prev) => ({
      ...prev,
      [date]: currentPhotos.filter((p) => !selected.includes(p.id)),
    }));
    setSelectedPhotoIdsByDate((prev) => ({
      ...prev,
      [date]: [],
    }));
  };

  const handleRemovePhoto = (date: string, photoId: number) => {
    const currentList = photosByDate[date] || [];
    const photoToRemove = currentList.find((p) => p.id === photoId);
    if (photoToRemove) {
      setUndoBuffer({ date, photos: [photoToRemove] });
      setShowUndoSnackbar(true);
    }
    setPhotosByDate((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((p) => p.id !== photoId),
    }));
    setSelectedPhotoIdsByDate((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((id) => id !== photoId),
    }));
  };

  const handleUndoDelete = () => {
    if (!undoBuffer) return;
    setPhotosByDate((prev) => ({
      ...prev,
      [undoBuffer.date]: [
        ...(prev[undoBuffer.date] || []),
        ...undoBuffer.photos,
      ],
    }));
    setUndoBuffer(null);
    setShowUndoSnackbar(false);
  };

  // Form Submit
  const onFormValid = useCallback(
    (values: ITravelMemoryFormData) => {
      const resolvedLocationId =
        values.locationId ??
        (selectedLocation ? Number(selectedLocation.value) : null);

      const days: ITravelMemoryDay[] = activeDates.map((date) => {
        const existingDay = initialData?.days?.find((d) => d.date === date);
        return {
          id: existingDay?.id,
          date,
          description: descriptionsByDate[date]?.trim() || undefined,
          photos: photosByDate[date] || [],
        };
      });

      onSubmit({
        title: values.title.trim(),
        destination: values.destination.trim(),
        locationId: resolvedLocationId,
        startDate: values.startDate,
        endDate: values.endDate,
        description: (values.description || "").trim(),
        coverImage: values.coverImage || DEFAULT_NO_IMAGE,
        coverImagePath,
        coverImageFile,
        days,
      });
    },
    [
      selectedLocation,
      activeDates,
      initialData?.days,
      descriptionsByDate,
      photosByDate,
      onSubmit,
      coverImagePath,
      coverImageFile,
    ],
  );

  return {
    // Form handlers
    register,
    control,
    setValue,
    setError,
    clearErrors,
    handleFormSubmit,
    errors,
    onFormValid,

    // Form fields
    locationId,
    destination,
    startDate,
    endDate,
    coverImage,
    selectedLocation,

    // Validation & Derived
    startDateError,
    endDateError,
    dateRangeValidation,
    activeDates,
    duration,

    // Location selection data
    travelLocationsSelections,
    isLoadingLocations,
    refetchLocations: handleRefetchLocations,

    // Cover image state & handlers
    coverInputRef,
    coverImageFile,
    coverImagePath,
    handleCoverFileChange,
    handleRemoveCover,

    // Days & Photos state & handlers
    photosByDate,
    descriptionsByDate,
    setDescriptionsByDate,
    collapsedDays,
    setCollapsedDays,
    toggleDayCollapse,
    dayInputRefs,
    handleDayFilesChange,

    // Drag and drop
    dragOverDate,
    handleDragOver,
    handleDragLeave,
    handleDrop,

    // Batch selection & Delete
    selectedPhotoIdsByDate,
    handleTogglePhotoSelect,
    handleSelectAllPhotos,
    handleDeleteSelectedPhotos,
    handleRemovePhoto,

    // Undo buffer & snackbar
    undoBuffer,
    showUndoSnackbar,
    setShowUndoSnackbar,
    handleUndoDelete,

    // Date change confirmation dialog
    pendingDateChange,
    removedDatesWarning,
    handleDateChangeAttempt,
    handleConfirmDateChange,
    handleCancelDateChange,

    // Lightbox
    lightboxState,
    setLightboxState,
  };
}
