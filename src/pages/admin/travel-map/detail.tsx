import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOffOutlinedIcon from "@mui/icons-material/LocationOffOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import {
  getLocationById,
  getLocationWithDetails,
  updateLocation,
  subscribeTravelMap,
} from "@/services/travelMapService";
import { subscribeTravelMemories } from "@/services/travelMemoryService";
import {
  formatDateRangeVietnamese,
  calculateCalendarDuration,
  countTotalPhotos,
} from "@/utils/travelMemoryUtils";
import { LocationFormDialog } from "@/components/pages/travel-map/locationFormDialog";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";
import type {
  ILocation,
  ILocationFormData,
  ILocationWithDetails,
} from "@/types/pages/travel-map/travelMap";

export const TravelMapDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const handleBack = () => {
    if (
      routerLocation.state &&
      typeof routerLocation.state === "object" &&
      "from" in routerLocation.state &&
      typeof (routerLocation.state as { from: unknown }).from === "string"
    ) {
      navigate((routerLocation.state as { from: string }).from);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/admin/travel-map");
    }
  };

  const [location, setLocation] = useState<ILocation | undefined>(() =>
    id ? getLocationById(id) : undefined,
  );
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setLocation(id ? getLocationById(id) : undefined);
  }

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const unsubMap = subscribeTravelMap(() => {
      if (id) {
        setLocation(getLocationById(id));
      }
    });
    const unsubMemories = subscribeTravelMemories(() => {
      if (id) {
        setLocation(getLocationById(id));
      }
    });
    return () => {
      unsubMap();
      unsubMemories();
    };
  }, [id]);

  // Derived details
  const details: ILocationWithDetails | null = useMemo(() => {
    return location ? getLocationWithDetails(location) : null;
  }, [location]);

  // Handle Edit Submit
  const handleEditSubmit = (formData: ILocationFormData) => {
    if (!id) return;
    const updated = updateLocation(id, formData);
    if (updated) {
      setLocation(updated);
      setSnackbar({
        open: true,
        message: `Đã cập nhật thông tin địa điểm "${updated.name}" thành công!`,
        severity: "success",
      });
    }
  };

  // 1. Not Found State
  if (!location || !details) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <HeaderTitle>Không tìm thấy địa điểm</HeaderTitle>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#F1F5F9",
            color: "#94A3B8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <LocationOffOutlinedIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#0F172A", mb: 1 }}
        >
          Không tìm thấy địa điểm
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#64748B", maxWidth: 480, mb: 3 }}
        >
          Mã định danh "{id}" không tồn tại hoặc địa điểm này đã bị gỡ bỏ khỏi
          bản đồ hành trình.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/travel-map")}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            boxShadow: "none",
          }}
        >
          Quay lại Bản đồ hành trình
        </Button>
      </Box>
    );
  }

  const isVisited = details.status === "Visited";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        pb: 8,
      }}
    >
      <HeaderTitle>{`Chi tiết: ${details.name}`}</HeaderTitle>

      {/* 1. Breadcrumbs & Quick Back Navigation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={handleBack}
            sx={{
              color: "#475569",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: "8px",
              px: 1.5,
              py: 0.5,
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              "&:hover": { bgcolor: "#F8FAFC", color: "#0F172A" },
            }}
          >
            Bản đồ hành trình
          </Button>
          <Typography sx={{ color: "#94A3B8" }}>/</Typography>
          <Typography
            sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.95rem" }}
          >
            {details.name}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon fontSize="small" />}
            onClick={() => setFormDialogOpen(true)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#CBD5E1",
              color: "#334155",
              px: 2,
              bgcolor: "#FFFFFF",
              "&:hover": { bgcolor: "#F8FAFC", borderColor: "#94A3B8" },
            }}
          >
            Chỉnh sửa địa điểm
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<MapOutlinedIcon fontSize="small" />}
            onClick={() => navigate("/admin/travel-map")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.25,
              boxShadow: "none",
            }}
          >
            Xem trên bản đồ
          </Button>
        </Box>
      </Box>

      {/* 2. Hero Section */}
      <Card
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Cover Banner with Gradient */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 220, sm: 300, md: 340 },
          }}
        >
          <CardMedia
            component="img"
            image={details.coverImage || DEFAULT_NO_IMAGE}
            alt={details.name}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = DEFAULT_NO_IMAGE;
            }}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.3) 50%, transparent 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: { xs: 2.5, sm: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={isVisited ? "Đã ghé thăm" : "Muốn đến (Wishlist)"}
                size="small"
                sx={{
                  bgcolor: isVisited ? "#059669" : "#D97706",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "monospace",
                  bgcolor: "rgba(0,0,0,0.3)",
                  px: 1,
                  py: 0.25,
                  borderRadius: "6px",
                }}
              >
                {details.latitude.toFixed(4)}, {details.longitude.toFixed(4)}
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#FFFFFF",
                fontSize: { xs: "1.75rem", sm: "2.35rem", md: "2.75rem" },
                letterSpacing: "-0.02em",
                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                mb: 0.75,
              }}
            >
              {details.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                color: "rgba(255,255,255,0.9)",
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#93C5FD" }} />
              <Typography variant="body1" sx={{ color: "inherit" }}>
                {details.address}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Hero Bottom Bar: Description & Google Maps */}
        <Box
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            bgcolor: "#FFFFFF",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#334155",
              lineHeight: 1.6,
              maxWidth: 780,
              fontSize: "0.975rem",
            }}
          >
            {details.description ||
              "Chưa có thông tin giới thiệu chi tiết cho địa điểm này."}
          </Typography>

          {details.googleMapsUrl && (
            <Button
              variant="outlined"
              endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
              href={details.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                color: "#1976D2",
                borderColor: "#BFDBFE",
                bgcolor: "#EFF6FF",
                whiteSpace: "nowrap",
                flexShrink: 0,
                "&:hover": { bgcolor: "#DBEAFE" },
              }}
            >
              Mở trên Google Maps
            </Button>
          )}
        </Box>
      </Card>

      {/* 3. Key Metrics: Lần ghé thăm, Ảnh kỷ niệm, Lần gần nhất */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "12px",
              bgcolor: "#EFF6FF",
              border: "1px solid #BFDBFE",
              color: "#1976D2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FlightTakeoffRoundedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Lần ghé thăm
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.1,
                my: 0.25,
              }}
            >
              {details.visitCount}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              {details.visitCount > 0
                ? "Chuyến đi đã hoàn thành"
                : "Chưa có chuyến đi nào"}
            </Typography>
          </Box>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "12px",
              bgcolor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              color: "#059669",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PhotoCameraBackOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Ảnh kỷ niệm
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.1,
                my: 0.25,
              }}
            >
              {details.totalPhotos}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              {details.totalPhotos > 0
                ? "Khoảnh khắc được lưu lại"
                : "0 ảnh lưu giữ"}
            </Typography>
          </Box>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "12px",
              bgcolor: "#FFFBEB",
              border: "1px solid #FDE68A",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CalendarMonthOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Lần gần nhất
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.2,
                my: 0.5,
              }}
            >
              {details.latestVisitDate
                ? formatDateRangeVietnamese(
                    details.latestVisitDate,
                    details.latestVisitDate,
                  )
                : "Chưa có dữ liệu"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              {details.latestVisitDate ? "Thời điểm ghé thăm" : "—"}
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* 4. History of Visits (Các chuyến đi đã thực hiện) */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0F172A",
                fontSize: { xs: "1.25rem", sm: "1.45rem" },
              }}
            >
              Các chuyến đi đã thực hiện ({details.memories.length})
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
              Những chuyến đi và kỷ niệm của bạn tại địa điểm này.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/travel-memories/create")}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            Thêm kỷ niệm chuyến đi
          </Button>
        </Box>

        {details.memories.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px dashed #CBD5E1",
              bgcolor: "#F8FAFC",
              p: { xs: 4, sm: 6 },
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                bgcolor: "#EFF6FF",
                color: "#1976D2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <FlightTakeoffRoundedIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}
            >
              Chưa có chuyến đi nào được liên kết
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", maxWidth: 480, mx: "auto", mb: 2.5 }}
            >
              {isVisited
                ? "Bạn đã ghé thăm nơi này nhưng chưa nhập kỷ niệm hoặc album ảnh chi tiết."
                : "Địa điểm này hiện đang nằm trong danh sách muốn đến trong tương lai."}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/admin/travel-memories/create")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Tạo kỷ niệm chuyến đi ngay
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {details.memories.map((mem) => {
              const photoCount = countTotalPhotos(mem.days);
              const duration = calculateCalendarDuration(
                mem.startDate,
                mem.endDate,
              );
              const dateText = formatDateRangeVietnamese(
                mem.startDate,
                mem.endDate,
              );

              return (
                <Card
                  key={mem.id}
                  elevation={0}
                  onClick={() => navigate(`/admin/travel-memories/${mem.id}`)}
                  sx={{
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    bgcolor: "#FFFFFF",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                      borderColor: "#1976D2",
                    },
                  }}
                >
                  {/* Trip Cover Image */}
                  <CardMedia
                    component="img"
                    image={mem.coverImage || DEFAULT_NO_IMAGE}
                    alt={mem.title}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = DEFAULT_NO_IMAGE;
                    }}
                    sx={{
                      width: { xs: "100%", sm: 220, md: 260 },
                      height: { xs: 180, sm: "auto" },
                      minHeight: { sm: 160 },
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />

                  {/* Trip Content */}
                  <CardContent
                    sx={{
                      p: { xs: 2.5, sm: 3 },
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={duration.label}
                          size="small"
                          sx={{
                            bgcolor: "#EFF6FF",
                            color: "#1976D2",
                            fontWeight: 700,
                            borderRadius: "6px",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "#64748B",
                            fontSize: "0.85rem",
                          }}
                        >
                          <CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
                          {dateText}
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#0F172A",
                          fontSize: { xs: "1.1rem", sm: "1.2rem" },
                          lineHeight: 1.3,
                          mb: 1,
                        }}
                      >
                        {mem.title}
                      </Typography>

                      {mem.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#475569",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {mem.description}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        pt: 2,
                        mt: 1.5,
                        borderTop: "1px solid #F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          color: "#1976D2",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                        }}
                      >
                        <PhotoCameraBackOutlinedIcon sx={{ fontSize: 18 }} />
                        {photoCount} ảnh kỷ niệm
                      </Box>

                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon fontSize="small" />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "#1976D2",
                        }}
                      >
                        Xem kỷ niệm
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>

      {/* 5. Related Itineraries (Lịch trình liên quan) */}
      {details.itineraries.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0F172A",
                fontSize: { xs: "1.25rem", sm: "1.45rem" },
              }}
            >
              Lịch trình liên quan ({details.itineraries.length})
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
              Kế hoạch và lộ trình du lịch dự kiến gắn với điểm đến này.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {details.itineraries.map((it) => (
              <Card
                key={it.id}
                elevation={0}
                onClick={() => navigate(`/admin/itineraries/${it.id}/preview`)}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                  bgcolor: "#FFFFFF",
                  p: 2.5,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                    borderColor: "#1976D2",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: "#EFF6FF",
                        color: "#1976D2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MapOutlinedIcon sx={{ fontSize: 22 }} />
                    </Box>
                    <Chip
                      label={it.duration || `${it.durationDays} ngày`}
                      size="small"
                      sx={{
                        bgcolor: "#F1F5F9",
                        color: "#475569",
                        fontWeight: 600,
                        borderRadius: "6px",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#0F172A",
                      fontSize: "1.05rem",
                      mb: 0.5,
                    }}
                  >
                    {it.title}
                  </Typography>

                  {it.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748B",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {it.description}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    pt: 1.5,
                    borderTop: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                    Lộ trình gợi ý
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      color: "#1976D2",
                      p: 0,
                    }}
                  >
                    Xem lịch trình
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* 6. Detailed Location Info & Personal Notes */}
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
          p: { xs: 2.5, sm: 3.5 },
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}
        >
          Thông tin điểm đến & Ghi chú
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "#64748B" }}
            >
              Địa chỉ chi tiết
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#0F172A", fontWeight: 500, mt: 0.25 }}
            >
              {details.address}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "#64748B" }}
            >
              Tọa độ địa lý (GPS)
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#0F172A", fontFamily: "monospace", mt: 0.25 }}
            >
              Vĩ độ (Latitude): {details.latitude} | Kinh độ (Longitude):{" "}
              {details.longitude}
            </Typography>
          </Box>

          {details.notes && (
            <Box
              sx={{
                p: 2,
                bgcolor: "#FFFBEB",
                border: "1px solid #FDE68A",
                borderRadius: "12px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <NotesOutlinedIcon
                sx={{ color: "#D97706", fontSize: 20, mt: 0.25 }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#92400E", mb: 0.25 }}
                >
                  Ghi chú cá nhân / Kinh nghiệm chuyến đi
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#78350F", lineHeight: 1.6 }}
                >
                  {details.notes}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Card>

      {/* 7. Edit Location Dialog */}
      <LocationFormDialog
        open={formDialogOpen}
        initialData={details}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleEditSubmit}
      />

      {/* 8. Notification Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export { TravelMapDetailPage as AdminTravelMapDetailPage };
export default TravelMapDetailPage;
