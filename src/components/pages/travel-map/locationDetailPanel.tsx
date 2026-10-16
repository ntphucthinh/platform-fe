import React from "react";
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
  Drawer,
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
  location,
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

  if (!location) return null;

  const isVisited = location.status === "Visited";

  const panelContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        bgcolor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Top Header Image & Controls */}
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        {/* Grab Handle for mobile bottom sheet */}
        {effectiveIsMobile && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 38,
              height: 4,
              borderRadius: "2px",
              bgcolor: "rgba(255, 255, 255, 0.85)",
              zIndex: 10,
              pointerEvents: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          />
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
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
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
            },
          },
        }}
      >
        {panelContent}
      </Drawer>
    );
  }

  // Desktop Side Panel
  if (!open) return null;

  return (
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
        transition: "width 0.25s ease-in-out",
      }}
    >
      {panelContent}
    </Box>
  );
};
