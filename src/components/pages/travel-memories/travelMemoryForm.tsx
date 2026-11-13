import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Collapse,
  IconButton,
  Autocomplete,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
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
  formatDateVietnamese,
  generateCalendarDateRange,
  validateDateRange,
  findRemovedDatesWithPhotos,
} from "@/utils/travelMemoryUtils";
import { TravelMemoryPhotoGrid } from "@/components/pages/travel-memories/travelMemoryPhotoGrid";
import { TravelMemoryPhotoLightbox } from "@/components/pages/travel-memories/travelMemoryPhotoLightbox";
import { TravelMemoryDateConfirmDialog } from "@/components/pages/travel-memories/travelMemoryDateConfirmDialog";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import useTravelLocationSelection from "@/hooks/selections/useTravelLocationSelection";

export interface TravelMemoryFormProps {
  initialData?: ITravelMemory | null;
  isEdit?: boolean;
  isLoading?: boolean;
  onSubmit: (formData: ITravelMemoryFormSubmitData) => void;
  onCancel: () => void;
}

export const TravelMemoryForm: React.FC<TravelMemoryFormProps> = ({
  initialData,
  isEdit = false,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  // Hook selection location
  const {
    travelLocationsSelections,
    data: locationData,
    isLoading: isLoadingLocations,
  } = useTravelLocationSelection();

  // React Hook Form + Yup Resolver
  const initialLocationId = useMemo<number | null>(() => {
    if (initialData?.locationId) return Number(initialData.locationId);
    if (initialData?.location?.id) return Number(initialData.location.id);
    return null;
  }, [initialData]);

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
      destination:
        initialData?.destination || initialData?.locationName || "",
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

  // Cleanup all blob URLs on component unmount
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

    // Reset input value so selecting the same file again triggers change
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
      // Require user confirmation before removing dates with photos
      setPendingDateChange({ newStartDate: newStart, newEndDate: newEnd });
      setRemovedDatesWarning(affectedDates);
    } else {
      // Immediately apply new dates
      setValue("startDate", newStart, { shouldDirty: true, shouldValidate: true });
      setValue("endDate", newEnd, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleConfirmDateChange = () => {
    if (!pendingDateChange) return;

    const { newStartDate, newEndDate } = pendingDateChange;
    const newDates = generateCalendarDateRange(newStartDate, newEndDate);
    const newDateSet = new Set(newDates);

    // Discard only the photos for dates that are no longer in the range
    setPhotosByDate((prev) => {
      const updated: Record<string, ITravelMemoryPhoto[]> = {};
      Object.entries(prev).forEach(([date, photos]) => {
        if (newDateSet.has(date)) {
          updated[date] = photos;
        } else {
          // Revoke any blob URLs
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

    setValue("startDate", newStartDate, { shouldDirty: true, shouldValidate: true });
    setValue("endDate", newEndDate, { shouldDirty: true, shouldValidate: true });
    setPendingDateChange(null);
    setRemovedDatesWarning([]);
  };

  const handleCancelDateChange = () => {
    // Keep previous valid dates and photos intact
    setPendingDateChange(null);
    setRemovedDatesWarning([]);
  };

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

  // Shared helper: process image files and append to a given date's photo list
  const processImageFiles = (date: string, files: File[]) => {
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

      // Construct daily collections ordered chronologically, preserving existing day ID
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

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit(onFormValid)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 6 }}
    >
      <HeaderTitle>
        {isEdit ? "Chỉnh sửa kỷ niệm chuyến đi" : "Thêm kỷ niệm chuyến đi"}
      </HeaderTitle>

      {/* 6.1 Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            {isEdit ? "Chỉnh sửa kỷ niệm chuyến đi" : "Thêm kỷ niệm chuyến đi"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Ghi lại thông tin và hình ảnh của một chuyến đi đã qua.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={onCancel}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              borderColor: "divider",
              color: "text.secondary",
              "&:focus-visible": {
                outline: "2px solid #1976D2",
                outlineOffset: 2,
              },
            }}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "none",
              "&:focus-visible": {
                outline: "2px solid #1976D2",
                outlineOffset: 2,
              },
            }}
          >
            {isLoading
              ? "Đang lưu..."
              : isEdit
              ? "Cập nhật kỷ niệm"
              : "Lưu kỷ niệm"}
          </Button>
        </Box>
      </Box>

      {/* 6.2 Trip Information Card */}
      <Card
        elevation={1}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#172033", mb: 0.5 }}
        >
          Thông tin chuyến đi
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
          Nhập các thông tin cơ bản về hành trình đã trải qua.
        </Typography>

        <Grid container spacing={2.5}>
          {/* Trip Title - Full Width */}
          <Grid sx={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              label="Tên chuyến đi"
              placeholder="Ví dụ: Đà Lạt – Những ngày bình yên"
              {...register("title")}
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
            />
          </Grid>

          {/* Destination / Location Selectbox - Full Width */}
          <Grid sx={{ width: "100%" }}>
            <Autocomplete<
              { label: string; value: string | number },
              false,
              false,
              false
            >
              fullWidth
              loading={isLoadingLocations}
              options={travelLocationsSelections}
              getOptionLabel={(option) => option.label || ""}
              value={selectedLocation}
              isOptionEqualToValue={(option, value) =>
                Number(option.value) === Number(value.value)
              }
              onChange={(_, newValue) => {
                const nextId = newValue ? Number(newValue.value) : null;
                const nextLabel = newValue ? newValue.label : "";
                setValue("locationId", nextId, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setValue("destination", nextLabel, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              noOptionsText="Không tìm thấy địa điểm"
              loadingText="Đang tải danh sách địa điểm..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="Địa điểm"
                  placeholder="Chọn địa điểm..."
                  error={Boolean(errors.locationId || errors.destination)}
                  helperText={
                    errors.locationId?.message || errors.destination?.message
                  }
                />
              )}
            />
          </Grid>

          {/* Date Row: [Ngày khởi hành] ~ [Ngày kết thúc] + Duration inline */}
          <Grid sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr auto 1fr",
                  lg: "minmax(180px, 1fr) auto minmax(180px, 1fr) auto",
                },
                alignItems: "start",
                columnGap: { xs: 2, sm: 1.5 },
                rowGap: { xs: 2, sm: 1.5 },
                width: "100%",
              }}
            >
              {/* Start Date Field Wrapper */}
              <Box
                sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
              >
                <DatePicker
                  label="Ngày khởi hành"
                  format="DD/MM/YYYY"
                  value={
                    startDate && dayjs(startDate, "YYYY-MM-DD").isValid()
                      ? dayjs(startDate, "YYYY-MM-DD")
                      : null
                  }
                  onChange={(newValue) => {
                    const nextStart =
                      newValue && newValue.isValid()
                        ? newValue.format("YYYY-MM-DD")
                        : "";
                    handleDateChangeAttempt(nextStart, endDate);
                  }}
                  slotProps={{
                    actionBar: {
                      actions: ["clear", "accept"],
                    },
                    textField: {
                      required: true,
                      fullWidth: true,
                      error: Boolean(startDateError),
                      helperText: undefined,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          height: "50px",
                          borderRadius: "8px",
                        },
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    minHeight: {
                      xs: startDateError ? "20px" : 0,
                      sm: startDateError || endDateError ? "20px" : 0,
                    },
                    mt: startDateError || endDateError ? 0.5 : 0,
                    px: 1.75,
                    transition: "min-height 0.15s ease",
                  }}
                >
                  {startDateError && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "error.main",
                        fontSize: "0.75rem",
                        lineHeight: 1.25,
                        fontWeight: 500,
                        display: "block",
                      }}
                    >
                      {startDateError}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* ~ Separator Box */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  height: "50px",
                  userSelect: "none",
                  px: 0.5,
                }}
              >
                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    lineHeight: 1,
                  }}
                >
                  ~
                </Typography>
              </Box>

              {/* End Date Field Wrapper */}
              <Box
                sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
              >
                <DatePicker
                  label="Ngày kết thúc"
                  format="DD/MM/YYYY"
                  value={
                    endDate && dayjs(endDate, "YYYY-MM-DD").isValid()
                      ? dayjs(endDate, "YYYY-MM-DD")
                      : null
                  }
                  minDate={
                    startDate && dayjs(startDate, "YYYY-MM-DD").isValid()
                      ? dayjs(startDate, "YYYY-MM-DD")
                      : undefined
                  }
                  onChange={(newValue) => {
                    const nextEnd =
                      newValue && newValue.isValid()
                        ? newValue.format("YYYY-MM-DD")
                        : "";
                    handleDateChangeAttempt(startDate, nextEnd);
                  }}
                  slotProps={{
                    actionBar: {
                      actions: ["clear", "accept"],
                    },
                    textField: {
                      required: true,
                      fullWidth: true,
                      error: Boolean(endDateError),
                      helperText: undefined,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          height: "50px",
                          borderRadius: "8px",
                        },
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    minHeight: {
                      xs: endDateError ? "20px" : 0,
                      sm: startDateError || endDateError ? "20px" : 0,
                    },
                    mt: startDateError || endDateError ? 0.5 : 0,
                    px: 1.75,
                    transition: "min-height 0.15s ease",
                  }}
                >
                  {endDateError && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "error.main",
                        fontSize: "0.75rem",
                        lineHeight: 1.25,
                        fontWeight: 500,
                        display: "block",
                      }}
                    >
                      {endDateError}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Duration Badge */}
              <Box
                sx={{
                  gridColumn: { xs: "1", sm: "1 / -1", lg: "auto" },
                  height: "50px",
                  px: 2,
                  py: 0.5,
                  borderRadius: "8px",
                  bgcolor: dateRangeValidation.isValid
                    ? "#EFF6FF"
                    : !startDate || !endDate
                    ? "background.default"
                    : "#FEF2F2",
                  border: "1px solid",
                  borderColor: dateRangeValidation.isValid
                    ? "#BFDBFE"
                    : !startDate || !endDate
                    ? "divider"
                    : "#FECACA",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  boxSizing: "border-box",
                  minWidth: { xs: "100%", sm: "fit-content", lg: 200 },
                  width: { xs: "100%", sm: "fit-content", lg: "auto" },
                  transition:
                    "background-color 0.2s ease, border-color 0.2s ease",
                }}
              >
                <CalendarMonthOutlinedIcon
                  sx={{
                    color: dateRangeValidation.isValid
                      ? "primary.main"
                      : !startDate || !endDate
                      ? "text.secondary"
                      : "error.main",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      fontSize: "0.75rem",
                      lineHeight: 1.15,
                      fontWeight: 500,
                    }}
                  >
                    Thời lượng tính toán
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      lineHeight: 1.25,
                      color: dateRangeValidation.isValid
                        ? "#1E40AF"
                        : !startDate || !endDate
                        ? "#64748B"
                        : "#DC2626",
                    }}
                  >
                    {!startDate || !endDate
                      ? "--"
                      : dateRangeValidation.isValid
                      ? duration.label
                      : "Không hợp lệ"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Description - Resizable Textarea */}
          <Grid sx={{ width: "100%" }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Mô tả chuyến đi"
              placeholder="Cảm nhận, ấn tượng hoặc tóm tắt những kỷ niệm đáng nhớ của chuyến đi..."
              {...register("description")}
              sx={{
                "& textarea": {
                  resize: "vertical",
                  minHeight: "90px",
                },
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* 6.4 Cover Image Section */}
      <Card
        elevation={1}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
              Ảnh bìa chuyến đi
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Một hình ảnh đại diện tiêu biểu nhất cho toàn bộ chuyến đi.
            </Typography>
          </Box>

          {coverImage && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteOutlinedIcon />}
              onClick={handleRemoveCover}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Xóa ảnh bìa
            </Button>
          )}
        </Box>

        {/* Hidden file input */}
        <input
          type="file"
          ref={coverInputRef}
          accept="image/png,image/jpeg,image/webp"
          style={{ display: "none" }}
          onChange={handleCoverFileChange}
        />

        {coverImage ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 220, sm: 320 },
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #E2E8F0",
              mt: 2,
            }}
          >
            <Box
              component="img"
              src={coverImage}
              alt="Ảnh bìa chuyến đi"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = DEFAULT_NO_IMAGE;
              }}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<CloudUploadOutlinedIcon />}
              onClick={() => coverInputRef.current?.click()}
              sx={{
                position: "absolute",
                bottom: 14,
                right: 14,
                bgcolor: "rgba(15, 23, 42, 0.8)",
                backdropFilter: "blur(4px)",
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": { bgcolor: "rgba(15, 23, 42, 0.95)" },
              }}
            >
              Thay đổi ảnh bìa
            </Button>
          </Box>
        ) : (
          <Box
            onClick={() => coverInputRef.current?.click()}
            sx={{
              mt: 2,
              p: 4,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: "12px",
              bgcolor: "background.default",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "#EFF6FF",
              },
              "&:focus-visible": {
                outline: "2px solid #1976D2",
                outlineOffset: 2,
              },
            }}
            tabIndex={0}
            role="button"
            aria-label="Nhấp để tải lên ảnh bìa"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                coverInputRef.current?.click();
              }
            }}
          >
            <CloudUploadOutlinedIcon
              sx={{ fontSize: 44, color: "text.secondary", mb: 1 }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Nhấp để tải lên ảnh bìa
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Hỗ trợ định dạng PNG, JPG, WebP. Tối ưu nhất với tỷ lệ 16:9.
            </Typography>
            <Button
              component="span"
              tabIndex={-1}
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Chọn ảnh từ thiết bị
            </Button>
          </Box>
        )}
      </Card>

      {/* 6.5 Automatic Daily Photo Sections */}
      <Card
        elevation={1}
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
              Hình ảnh theo từng ngày
            </Typography>
            <Chip
              label={`${activeDates.length} ngày`}
              size="small"
              sx={{
                bgcolor: "#EFF6FF",
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Các phần theo ngày được tạo tự động từ ngày khởi hành đến ngày kết
            thúc. Bạn có thể chọn nhiều ảnh độc lập cho từng ngày.
          </Typography>
        </Box>

        {activeDates.length === 0 ? (
          <Box
            sx={{
              p: 4,
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: "12px",
              bgcolor: "background.default",
              textAlign: "center",
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 36, color: "text.secondary", mb: 1 }}
            />
            <Typography
              variant="body1"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              Chưa có danh sách ngày hợp lệ
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Vui lòng chọn ngày khởi hành và ngày kết thúc ở phía trên để hệ
              thống tự động tạo các mục tải ảnh theo ngày.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {activeDates.map((date, index) => {
              const dayPhotos = photosByDate[date] || [];
              const dayNumber = index + 1;
              const formattedDate = formatDateVietnamese(date);

              const isCollapsed = collapsedDays[date] === true;
              const isDragOver = dragOverDate === date;

              return (
                <Card
                  key={date}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: isDragOver ? "primary.main" : "divider",
                    borderRadius: "12px",
                    bgcolor: isDragOver ? "#EFF6FF" : "background.paper",
                    overflow: "hidden",
                    transition: "border-color 0.15s, background-color 0.15s",
                  }}
                  onDragOver={(e) => handleDragOver(e, date)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, date)}
                >
                  {/* Day Header */}
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      bgcolor: isDragOver ? "#DBEAFE" : "action.hover",
                      borderBottom: isCollapsed ? "none" : "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                      transition: "background-color 0.15s",
                    }}
                  >
                    {/* Left: number badge + title + count + collapse toggle */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        cursor: "pointer",
                        userSelect: "none",
                        flex: 1,
                        minWidth: 0,
                        borderRadius: "4px",
                        "&:focus-visible": {
                          outline: "2px solid #1976D2",
                          outlineOffset: 2,
                        },
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={!isCollapsed}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          toggleDayCollapse(date);
                        }
                      }}
                      onClick={() => toggleDayCollapse(date)}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "4px",
                          bgcolor: "primary.main",
                          color: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        {dayNumber}
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#1E293B" }}
                      >
                        Ngày {dayNumber} · {formattedDate}
                      </Typography>
                      <Chip
                        label={`${dayPhotos.length} ảnh`}
                        size="small"
                        sx={{
                          bgcolor: dayPhotos.length > 0 ? "#ECFDF5" : "#E2E8F0",
                          color: dayPhotos.length > 0 ? "#059669" : "#64748B",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          ml: "auto",
                          color: "#64748B",
                          transform: isCollapsed
                            ? "rotate(-90deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.2s",
                          flexShrink: 0,
                        }}
                        tabIndex={-1}
                      >
                        <KeyboardArrowDownIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Hidden Day File Input */}
                    <input
                      type="file"
                      ref={(el) => {
                        dayInputRefs.current[date] = el;
                      }}
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      style={{ display: "none" }}
                      onChange={(e) => handleDayFilesChange(date, e)}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<AddPhotoAlternateOutlinedIcon />}
                      onClick={() => {
                        setCollapsedDays((prev) => ({
                          ...prev,
                          [date]: false,
                        }));
                        dayInputRefs.current[date]?.click();
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "8px",
                        boxShadow: "none",
                        fontSize: "0.82rem",
                      }}
                    >
                      Chọn hình ảnh
                    </Button>
                  </Box>

                  {/* Collapsible body */}
                  <Collapse in={!isCollapsed} timeout={200}>
                    {/* Day Description Textarea */}
                    <Box sx={{ px: 2, pt: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={4}
                        size="small"
                        label={`Ghi chú / Nhật ký Ngày ${dayNumber}`}
                        placeholder="Nhập cảm xúc, trải nghiệm hoặc tóm tắt các hoạt động nổi bật trong ngày..."
                        value={descriptionsByDate[date] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDescriptionsByDate((prev) => ({
                            ...prev,
                            [date]: val,
                          }));
                        }}
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        sx={{
                          bgcolor: "#FFFFFF",
                          borderRadius: "8px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                          "& textarea": {
                            resize: "vertical",
                          },
                        }}
                      />
                    </Box>

                    {/* Day Photos Grid */}
                    <CardContent sx={{ p: 2 }}>
                      {dayPhotos.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 1.5,
                            p: 1,
                            borderRadius: "8px",
                            bgcolor: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleSelectAllPhotos(date)}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "#334155",
                              }}
                            >
                              {(selectedPhotoIdsByDate[date]?.length ?? 0) ===
                              dayPhotos.length
                                ? "Bỏ chọn tất cả"
                                : "Chọn tất cả"}
                            </Button>

                            {(selectedPhotoIdsByDate[date]?.length ?? 0) >
                              0 && (
                              <Chip
                                label={`Đã chọn ${selectedPhotoIdsByDate[date]?.length} ảnh`}
                                size="small"
                                color="primary"
                                sx={{
                                  height: 22,
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                }}
                              />
                            )}
                          </Box>

                          {(selectedPhotoIdsByDate[date]?.length ?? 0) > 0 && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<DeleteOutlinedIcon fontSize="small" />}
                              onClick={() => handleDeleteSelectedPhotos(date)}
                              sx={{
                                textTransform: "none",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                borderRadius: "6px",
                              }}
                            >
                              Xóa ({selectedPhotoIdsByDate[date]?.length}) ảnh đã
                              chọn
                            </Button>
                          )}
                        </Box>
                      )}

                      <TravelMemoryPhotoGrid
                        photos={dayPhotos}
                        selectedPhotoIds={selectedPhotoIdsByDate[date] || []}
                        onToggleSelectPhoto={(photoId) =>
                          handleTogglePhotoSelect(date, photoId)
                        }
                        isDragOver={isDragOver}
                        onPhotoClick={(photoIdx) => {
                          setLightboxState({
                            open: true,
                            photos: dayPhotos,
                            currentIndex: photoIdx,
                            dateLabel: `Ngày ${dayNumber} · ${formattedDate}`,
                          });
                        }}
                        onRemovePhoto={(photoId) =>
                          handleRemovePhoto(date, photoId)
                        }
                        emptyMessage="Chưa có hình ảnh nào. Nhấp 'Chọn hình ảnh' hoặc kéo thả ảnh vào đây."
                      />
                    </CardContent>
                  </Collapse>
                </Card>
              );
            })}
          </Box>
        )}
      </Card>

      {/* 6.9 Bottom Action Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          pt: 1,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            borderColor: "divider",
            color: "text.secondary",
            px: 3,
            height: 42,
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Hủy bỏ
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            px: 3.5,
            height: 42,
          }}
        >
          {isLoading
            ? "Đang lưu..."
            : isEdit
            ? "Cập nhật kỷ niệm"
            : "Lưu kỷ niệm"}
        </Button>
      </Box>

      {/* Date Range Change Confirmation Dialog */}
      <TravelMemoryDateConfirmDialog
        open={Boolean(pendingDateChange)}
        removedDates={removedDatesWarning}
        onCancel={handleCancelDateChange}
        onConfirm={handleConfirmDateChange}
      />

      {/* Thumbnail Lightbox Preview */}
      <TravelMemoryPhotoLightbox
        open={lightboxState.open}
        photos={lightboxState.photos}
        currentIndex={lightboxState.currentIndex}
        dateLabel={lightboxState.dateLabel}
        onClose={() => setLightboxState((prev) => ({ ...prev, open: false }))}
        onNavigate={(newIdx) =>
          setLightboxState((prev) => ({ ...prev, currentIndex: newIdx }))
        }
      />

      {/* Soft-Delete Undo Notification */}
      <Snackbar
        open={showUndoSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowUndoSnackbar(false)}
        message={`Đã xóa ${undoBuffer?.photos.length || 1} ảnh`}
        action={
          <Button
            color="primary"
            size="small"
            onClick={handleUndoDelete}
            sx={{
              fontWeight: 700,
              textTransform: "none",
              color: "#60A5FA",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
            }}
          >
            Hoàn tác
          </Button>
        }
        sx={{
          bottom: { xs: 72, sm: 24 },
          "& .MuiSnackbarContent-root": {
            bgcolor: "#0F172A",
            color: "#F8FAFC",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
          },
        }}
      />
    </Box>
  );
};
