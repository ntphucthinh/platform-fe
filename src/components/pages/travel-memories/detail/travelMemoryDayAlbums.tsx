import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import type {
  ITravelMemoryDay,
  ITravelMemoryPhoto,
} from "@/types/pages/travel-memories/travelMemory";
import { formatDateVietnamese } from "@/utils/travelMemoryUtils";
import { TravelMemoryPhotoGrid } from "@/components/pages/travel-memories/travelMemoryPhotoGrid";

export interface TravelMemoryDayAlbumsProps {
  days: ITravelMemoryDay[];
  collapsedDays: Record<string, boolean>;
  onToggleDayCollapse: (date: string) => void;
  onToggleAllDays: () => void;
  allCollapsed: boolean;
  onPhotoClick: (
    dayNumber: number,
    formattedDate: string,
    photos: ITravelMemoryPhoto[],
    photoIdx: number,
  ) => void;
}

export const TravelMemoryDayAlbums: React.FC<TravelMemoryDayAlbumsProps> = ({
  days,
  collapsedDays,
  onToggleDayCollapse,
  onToggleAllDays,
  allCollapsed,
  onPhotoClick,
}) => {
  return (
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

        {days.length > 1 && (
          <Button
            size="small"
            variant="text"
            onClick={onToggleAllDays}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "primary.main",
              "&:hover": { bgcolor: "action.hover" },
              "&:focus-visible": {
                outline: "2px solid #1976D2",
                outlineOffset: 2,
              },
            }}
          >
            {allCollapsed ? "Mở rộng tất cả" : "Thu gọn tất cả"}
          </Button>
        )}
      </Box>

      {days.map((day, index) => {
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
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            {/* Day Header */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.8,
                bgcolor: "background.default",
                borderBottom: isCollapsed ? "none" : "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                userSelect: "none",
                transition: "background-color 0.15s",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                "&:focus-visible": {
                  outline: "2px solid #1976D2",
                  outlineOffset: -2,
                },
              }}
              role="button"
              tabIndex={0}
              aria-expanded={!isCollapsed}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onToggleDayCollapse(day.date);
                }
              }}
              onClick={() => onToggleDayCollapse(day.date)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "6px",
                    bgcolor: "primary.main",
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
                    onPhotoClick(
                      dayNumber,
                      formattedDate,
                      day.photos,
                      photoIdx,
                    );
                  }}
                  emptyMessage="Ngày này chưa có hình ảnh kỷ niệm."
                />
              </CardContent>
            </Collapse>
          </Card>
        );
      })}
    </Box>
  );
};
