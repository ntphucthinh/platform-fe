import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  Collapse,
  IconButton,
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
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import type {
  ITravelMemory,
  ITravelMemoryDay,
  ITravelMemoryPhoto,
  IRemovedDatePhotoSummary,
} from "@/types/pages/travel-memories/travelMemory";
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
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

export interface TravelMemoryFormProps {
  initialData?: ITravelMemory | null;
  isEdit?: boolean;
  onSubmit: (formData: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    description: string;
    coverImage: string;
    days: ITravelMemoryDay[];
  }) => void;
  onCancel: () => void;
}

export const TravelMemoryForm: React.FC<TravelMemoryFormProps> = ({
  initialData,
  isEdit = false,
  onSubmit,
  onCancel,
}) => {
  // Form fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [startDate, setStartDate] = useState(
    initialData?.startDate || dayjs().format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(
    initialData?.endDate || dayjs().add(2, "day").format("YYYY-MM-DD"),
  );
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");

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

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});

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

  // Hidden file inputs refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dayInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Handle Cover Image selection
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        coverImage: "Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP).",
      }));
      return;
    }

    if (coverImage && coverImage.startsWith("blob:")) {
      revokeObjectUrl(coverImage);
    }

    const previewUrl = registerObjectUrl(URL.createObjectURL(file));
    setCoverImage(previewUrl);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.coverImage;
      return next;
    });

    // Reset input value so selecting the same file again triggers change
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleRemoveCover = () => {
    if (coverImage && coverImage.startsWith("blob:")) {
      revokeObjectUrl(coverImage);
    }
    setCoverImage("");
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  // Handle Date Changes with Confirmation Guard
  const handleDateChangeAttempt = (
    newStart: string,
    newEnd: string,
  ) => {
    const validation = validateDateRange(newStart, newEnd);

    if (!validation.isValid) {
      // Allow user to temporarily type or pick invalid date, but record validation error
      setStartDate(newStart);
      setEndDate(newEnd);
      setErrors((prev) => ({ ...prev, dateRange: validation.error || "" }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.dateRange;
      return next;
    });

    const newDates = generateCalendarDateRange(newStart, newEnd);
    const affectedDates = findRemovedDatesWithPhotos(photosByDate, newDates);

    if (affectedDates.length > 0) {
      // Require user confirmation before removing dates with photos
      setPendingDateChange({ newStartDate: newStart, newEndDate: newEnd });
      setRemovedDatesWarning(affectedDates);
    } else {
      // Immediately apply new dates
      setStartDate(newStart);
      setEndDate(newEnd);
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

    setStartDate(newStartDate);
    setEndDate(newEndDate);
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
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          imageUrl: previewUrl,
          fileName: file.name,
          fileSize: file.size,
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
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, date: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverDate(null);
    processImageFiles(date, Array.from(e.dataTransfer.files));
  };

  const handleRemovePhoto = (date: string, photoId: string) => {
    setPhotosByDate((prev) => {
      const currentList = prev[date] || [];
      const photoToRemove = currentList.find((p) => p.id === photoId);
      if (photoToRemove && photoToRemove.imageUrl?.startsWith("blob:")) {
        revokeObjectUrl(photoToRemove.imageUrl);
      }
      return {
        ...prev,
        [date]: currentList.filter((p) => p.id !== photoId),
      };
    });
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Vui lòng nhập tên chuyến đi.";
    }
    if (!destination.trim()) {
      newErrors.destination = "Vui lòng nhập địa điểm chuyến đi.";
    }

    const dateVal = validateDateRange(startDate, endDate);
    if (!dateVal.isValid) {
      newErrors.dateRange = dateVal.error || "Khoảng thời gian không hợp lệ.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Construct daily collections ordered chronologically
    const days: ITravelMemoryDay[] = activeDates.map((date) => ({
      date,
      photos: photosByDate[date] || [],
    }));

    onSubmit({
      title: title.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      description: description.trim(),
      coverImage: coverImage || DEFAULT_NO_IMAGE,
      days,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
              borderColor: "#CBD5E1",
              color: "#475569",
            }}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "none",
            }}
          >
            {isEdit ? "Cập nhật kỷ niệm" : "Lưu kỷ niệm"}
          </Button>
        </Box>
      </Box>

      {/* Date Range Error Alert if any */}
      {errors.dateRange && (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>
          {errors.dateRange}
        </Alert>
      )}

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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.title;
                    return next;
                  });
                }
              }}
              error={Boolean(errors.title)}
              helperText={errors.title}
            />
          </Grid>

          {/* Destination - Full Width */}
          <Grid sx={{ width: "100%" }}>
            <TextField
              fullWidth
              required
              label="Địa điểm"
              placeholder="Ví dụ: Đà Lạt, Lâm Đồng"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (errors.destination) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.destination;
                    return next;
                  });
                }
              }}
              error={Boolean(errors.destination)}
              helperText={errors.destination}
            />
          </Grid>

          {/* Date Row: [Ngày khởi hành] ~ [Ngày kết thúc] + Duration inline */}
          <Grid sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: { xs: 2, sm: 1.5 },
              }}
            >
              {/* Start Date */}
              <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Ngày khởi hành"
                  value={startDate}
                  onChange={(e) => handleDateChangeAttempt(e.target.value, endDate)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              {/* ~ Separator */}
              <Typography
                sx={{
                  color: "#94A3B8",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  flexShrink: 0,
                  userSelect: "none",
                  mt: 0.5,
                  display: { xs: "none", sm: "block" },
                }}
              >
                ~
              </Typography>

              {/* End Date */}
              <Box sx={{ flex: "1 1 180px", minWidth: 160 }}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Ngày kết thúc"
                  value={endDate}
                  onChange={(e) => handleDateChangeAttempt(startDate, e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              {/* Duration Badge - inline after dates */}
              <Box
                sx={{
                  flex: "0 0 auto",
                  height: 50,
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  bgcolor: dateRangeValidation.isValid ? "#EFF6FF" : "#FEF2F2",
                  border: "1px solid",
                  borderColor: dateRangeValidation.isValid ? "#BFDBFE" : "#FECACA",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  boxSizing: "border-box",
                  minWidth: 200,
                }}
              >
                <CalendarMonthOutlinedIcon
                  sx={{
                    color: dateRangeValidation.isValid ? "#2563EB" : "#DC2626",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748B", display: "block", lineHeight: 1.2, fontWeight: 500 }}
                  >
                    Thời lượng tính toán
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: dateRangeValidation.isValid ? "#1E40AF" : "#DC2626",
                    }}
                  >
                    {dateRangeValidation.isValid ? duration.label : "Không hợp lệ"}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#172033" }}
            >
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
              border: "2px dashed #CBD5E1",
              borderRadius: "12px",
              bgcolor: "#F8FAFC",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#2563EB",
                bgcolor: "#EFF6FF",
              },
            }}
          >
            <CloudUploadOutlinedIcon
              sx={{ fontSize: 44, color: "#94A3B8", mb: 1 }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#1E293B" }}
            >
              Nhấp để tải lên ảnh bìa
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Hỗ trợ định dạng PNG, JPG, WebP. Tối ưu nhất với tỷ lệ 16:9.
            </Typography>
            <Button
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
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#172033" }}
            >
              Hình ảnh theo từng ngày
            </Typography>
            <Chip
              label={`${activeDates.length} ngày`}
              size="small"
              sx={{
                bgcolor: "#EFF6FF",
                color: "#2563EB",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
            Các phần theo ngày được tạo tự động từ ngày khởi hành đến ngày kết
            thúc. Bạn có thể chọn nhiều ảnh độc lập cho từng ngày.
          </Typography>
        </Box>

        {activeDates.length === 0 ? (
          <Box
            sx={{
              p: 4,
              border: "1px dashed #CBD5E1",
              borderRadius: "12px",
              bgcolor: "#F8FAFC",
              textAlign: "center",
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 36, color: "#94A3B8", mb: 1 }} />
            <Typography variant="body1" sx={{ color: "#475569", fontWeight: 600 }}>
              Chưa có danh sách ngày hợp lệ
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
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
                    borderColor: isDragOver ? "#2563EB" : "#E2E8F0",
                    borderRadius: "12px",
                    bgcolor: isDragOver ? "#EFF6FF" : "#FAFAFA",
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
                      bgcolor: isDragOver ? "#DBEAFE" : "#F1F5F9",
                      borderBottom: isCollapsed ? "none" : "1px solid #E2E8F0",
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
                      }}
                      onClick={() => toggleDayCollapse(date)}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "6px",
                          bgcolor: "#2563EB",
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
                          transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
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
                        setCollapsedDays((prev) => ({ ...prev, [date]: false }));
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
                    {/* Drag hint banner - shown only when dragging over */}
                    {isDragOver && (
                      <Box
                        sx={{
                          mx: 2,
                          mt: 2,
                          p: 2,
                          borderRadius: "8px",
                          border: "2px dashed #2563EB",
                          bgcolor: "#EFF6FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <AddPhotoAlternateOutlinedIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: "#2563EB", fontWeight: 600 }}>
                          Thả ảnh vào đây
                        </Typography>
                      </Box>
                    )}

                    {/* Day Photos Grid */}
                    <CardContent sx={{ p: 2 }}>
                      <TravelMemoryPhotoGrid
                        photos={dayPhotos}
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
            borderColor: "#CBD5E1",
            color: "#475569",
            px: 3,
            height: 42,
          }}
        >
          Hủy bỏ
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            px: 3.5,
            height: 42,
          }}
        >
          {isEdit ? "Cập nhật kỷ niệm" : "Lưu kỷ niệm"}
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
    </Box>
  );
};
