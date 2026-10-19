import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Portal,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AddIcon from "@mui/icons-material/Add";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import {
  countTotalPhotos,
  formatDateRangeVietnamese,
} from "@/utils/travelMemoryUtils";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

interface LocationDetailPanelProps {
  location: ILocationWithDetails | null;
  open: boolean;
  onClose: () => void;
  onEdit: (location: ILocationWithDetails) => void;
  onDelete: (id: string, name: string) => void;
  isMobile?: boolean;
}

export const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location: propLocation,
  open,
  onClose,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileQuery = useMediaQuery(theme.breakpoints.down("md"));
  const effectiveIsMobile = isMobile !== undefined ? isMobile : isMobileQuery;
  const prefersReducedMotion = useMediaQuery(
    "@media (prefers-reduced-motion: reduce)",
  );

  // Cached location to keep details rendered during exit animation
  const [prevPropLocation, setPrevPropLocation] = useState(propLocation);
  const [cachedLocation, setCachedLocation] = useState(propLocation);
  if (propLocation && propLocation !== prevPropLocation) {
    setPrevPropLocation(propLocation);
    setCachedLocation(propLocation);
  }
  const location = propLocation || cachedLocation;

  // Animation lifecycle state: "unmounted" | "entering" | "entered" | "exiting"
  const [animStatus, setAnimStatus] = useState<
    "unmounted" | "entering" | "entered" | "exiting"
  >(() => (open && propLocation ? "entered" : "unmounted"));

  // Adjust animation status during render when open prop changes
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && location) {
      setAnimStatus(prefersReducedMotion ? "entered" : "entering");
    } else if (!open && animStatus !== "unmounted") {
      setAnimStatus(prefersReducedMotion ? "unmounted" : "exiting");
    }
  }

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevPropLocationIdRef = useRef<string | null>(propLocation?.id || null);

  // Mobile Bottom Sheet DOM refs for direct transform updates (avoids re-rendering during drag)
  const mobileSheetRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const isDismissingViaDragRef = useRef(false);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafDragRef = useRef<number | null>(null);

  // Drag state tracking ref
  const dragStateRef = useRef<{
    isDragging: boolean;
    startY: number;
    currentY: number;
    lastY: number;
    lastTime: number;
    velocity: number;
    pointerId: number | null;
  }>({
    isDragging: false,
    startY: 0,
    currentY: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    pointerId: null,
  });

  // Drag Gesture Handlers for Mobile Grab Handle
  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!effectiveIsMobile || e.button !== 0) return;

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for browsers with restricted pointer capture
      }

      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
        snapTimerRef.current = null;
      }

      const now = performance.now();
      dragStateRef.current = {
        isDragging: true,
        startY: e.clientY,
        currentY: e.clientY,
        lastY: e.clientY,
        lastTime: now,
        velocity: 0,
        pointerId: e.pointerId,
      };

      // Disable transition during direct finger drag
      if (mobileSheetRef.current) {
        mobileSheetRef.current.style.transition = "none";
      }
      if (backdropRef.current) {
        backdropRef.current.style.transition = "none";
      }
    },
    [effectiveIsMobile],
  );

  const handleDragMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.isDragging) return;

    state.currentY = e.clientY;
    const now = performance.now();
    const dt = now - state.lastTime;
    if (dt > 10) {
      state.velocity = (e.clientY - state.lastY) / dt;
      state.lastY = e.clientY;
      state.lastTime = now;
    }

    const rawDeltaY = e.clientY - state.startY;
    // Clamping upward movement at 0 per requirement: "Kéo lên: không đóng popup; giữ sheet tại vị trí mở ban đầu"
    const deltaY = Math.max(0, rawDeltaY);

    if (rafDragRef.current) {
      cancelAnimationFrame(rafDragRef.current);
    }

    rafDragRef.current = requestAnimationFrame(() => {
      if (!mobileSheetRef.current) return;
      mobileSheetRef.current.style.transform = `translateY(${deltaY}px)`;

      if (backdropRef.current) {
        const sheetHeight =
          mobileSheetRef.current.offsetHeight || window.innerHeight;
        const progress = Math.min(1, deltaY / (sheetHeight * 0.6));
        backdropRef.current.style.opacity = String(
          Math.max(0, 1 - progress * 0.75),
        );
      }
    });
  }, []);

  const handleDragEnd = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current;
      if (!state.isDragging) return;

      state.isDragging = false;
      if (state.pointerId !== null) {
        try {
          e.currentTarget.releasePointerCapture(state.pointerId);
        } catch {
          // ignore
        }
        state.pointerId = null;
      }

      if (rafDragRef.current) {
        cancelAnimationFrame(rafDragRef.current);
        rafDragRef.current = null;
      }

      const totalDeltaY = Math.max(0, e.clientY - state.startY);
      const sheetHeight =
        mobileSheetRef.current?.offsetHeight || window.innerHeight * 0.92;

      // Threshold: 110px or 20% of sheet height
      const distanceThreshold = Math.min(130, sheetHeight * 0.2);
      // Fast swipe threshold: velocity > 0.45 px/ms and pulled down > 25px
      const isFastSwipe = state.velocity > 0.45 && totalDeltaY > 25;
      const shouldDismiss = totalDeltaY >= distanceThreshold || isFastSwipe;

      if (shouldDismiss) {
        isDismissingViaDragRef.current = true;
        // Animate smooth slide down to exit
        if (mobileSheetRef.current) {
          mobileSheetRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms cubic-bezier(0.22, 1, 0.36, 1)";
          mobileSheetRef.current.style.transform = "translateY(100%)";
          mobileSheetRef.current.style.opacity = "0";
        }
        if (backdropRef.current) {
          backdropRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "opacity 260ms ease";
          backdropRef.current.style.opacity = "0";
        }

        onClose();
      } else {
        // Revert smoothly back to open position
        if (mobileSheetRef.current) {
          mobileSheetRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)";
          mobileSheetRef.current.style.transform = "translateY(0)";
          mobileSheetRef.current.style.opacity = "1";
        }
        if (backdropRef.current) {
          backdropRef.current.style.transition = prefersReducedMotion
            ? "none"
            : "opacity 280ms ease";
          backdropRef.current.style.opacity = "1";
        }

        // Clean up inline styles once snapback transition finishes
        snapTimerRef.current = setTimeout(() => {
          if (mobileSheetRef.current && !dragStateRef.current.isDragging) {
            mobileSheetRef.current.style.transform = "";
            mobileSheetRef.current.style.transition = "";
            mobileSheetRef.current.style.opacity = "";
          }
          if (backdropRef.current && !dragStateRef.current.isDragging) {
            backdropRef.current.style.opacity = "";
            backdropRef.current.style.transition = "";
          }
        }, 280);
      }
    },
    [onClose, prefersReducedMotion],
  );

  // Clear drag inline styles when closed via external actions (X button, backdrop click, Escape key)
  useEffect(() => {
    if (!open) {
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
        snapTimerRef.current = null;
      }
      if (!isDismissingViaDragRef.current) {
        if (mobileSheetRef.current) {
          mobileSheetRef.current.style.transform = "";
          mobileSheetRef.current.style.transition = "";
          mobileSheetRef.current.style.opacity = "";
        }
        if (backdropRef.current) {
          backdropRef.current.style.opacity = "";
          backdropRef.current.style.transition = "";
        }
      }
    } else {
      isDismissingViaDragRef.current = false;
    }
  }, [open]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (rafDragRef.current) {
        cancelAnimationFrame(rafDragRef.current);
      }
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
      }
    };
  }, []);

  // Scroll to top when location changes while panel is already open
  useEffect(() => {
    if (propLocation?.id && prevPropLocationIdRef.current !== propLocation.id) {
      prevPropLocationIdRef.current = propLocation.id;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [propLocation?.id]);

  // Handle async lifecycle transitions (entering -> entered, exiting -> unmounted)
  useEffect(() => {
    if (animStatus === "entering") {
      let rafId2 = 0;
      const rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          setAnimStatus("entered");
        });
      });
      return () => {
        cancelAnimationFrame(rafId1);
        if (rafId2) cancelAnimationFrame(rafId2);
      };
    }

    if (animStatus === "exiting") {
      const exitDuration = effectiveIsMobile ? 360 : 320;
      const timer = setTimeout(() => {
        setAnimStatus("unmounted");
      }, exitDuration);
      return () => clearTimeout(timer);
    }
  }, [animStatus, effectiveIsMobile]);

  // Escape key listener for closing mobile bottom sheet
  useEffect(() => {
    if (!effectiveIsMobile || animStatus === "unmounted") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [effectiveIsMobile, animStatus, onClose]);

  if (animStatus === "unmounted" || !location) return null;

  const isEntered = animStatus === "entered";
  const isVisited = location.status === "Visited";

  const panelContent = (
    <Box
      key={location.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        animation: prefersReducedMotion
          ? "none"
          : "panelContentFadeIn 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        "@keyframes panelContentFadeIn": {
          "0%": {
            opacity: 0.5,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Top Header Image & Controls */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        {/* Grab Handle Touch Zone for mobile bottom sheet */}
        {effectiveIsMobile && (
          <Box
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            role="slider"
            aria-label="Kéo xuống để đóng"
            aria-valuemin={0}
            aria-valuemax={100}
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: { xs: 160, sm: 200 },
              height: 48,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              pt: "8px",
              zIndex: 15,
              touchAction: "none",
              cursor: "grab",
              userSelect: "none",
              WebkitUserSelect: "none",
              "&:active": {
                cursor: "grabbing",
              },
            }}
          >
            {/* Visual Grab Handle bar */}
            <Box
              sx={{
                width: 38,
                height: 4,
                borderRadius: "2px",
                bgcolor: "rgba(255, 255, 255, 0.85)",
                pointerEvents: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </Box>
        )}

        <CardMedia
          component="img"
          image={location.coverImage || DEFAULT_NO_IMAGE}
          alt={location.name}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = DEFAULT_NO_IMAGE;
          }}
          sx={{
            height: { xs: 160, sm: 200 },
            objectFit: "cover",
            width: "100%",
            display: "block",
          }}
        />

        {/* Gradient Overlay for controls */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            p: 1.5,
            pt: effectiveIsMobile ? 2 : 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)",
            zIndex: 5,
          }}
        >
          <Chip
            label={isVisited ? "Đã ghé thăm" : "Muốn đến"}
            size="small"
            sx={{
              bgcolor: isVisited ? "#059669" : "#D97706",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.75rem",
              borderRadius: "6px",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Chỉnh sửa">
              <IconButton
                size="small"
                onClick={() => onEdit(location)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "#0F172A",
                  "&:hover": { bgcolor: "#FFFFFF" },
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xóa địa điểm">
              <IconButton
                size="small"
                onClick={() => onDelete(location.id, location.name)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "#EF4444",
                  "&:hover": { bgcolor: "#FEE2E2" },
                }}
              >
                <DeleteOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Đóng">
              <IconButton
                size="small"
                onClick={onClose}
                sx={{
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "#0F172A",
                  "&:hover": { bgcolor: "#FFFFFF" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Content Body */}
      <Box
        ref={scrollContainerRef}
        sx={{
          p: { xs: 2, sm: 2.5 },
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          touchAction: "pan-y",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          pb: "calc(32px + env(safe-area-inset-bottom, 20px))",
        }}
      >
        {/* Title & Address */}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              fontSize: "1.35rem",
              mb: 0.75,
            }}
          >
            {location.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.75,
              color: "#64748B",
              fontSize: "0.875rem",
              mb: 1.5,
            }}
          >
            <LocationOnOutlinedIcon
              sx={{ fontSize: 18, color: "#94A3B8", mt: 0.25, flexShrink: 0 }}
            />
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {location.address}
            </Typography>
          </Box>

          {/* Coordinates & Google Maps Link */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.25,
              bgcolor: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontFamily: "monospace" }}
            >
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Typography>

            {location.googleMapsUrl && (
              <Button
                size="small"
                variant="text"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                href={location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  p: 0,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#1976D2",
                }}
              >
                Mở Google Maps
              </Button>
            )}
          </Box>

          {/* Button: Xem chi tiết địa điểm */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon fontSize="small" />}
            onClick={() => navigate(`/admin/travel-map/${location.id}`)}
            sx={{
              mt: 1.5,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.875rem",
              boxShadow: "none",
            }}
          >
            Xem chi tiết địa điểm
          </Button>
        </Box>

        {/* Overview 3 Metrics Box */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.5,
            p: 2,
            bgcolor: "#F8FAFC",
            borderRadius: "12px",
            border: "1px solid #E2E8F0",
            textAlign: "center",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#1976D2", lineHeight: 1.2 }}
            >
              {location.visitCount}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 500 }}
            >
              Lần ghé thăm
            </Typography>
          </Box>

          <Box sx={{ borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#059669", lineHeight: 1.2 }}
            >
              {location.totalPhotos}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 500 }}
            >
              Ảnh lưu giữ
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "#0F172A",
                lineHeight: 1.2,
                fontSize: "0.85rem",
              }}
            >
              {location.latestVisitDate
                ? dayjs(location.latestVisitDate).format("MM/YYYY")
                : "—"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748B", fontWeight: 500 }}
            >
              Gần đây nhất
            </Typography>
          </Box>
        </Box>

        {/* Description & Notes */}
        {(location.description || location.notes) && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {location.description && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}
                >
                  Giới thiệu
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", lineHeight: 1.6 }}
                >
                  {location.description}
                </Typography>
              </Box>
            )}

            {location.notes && (
              <Box
                sx={{
                  p: 1.75,
                  bgcolor: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.25,
                }}
              >
                <NotesOutlinedIcon
                  sx={{ fontSize: 18, color: "#D97706", mt: 0.25, flexShrink: 0 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: "#92400E",
                      display: "block",
                      mb: 0.25,
                    }}
                  >
                    Ghi chú cá nhân
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#78350F", fontSize: "0.85rem" }}>
                    {location.notes}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ my: 0.5 }} />

        {/* SECTION 11.3: LỊCH SỬ CÁC LẦN GHÉ THĂM (TRAVEL MEMORIES) */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#0F172A" }}
            >
              Kỷ niệm tại đây ({location.memories.length})
            </Typography>

            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 14 }} />}
              onClick={() => navigate("/admin/travel-memories/create")}
              sx={{
                fontSize: "0.75rem",
                textTransform: "none",
                fontWeight: 600,
                color: "#1976D2",
              }}
            >
              Thêm kỷ niệm
            </Button>
          </Box>

          {location.memories.length === 0 ? (
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                textAlign: "center",
                borderRadius: "10px",
                border: "1px dashed #CBD5E1",
                bgcolor: "#F8FAFC",
              }}
            >
              <FlightTakeoffRoundedIcon sx={{ fontSize: 32, color: "#94A3B8", mb: 1 }} />
              <Typography
                variant="body2"
                sx={{ color: "#64748B", fontWeight: 600, mb: 1 }}
              >
                Chưa có chuyến đi nào được lưu
              </Typography>
              <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mb: 1.5 }}>
                {isVisited
                  ? "Bạn đã ghé thăm nơi này nhưng chưa nhập kỷ niệm hoặc album ảnh."
                  : "Địa điểm này đang nằm trong danh sách muốn đến trong tương lai."}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => navigate("/admin/travel-memories/create")}
                sx={{
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Tạo kỷ niệm chuyến đi
              </Button>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {location.memories.map((mem) => {
                const photosCount = countTotalPhotos(mem.days);
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
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      bgcolor: "#FFFFFF",
                      display: "flex",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.15s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        borderColor: "#1976D2",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={mem.coverImage || DEFAULT_NO_IMAGE}
                      alt={mem.title}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = DEFAULT_NO_IMAGE;
                      }}
                      sx={{
                        width: 90,
                        minHeight: 85,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />

                    <CardContent
                      sx={{
                        p: 1.5,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        "&:last-child": { pb: 1.5 },
                      }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: "#0F172A",
                            fontSize: "0.9rem",
                            lineHeight: 1.3,
                            mb: 0.5,
                          }}
                        >
                          {mem.title}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "#64748B",
                            fontSize: "0.75rem",
                          }}
                        >
                          <CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} />
                          {dateText}
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "#1976D2",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          <PhotoCameraBackOutlinedIcon sx={{ fontSize: 14 }} />
                          {photosCount} ảnh
                        </Box>

                        <Typography
                          variant="caption"
                          sx={{
                            color: "#1976D2",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        >
                          Xem chi tiết →
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>

        {/* SECTION 11.5: LỊCH TRÌNH LIÊN QUAN (ITINERARIES) */}
        {location.itineraries.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#0F172A" }}
              >
                Lịch trình liên quan ({location.itineraries.length})
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {location.itineraries.map((it) => (
                <Card
                  key={it.id}
                  elevation={0}
                  onClick={() =>
                    navigate(`/admin/itineraries/${it.id}/preview`)
                  }
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    p: 1.5,
                    bgcolor: "#F8FAFC",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    "&:hover": {
                      borderColor: "#1976D2",
                      bgcolor: "#EFF6FF",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <MapOutlinedIcon sx={{ color: "#1976D2", fontSize: 20 }} />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#0F172A" }}
                      >
                        {it.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        {it.duration || `${it.durationDays} ngày`}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{ color: "#1976D2", fontWeight: 600 }}
                  >
                    Xem lịch trình →
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );

  if (effectiveIsMobile) {
    return (
      <Portal>
        {/* Backdrop */}
        <Box
          ref={backdropRef}
          onClick={onClose}
          aria-hidden="true"
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(2px)",
            zIndex: 1200,
            opacity: isEntered ? 1 : 0,
            transition: prefersReducedMotion
              ? "none"
              : "opacity 350ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: isEntered ? "auto" : "none",
          }}
        />

        {/* Bottom Sheet */}
        <Box
          ref={mobileSheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Chi tiết địa điểm ${location.name}`}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1201,
            height: "92dvh",
            maxHeight: "92dvh",
            "@supports not (height: 92dvh)": {
              height: "92vh",
              maxHeight: "92vh",
            },
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            overflow: "hidden",
            bgcolor: "#FFFFFF",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
            transform: isEntered ? "translateY(0)" : "translateY(40px)",
            opacity: isEntered ? 1 : 0,
            transition: prefersReducedMotion
              ? "none"
              : `transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
                 opacity 380ms cubic-bezier(0.22, 1, 0.36, 1)`,
            pointerEvents: isEntered ? "auto" : "none",
          }}
        >
          {panelContent}
        </Box>
      </Portal>
    );
  }

  // Desktop Side Panel
  return (
    <Box
      sx={{
        width: isEntered ? 400 : 0,
        marginLeft: (t) => (isEntered ? 0 : `-${t.spacing(2.5)}`),
        opacity: isEntered ? 1 : 0,
        transition: prefersReducedMotion
          ? "none"
          : `width 320ms cubic-bezier(0.22, 1, 0.36, 1),
             margin-left 320ms cubic-bezier(0.22, 1, 0.36, 1),
             opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
        overflow: "hidden",
        flexShrink: 0,
        height: "100%",
        pointerEvents: isEntered ? "auto" : "none",
      }}
    >
      <Box
        sx={{
          width: 400,
          height: "100%",
          flexShrink: 0,
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          transform: isEntered ? "translateX(0)" : "translateX(24px)",
          opacity: isEntered ? 1 : 0,
          transition: prefersReducedMotion
            ? "none"
            : `transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
               opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {panelContent}
      </Box>
    </Box>
  );
};
