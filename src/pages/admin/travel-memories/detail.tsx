import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Collapse,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { useTravelMemoryDetail } from "@/hooks/travel-memories/useTravelMemoryDetail";
import { useDeleteTravelMemory } from "@/hooks/travel-memories/useDeleteTravelMemory";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import {
  calculateCalendarDuration,
  countTotalPhotos,
  formatDateRangeVietnamese,
  formatDateVietnamese,
} from "@/utils/travelMemoryUtils";
import { TravelMemoryPhotoGrid } from "@/components/pages/travel-memories/travelMemoryPhotoGrid";
import { TravelMemoryPhotoLightbox } from "@/components/pages/travel-memories/travelMemoryPhotoLightbox";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import type { ITravelMemoryPhoto } from "@/types/pages/travel-memories/travelMemory";

export const TravelMemoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : null;
  const navigate = useNavigate();

  const { data: memory, isLoading, error, refetch } = useTravelMemoryDetail(
    numericId && !isNaN(numericId) ? numericId : null,
  );

  // Lightbox state
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

  // Collapse state per day: key = ISO date, value = boolean (true: collapsed, false: expanded)
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>(
    {},
  );

  const location = useLocation();
  const { deleteTravelMemory, isLoading: isDeleting } = useDeleteTravelMemory();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const navSuccessMessage = (
    location.state as { successMessage?: string } | null
  )?.successMessage;

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>(() => ({
    open: Boolean(navSuccessMessage),
    message: navSuccessMessage || "",
    severity: "success",
  }));

  const handleConfirmDelete = async () => {
    if (!numericId || !memory) return;
    const { success, error: delError } = await deleteTravelMemory(numericId);
    if (success) {
      navigate("/admin/travel-memories", {
        state: {
          successMessage: "Đã xóa chuyến đi thành công.",
        },
      });
    } else {
      setSnackbar({
        open: true,
        message: delError || "Xóa chuyến đi thất bại.",
        severity: "error",
      });
      setOpenDeleteDialog(false);
    }
  };

  const toggleDayCollapse = (date: string) => {
    setCollapsedDays((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <HeaderTitle>Chi tiết chuyến đi</HeaderTitle>
        <CircularProgress size={40} sx={{ color: "#2563EB" }} />
        <Typography variant="body1" sx={{ color: "#64748B", fontWeight: 500 }}>
          Đang tải thông tin chuyến đi...
        </Typography>
      </Box>
    );
  }

  if (error || !memory) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <HeaderTitle>Không tìm thấy kỷ niệm</HeaderTitle>
        <CollectionsBookmarkOutlinedIcon
          sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
          {error || "Chuyến đi không tồn tại hoặc đã bị xóa"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mt: 1, mb: 3 }}>
          {error
            ? "Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại hoặc quay lại danh sách."
            : "Không tìm thấy dữ liệu kỷ niệm chuyến đi phù hợp với mã định danh này."}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/travel-memories")}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
          >
            Quay lại danh sách
          </Button>
          {error && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => void refetch()}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
            >
              Thử lại
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  const duration = calculateCalendarDuration(memory.startDate, memory.endDate);
  const totalPhotos = countTotalPhotos(memory.days);
  const dateRangeLabel = formatDateRangeVietnamese(
    memory.startDate,
    memory.endDate,
  );

  const allCollapsed =
    memory.days.length > 0 &&
    memory.days.every((day) => collapsedDays[day.date] === true);

  const toggleAllDays = () => {
    const nextState: Record<string, boolean> = {};
    memory.days.forEach((day) => {
      nextState[day.date] = !allCollapsed;
    });
    setCollapsedDays(nextState);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 6 }}>
      <HeaderTitle>{memory.title}</HeaderTitle>

      {/* Top Navigation & Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/travel-memories")}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#CBD5E1",
            color: "#475569",
          }}
        >
          Quay lại danh sách
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlinedIcon />}
            onClick={() => setOpenDeleteDialog(true)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Xóa chuyến đi
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/admin/travel-memories/${memory.id}/edit`)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Chỉnh sửa chuyến đi
          </Button>
        </Box>
      </Box>

      {/* Hero Banner & Trip Overview */}
      <Card
        elevation={1}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Cover Image Banner */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 240, sm: 360, md: 420 },
            bgcolor: "#0F172A",
          }}
        >
          <Box
            component="img"
            src={memory.coverImage || DEFAULT_NO_IMAGE}
            alt={memory.title}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = DEFAULT_NO_IMAGE;
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Dark Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.3) 60%, rgba(15, 23, 42, 0.1) 100%)",
            }}
          />

          {/* Banner Floating Details */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: { xs: 2.5, sm: 4 },
              color: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.2,
                mb: 1.5,
              }}
            >
              <Chip
                icon={
                  <AccessTimeOutlinedIcon
                    sx={{
                      fontSize: "15px !important",
                      color: "#FFFFFF !important",
                    }}
                  />
                }
                label={duration.label}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(6px)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderRadius: "6px",
                }}
              />
              <Chip
                icon={
                  <PhotoCameraBackOutlinedIcon
                    sx={{
                      fontSize: "15px !important",
                      color: "#FFFFFF !important",
                    }}
                  />
                }
                label={`${totalPhotos} hình ảnh`}
                size="small"
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(6px)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  borderRadius: "6px",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                color: "#FFFFFF",
                fontSize: { xs: "1.5rem", sm: "2.1rem" },
                lineHeight: 1.25,
                mb: 1.5,
              }}
            >
              {memory.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2.5,
                color: "#E2E8F0",
                fontSize: "0.92rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <LocationOnOutlinedIcon
                  sx={{ fontSize: 20, color: "#60A5FA" }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {memory.destination}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <CalendarMonthOutlinedIcon
                  sx={{ fontSize: 19, color: "#93C5FD" }}
                />
                <Typography variant="body2">{dateRangeLabel}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Description Section */}
        {memory.description && (
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                mb: 1,
              }}
            >
              Nhật ký chuyến đi
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#334155",
                lineHeight: 1.7,
                fontSize: "0.98rem",
                whiteSpace: "pre-line",
              }}
            >
              {memory.description}
            </Typography>
          </CardContent>
        )}
      </Card>

      {/* 7.2 Daily Photo Albums */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#172033" }}>
              Album ảnh theo từng ngày
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Bấm vào tiêu đề ngày để đóng/mở danh sách ảnh hoặc bấm vào ảnh để
              phóng to.
            </Typography>
          </Box>

          {memory.days.length > 1 && (
            <Button
              size="small"
              variant="text"
              onClick={toggleAllDays}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#2563EB",
                "&:hover": { bgcolor: "#EFF6FF" },
              }}
            >
              {allCollapsed ? "Mở rộng tất cả" : "Thu gọn tất cả"}
            </Button>
          )}
        </Box>

        {memory.days.map((day, index) => {
          const dayNumber = index + 1;
          const formattedDate = formatDateVietnamese(day.date);
          const photoCount = day.photos.length;
          const isCollapsed = collapsedDays[day.date] === true;

          return (
            <Card
              key={day.date}
              elevation={1}
              sx={{
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                overflow: "hidden",
              }}
            >
              {/* Day Header */}
              <Box
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 1.8,
                  bgcolor: "#F8FAFC",
                  borderBottom: isCollapsed ? "none" : "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "background-color 0.15s",
                  "&:hover": {
                    bgcolor: "#F1F5F9",
                  },
                }}
                onClick={() => toggleDayCollapse(day.date)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      bgcolor: "#2563EB",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    {dayNumber}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#1E293B",
                      fontSize: "1.05rem",
                    }}
                  >
                    Ngày {dayNumber} · {formattedDate}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip
                    label={`${photoCount} ảnh`}
                    size="small"
                    sx={{
                      bgcolor: photoCount > 0 ? "#EFF6FF" : "#F1F5F9",
                      color: photoCount > 0 ? "#1D4ED8" : "#64748B",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      color: "#64748B",
                      transform: isCollapsed
                        ? "rotate(-90deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                    tabIndex={-1}
                    aria-label={isCollapsed ? "Mở rộng ngày" : "Thu gọn ngày"}
                  >
                    <KeyboardArrowDownIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Collapsible Content */}
              <Collapse in={!isCollapsed} timeout={200}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  {day.description && (
                    <Box
                      sx={{
                        mb: 2.5,
                        p: 2,
                        borderRadius: "10px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          fontWeight: 700,
                          color: "#2563EB",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          mb: 0.5,
                        }}
                      >
                        Nhật ký ngày {dayNumber}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#334155",
                          lineHeight: 1.65,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {day.description}
                      </Typography>
                    </Box>
                  )}

                  <TravelMemoryPhotoGrid
                    photos={day.photos}
                    readOnly
                    onPhotoClick={(photoIdx) => {
                      setLightboxState({
                        open: true,
                        photos: day.photos,
                        currentIndex: photoIdx,
                        dateLabel: `Ngày ${dayNumber} · ${formattedDate}`,
                      });
                    }}
                    emptyMessage="Ngày này chưa có hình ảnh kỷ niệm."
                  />
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Box>

      {/* Lightbox Modal */}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={openDeleteDialog}
        title="Xóa Kỷ Niệm Chuyến Đi"
        loading={isDeleting}
        message="Bạn có chắc chắn muốn xóa chuyến đi này? Toàn bộ hình ảnh và dữ liệu liên quan của chuyến đi sẽ bị xóa khỏi hệ thống."
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TravelMemoryDetailPage;
