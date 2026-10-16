import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AddHomeWorkOutlinedIcon from "@mui/icons-material/AddHomeWorkOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import {
  getItineraryListItems,
  subscribeItineraries,
} from "@/services/itineraryService";
import {
  getTravelMemories,
  subscribeTravelMemories,
} from "@/services/travelMemoryService";
import { getHomestays } from "@/services/homestayService";
import type { IHomestayItem } from "@/types/pages/homestay/homestay";
import type { IItineraryListItem } from "@/types/pages/itineraries/itinerary";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import {
  countTotalPhotos,
  formatDateRangeVietnamese,
  calculateCalendarDuration,
} from "@/utils/travelMemoryUtils";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

interface RecentlyUpdatedItem {
  id: string;
  title: string;
  type: "homestay" | "itinerary" | "memory";
  typeLabel: string;
  typeColor: "primary" | "success" | "secondary";
  dateDisplay: string;
  rawDate: number;
  targetUrl: string;
}

export function DashboardPage() {
  const navigate = useNavigate();

  // 1. Data States
  const [homestays, setHomestays] = useState<IHomestayItem[]>([]);
  const [itineraries, setItineraries] = useState<IItineraryListItem[]>(
    getItineraryListItems(),
  );
  const [memories, setMemories] = useState<ITravelMemory[]>(getTravelMemories());

  // 2. Fetch Homestays and Subscribe to real-time updates for Itineraries and Memories
  useEffect(() => {
    let active = true;
    getHomestays().then(({ data }) => {
      if (active && data) {
        setHomestays(data);
      }
    });

    const unsubscribeItineraries = subscribeItineraries(() => {
      setItineraries(getItineraryListItems());
    });

    const unsubscribeMemories = subscribeTravelMemories(() => {
      setMemories(getTravelMemories());
    });

    return () => {
      active = false;
      unsubscribeItineraries();
      unsubscribeMemories();
    };
  }, []);

  // 3. Derived Metrics
  const totalPhotosCount = useMemo(() => {
    return memories.reduce((acc, memory) => acc + countTotalPhotos(memory.days), 0);
  }, [memories]);

  // 4. Latest 3-4 Travel Memories (sorted by startDate or updatedAt descending)
  const recentMemories = useMemo(() => {
    return [...memories]
      .sort((a, b) => {
        const dateA = a.startDate || a.createdAt || "";
        const dateB = b.startDate || b.createdAt || "";
        return dateB.localeCompare(dateA);
      })
      .slice(0, 3);
  }, [memories]);

  // 5. Recently Updated Content
  const recentlyUpdatedItems = useMemo<RecentlyUpdatedItem[]>(() => {
    const items: RecentlyUpdatedItem[] = [];

    // Memories
    memories.forEach((mem) => {
      const timeStr = mem.updatedAt || mem.createdAt || mem.startDate;
      if (timeStr) {
        const parsed = dayjs(timeStr);
        items.push({
          id: `mem-${mem.id}`,
          title: mem.title,
          type: "memory",
          typeLabel: "Kỷ niệm",
          typeColor: "secondary",
          dateDisplay: parsed.isValid() ? parsed.format("DD/MM/YYYY") : timeStr,
          rawDate: parsed.isValid() ? parsed.valueOf() : 0,
          targetUrl: `/admin/travel-memories/${mem.id}`,
        });
      }
    });

    // Itineraries
    itineraries.forEach((it) => {
      const timeStr = it.updatedAt;
      if (timeStr) {
        const parsed = dayjs(timeStr, ["DD/MM/YYYY", "YYYY-MM-DD", "YYYY-MM-DDTHH:mm:ss.SSSZ"]);
        items.push({
          id: `it-${it.id}`,
          title: it.title,
          type: "itinerary",
          typeLabel: "Lịch trình",
          typeColor: "success",
          dateDisplay: parsed.isValid() ? parsed.format("DD/MM/YYYY") : timeStr,
          rawDate: parsed.isValid() ? parsed.valueOf() : 0,
          targetUrl: `/admin/itineraries/${it.id}/preview`,
        });
      }
    });

    // Homestays
    homestays.forEach((hs) => {
      const timeStr = hs.updatedAt || hs.createdAt;
      if (timeStr) {
        const parsed = dayjs(timeStr);
        items.push({
          id: `hs-${hs.id}`,
          title: hs.name,
          type: "homestay",
          typeLabel: "Homestay",
          typeColor: "primary",
          dateDisplay: parsed.isValid() ? parsed.format("DD/MM/YYYY") : timeStr,
          rawDate: parsed.isValid() ? parsed.valueOf() : 0,
          targetUrl: `/admin/homestay`,
        });
      }
    });

    return items.sort((a, b) => b.rawDate - a.rawDate).slice(0, 5);
  }, [memories, itineraries, homestays]);

  // Summary statistics cards definition
  const summaryCards = [
    {
      title: "Homestays",
      value: homestays.length,
      subtitle: "Chỗ nghỉ đang quản lý",
      icon: <HomeWorkOutlinedIcon sx={{ fontSize: 28, color: "#0284C7" }} />,
      iconBg: "#E0F2FE",
      actionUrl: "/admin/homestay",
    },
    {
      title: "Lịch trình",
      value: itineraries.length,
      subtitle: "Kế hoạch du lịch đã lập",
      icon: <ExploreOutlinedIcon sx={{ fontSize: 28, color: "#16A34A" }} />,
      iconBg: "#DCFCE7",
      actionUrl: "/admin/itineraries",
    },
    {
      title: "Kỷ niệm chuyến đi",
      value: memories.length,
      subtitle: "Hành trình đã lưu lại",
      icon: <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 28, color: "#9333EA" }} />,
      iconBg: "#F3E8FF",
      actionUrl: "/admin/travel-memories",
    },
    {
      title: "Ảnh kỷ niệm",
      value: totalPhotosCount,
      subtitle: "Khoảnh khắc được lưu giữ",
      icon: <PhotoLibraryOutlinedIcon sx={{ fontSize: 28, color: "#EA580C" }} />,
      iconBg: "#FFEDD5",
      actionUrl: "/admin/travel-memories",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, pb: 6 }}>
      <HeaderTitle>Dashboard</HeaderTitle>

      {/* SECTION A: Welcome Header */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          p: { xs: 2.5, sm: 3.5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2.5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
              mb: 0.75,
              letterSpacing: "-0.02em",
            }}
          >
            Chào mừng trở lại!
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#64748B", fontSize: { xs: "0.95rem", sm: "1rem" } }}
          >
            Cùng lưu giữ những hành trình và khoảnh khắc đáng nhớ.
          </Typography>
        </Box>

        {/* Quick Action Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<AddHomeWorkOutlinedIcon />}
            onClick={() => navigate("/admin/homestay", { state: { openCreate: true } })}
            sx={{
              borderRadius: "8px",
              borderColor: "#CBD5E1",
              color: "#334155",
              fontWeight: 600,
              textTransform: "none",
              px: 2,
              height: 40,
              "&:hover": {
                bgcolor: "#F8FAFC",
                borderColor: "#94A3B8",
              },
            }}
          >
            Thêm Homestay
          </Button>

          <Button
            variant="outlined"
            startIcon={<MapOutlinedIcon />}
            onClick={() => navigate("/admin/itineraries/create")}
            sx={{
              borderRadius: "8px",
              borderColor: "#CBD5E1",
              color: "#334155",
              fontWeight: 600,
              textTransform: "none",
              px: 2,
              height: 40,
              "&:hover": {
                bgcolor: "#F8FAFC",
                borderColor: "#94A3B8",
              },
            }}
          >
            Tạo lịch trình
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            onClick={() => navigate("/admin/travel-memories/create")}
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              px: 2.25,
              height: 40,
              boxShadow: "none",
            }}
          >
            Thêm kỷ niệm
          </Button>
        </Box>
      </Box>

      {/* SECTION B: Content Overview (Four Summary Cards) */}
      <Grid container spacing={2.5}>
        {summaryCards.map((card, idx) => (
          <Grid key={idx} sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
            <Card
              elevation={0}
              onClick={() => navigate(card.actionUrl)}
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                p: 2.5,
                height: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px -2px rgba(0, 0, 0, 0.06)",
                  borderColor: "#CBD5E1",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#64748B", fontSize: "0.9rem" }}
                >
                  {card.title}
                </Typography>
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: "10px",
                    bgcolor: card.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  mb: 0.5,
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                }}
              >
                {card.value.toLocaleString("vi-VN")}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#94A3B8", fontSize: "0.85rem" }}
              >
                {card.subtitle}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* SECTION C: Quick Access Strip */}
      <Box
        sx={{
          bgcolor: "#F8FAFC",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          p: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            color: "#64748B",
            letterSpacing: "0.06em",
            display: "block",
            mb: 1.5,
            px: 0.5,
          }}
        >
          Truy cập nhanh
        </Typography>

        <Grid container spacing={1.5}>
          <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
            <Button
              fullWidth
              variant="text"
              startIcon={<AddHomeWorkOutlinedIcon sx={{ color: "#0284C7" }} />}
              onClick={() => navigate("/admin/homestay", { state: { openCreate: true } })}
              sx={{
                justifyContent: "flex-start",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                p: 1.5,
                color: "#1E293B",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#FFFFFF",
                  borderColor: "#0284C7",
                  boxShadow: "0 2px 8px rgba(2, 132, 199, 0.08)",
                },
              }}
            >
              1. Thêm Homestay
            </Button>
          </Grid>

          <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
            <Button
              fullWidth
              variant="text"
              startIcon={<ExploreOutlinedIcon sx={{ color: "#16A34A" }} />}
              onClick={() => navigate("/admin/itineraries/create")}
              sx={{
                justifyContent: "flex-start",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                p: 1.5,
                color: "#1E293B",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#FFFFFF",
                  borderColor: "#16A34A",
                  boxShadow: "0 2px 8px rgba(22, 163, 74, 0.08)",
                },
              }}
            >
              2. Tạo lịch trình
            </Button>
          </Grid>

          <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
            <Button
              fullWidth
              variant="text"
              startIcon={<AddIcon sx={{ color: "#9333EA" }} />}
              onClick={() => navigate("/admin/travel-memories/create")}
              sx={{
                justifyContent: "flex-start",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                p: 1.5,
                color: "#1E293B",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#FFFFFF",
                  borderColor: "#9333EA",
                  boxShadow: "0 2px 8px rgba(147, 51, 234, 0.08)",
                },
              }}
            >
              3. Thêm kỷ niệm
            </Button>
          </Grid>

          <Grid sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
            <Button
              fullWidth
              variant="text"
              startIcon={<CollectionsBookmarkOutlinedIcon sx={{ color: "#2563EB" }} />}
              onClick={() => navigate("/admin/travel-memories")}
              sx={{
                justifyContent: "flex-start",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                p: 1.5,
                color: "#1E293B",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#FFFFFF",
                  borderColor: "#2563EB",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.08)",
                },
              }}
            >
              4. Xem tất cả kỷ niệm
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* SECTION D: Recent Travel Memories */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
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
              Kỷ niệm gần đây
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", mt: 0.25 }}
            >
              Những chuyến đi đã lưu lại trong thời gian gần đây.
            </Typography>
          </Box>

          <Button
            variant="text"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            onClick={() => navigate("/admin/travel-memories")}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              color: "primary.main",
              p: 0,
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            Xem tất cả
          </Button>
        </Box>

        {recentMemories.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              bgcolor: "#FFFFFF",
              borderRadius: "14px",
              border: "1px dashed #CBD5E1",
              p: 5,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#F1F5F9",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CollectionsBookmarkOutlinedIcon fontSize="medium" />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1E293B", mb: 0.5 }}
            >
              Chưa có kỷ niệm chuyến đi nào
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", maxWidth: 440, mx: "auto", mb: 2.5 }}
            >
              Hãy tạo kỷ niệm đầu tiên để lưu lại hình ảnh và khoảnh khắc đáng nhớ cùng gia đình.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/travel-memories/create")}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
            >
              Tạo kỷ niệm đầu tiên
            </Button>
          </Card>
        ) : (
          <Grid container spacing={2.5}>
            {recentMemories.map((memory) => {
              const photoCount = countTotalPhotos(memory.days);
              const durationLabel = calculateCalendarDuration(
                memory.startDate,
                memory.endDate,
              ).label;
              const dateRange = formatDateRangeVietnamese(
                memory.startDate,
                memory.endDate,
              );

              return (
                <Grid
                  key={memory.id}
                  sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" } }}
                >
                  <Card
                    elevation={0}
                    onClick={() => navigate(`/admin/travel-memories/${memory.id}`)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid #E2E8F0",
                      bgcolor: "#FFFFFF",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
                        borderColor: "#CBD5E1",
                      },
                    }}
                  >
                    {/* Cover Image & Badges */}
                    <Box sx={{ position: "relative", width: "100%", pt: "56.25%" }}>
                      <CardMedia
                        component="img"
                        image={memory.coverImage || DEFAULT_NO_IMAGE}
                        alt={memory.title}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = DEFAULT_NO_IMAGE;
                        }}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <Chip
                          icon={
                            <PhotoCameraBackOutlinedIcon
                              sx={{ fontSize: "0.95rem !important", color: "#FFFFFF !important" }}
                            />
                          }
                          label={`${photoCount} ảnh`}
                          size="small"
                          sx={{
                            bgcolor: "rgba(15, 23, 42, 0.72)",
                            backdropFilter: "blur(4px)",
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            borderRadius: "6px",
                            height: 24,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 2.25, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#0F172A",
                          fontSize: "1.05rem",
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {memory.title}
                      </Typography>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <LocationOnOutlinedIcon sx={{ fontSize: 16, color: "#64748B", flexShrink: 0 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#475569",
                              fontSize: "0.85rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {memory.destination}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: "#64748B", flexShrink: 0 }} />
                          <Typography
                            variant="body2"
                            sx={{ color: "#64748B", fontSize: "0.825rem" }}
                          >
                            {dateRange || "Chưa đặt ngày"} {durationLabel ? `• ${durationLabel}` : ""}
                          </Typography>
                        </Box>
                      </Box>

                      {memory.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            fontSize: "0.825rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: 2,
                            flexGrow: 1,
                          }}
                        >
                          {memory.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          pt: 1.25,
                          borderTop: "1px solid #F1F5F9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: "auto",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "primary.main", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}
                        >
                          Xem chi tiết <ArrowForwardIcon sx={{ fontSize: 14 }} />
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* SECTION E: Recently Updated Content */}
      {recentlyUpdatedItems.length > 0 && (
        <Card
          elevation={0}
          sx={{
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            p: { xs: 2.25, sm: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                }}
              >
                Cập nhật gần đây
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
                Các mục homestay, lịch trình và kỷ niệm được chỉnh sửa gần nhất.
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {recentlyUpdatedItems.map((item, index) => (
              <Box
                key={item.id}
                onClick={() => navigate(item.targetUrl)}
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 2 },
                  py: 1.5,
                  px: 1.5,
                  borderRadius: "8px",
                  cursor: "pointer",
                  borderBottom:
                    index < recentlyUpdatedItems.length - 1
                      ? "1px solid #F1F5F9"
                      : "none",
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: "#F8FAFC",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    overflow: "hidden",
                  }}
                >
                  <Chip
                    label={item.typeLabel}
                    color={item.typeColor}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexShrink: 0,
                    alignSelf: { xs: "flex-end", sm: "center" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#94A3B8",
                      fontSize: "0.8rem",
                    }}
                  >
                    <AccessTimeOutlinedIcon sx={{ fontSize: 15 }} />
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      {item.dateDisplay}
                    </Typography>
                  </Box>

                  <Tooltip title="Mở trang xem">
                    <Button
                      size="small"
                      variant="text"
                      sx={{
                        minWidth: 32,
                        p: 0.5,
                        color: "#64748B",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      )}
    </Box>
  );
}

export { DashboardPage as AdminDashboardPage };
export default DashboardPage;
