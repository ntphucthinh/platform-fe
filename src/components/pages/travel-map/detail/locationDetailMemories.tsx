import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import {
  calculateCalendarDuration,
  countTotalPhotos,
  formatDateRangeVietnamese,
} from "@/utils/travelMemoryUtils";

export interface LocationDetailMemoriesProps {
  details: ILocationWithDetails;
  isVisited: boolean;
}

export const LocationDetailMemories: React.FC<LocationDetailMemoriesProps> = ({
  details,
  isVisited,
}) => {
  const navigate = useNavigate();

  return (
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
            Kỷ niệm tại điểm đến này ({details.memories.length})
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
            Danh sách các chuyến đi thực tế và hình ảnh kỷ niệm đã lưu trữ.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/travel-memories/create")}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          Thêm kỷ niệm mới
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
            const photoCount =
              typeof mem.photoCount === "number"
                ? mem.photoCount
                : countTotalPhotos(mem.days);
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
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/admin/travel-memories/${mem.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/admin/travel-memories/${mem.id}`);
                  }
                }}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    borderColor: "primary.main",
                  },
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
              >
                {/* Trip Cover Image */}
                <CardMedia
                  component="img"
                  loading="lazy"
                  decoding="async"
                  image={mem.coverImage || DEFAULT_NO_IMAGE}
                  alt={mem.title}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = DEFAULT_NO_IMAGE;
                    e.currentTarget.style.objectFit = "contain";
                    e.currentTarget.style.padding = "16px";
                    e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }}
                  sx={{
                    width: { xs: "100%", sm: 220, md: 260 },
                    height: { xs: 180, sm: "auto" },
                    minHeight: { sm: 160 },
                    objectFit:
                      !mem.coverImage || mem.coverImage === DEFAULT_NO_IMAGE
                        ? "contain"
                        : "cover",
                    p:
                      !mem.coverImage || mem.coverImage === DEFAULT_NO_IMAGE
                        ? 2.5
                        : 0,
                    bgcolor: "#F8FAFC",
                    boxSizing: "border-box",
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
  );
};
