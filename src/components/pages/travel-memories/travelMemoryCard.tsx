import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import {
  calculateCalendarDuration,
  countTotalPhotos,
  formatDateRangeVietnamese,
} from "@/utils/travelMemoryUtils";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface TravelMemoryCardProps {
  memory: ITravelMemory;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (memory: ITravelMemory) => void;
}

export const TravelMemoryCard: React.FC<TravelMemoryCardProps> = ({
  memory,
  onView,
  onEdit,
  onDelete,
}) => {
  const duration = calculateCalendarDuration(
    memory.startDate,
    memory.endDate,
  ).label;
  const totalPhotos = countTotalPhotos(memory.days);
  const dateRangeLabel = formatDateRangeVietnamese(
    memory.startDate,
    memory.endDate,
  );

  return (
    <Card
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      {/* Cover Image with Badges */}
      <Box
        sx={{ position: "relative", width: "100%", pt: "56.25%" /* 16:9 */ }}
      >
        <CardMedia
          component="img"
          loading="lazy"
          decoding="async"
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
            bgcolor: "#F1F5F9",
          }}
        />

        {/* Duration badge */}
        <Chip
          label={duration}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "rgba(15, 23, 42, 0.8)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
            fontWeight: 700,
            fontSize: "0.75rem",
            borderRadius: "4px",
          }}
        />

        {/* Photo count badge */}
        <Chip
          icon={
            <PhotoCameraBackOutlinedIcon
              sx={{ fontSize: "14px !important", color: "#FFFFFF !important" }}
            />
          }
          label={`${totalPhotos} ảnh`}
          size="small"
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            bgcolor: "rgba(30, 41, 59, 0.8)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
            fontWeight: 600,
            fontSize: "0.75rem",
            borderRadius: "4px",
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1.75,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "text.primary",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            wordBreak: "break-word",
            cursor: "pointer",
            "&:hover": { color: "primary.main" },
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
              borderRadius: "4px",
            },
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onView(memory.id);
            }
          }}
          onClick={() => onView(memory.id)}
        >
          {memory.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, minWidth: 0 }}>
          <LocationOnOutlinedIcon
            sx={{ fontSize: 16, color: "primary.main", flexShrink: 0 }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "0.82rem",
              minWidth: 0,
            }}
            noWrap
          >
            {memory.destination}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <CalendarMonthOutlinedIcon
            sx={{ fontSize: 16, color: "text.secondary" }}
          />
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.8rem" }}
          >
            {dateRangeLabel}
          </Typography>
        </Box>

        {memory.description && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              lineHeight: 1.45,
              mt: 0.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {memory.description}
          </Typography>
        )}
      </CardContent>

      {/* Action Footer */}
      <CardActions
        sx={{
          px: 1.75,
          py: 1.25,
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={
            <VisibilityOutlinedIcon sx={{ fontSize: "16px !important" }} />
          }
          onClick={() => onView(memory.id)}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.78rem",
            px: 1.25,
            height: 34,
            whiteSpace: "nowrap",
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Xem chi tiết
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Tooltip title="Chỉnh sửa chuyến đi">
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => onEdit(memory.id)}
              aria-label={`Chỉnh sửa ${memory.title}`}
              sx={{
                minWidth: { xs: 36, sm: 34 },
                width: { xs: 36, sm: 34 },
                height: { xs: 36, sm: 34 },
                p: 0,
                borderRadius: "8px",
                borderColor: "divider",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  bgcolor: "#EFF6FF",
                },
                "&:focus-visible": {
                  outline: "2px solid #1976D2",
                  outlineOffset: 2,
                },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 16 }} />
            </Button>
          </Tooltip>

          <Tooltip title="Xóa chuyến đi">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(memory)}
              aria-label={`Xóa ${memory.title}`}
              sx={{
                minWidth: { xs: 36, sm: 34 },
                width: { xs: 36, sm: 34 },
                height: { xs: 36, sm: 34 },
                p: 0,
                borderRadius: "8px",
                borderColor: "#FECACA",
                color: "error.main",
                "&:hover": {
                  borderColor: "error.main",
                  bgcolor: "#FEF2F2",
                },
                "&:focus-visible": {
                  outline: "2px solid #DC2626",
                  outlineOffset: 2,
                },
              }}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
            </Button>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};
