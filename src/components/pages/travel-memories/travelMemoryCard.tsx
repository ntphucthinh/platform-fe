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
        borderRadius: { xs: "10px", sm: "14px" },
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
            top: { xs: 5, sm: 8 },
            right: { xs: 5, sm: 8 },
            bgcolor: "rgba(15, 23, 42, 0.75)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
            fontWeight: 600,
            fontSize: { xs: "0.62rem", sm: "0.7rem" },
            height: { xs: 18, sm: 22 },
            borderRadius: "4px",
            px: { xs: 0.25, sm: 0.5 },
            "& .MuiChip-label": {
              px: { xs: 0.6, sm: 0.8 },
            },
          }}
        />

        {/* Photo count badge */}
        <Chip
          icon={
            <PhotoCameraBackOutlinedIcon
              sx={{
                fontSize: { xs: "11px !important", sm: "13px !important" },
                color: "#FFFFFF !important",
              }}
            />
          }
          label={`${totalPhotos} ảnh`}
          size="small"
          sx={{
            position: "absolute",
            bottom: { xs: 5, sm: 8 },
            left: { xs: 5, sm: 8 },
            bgcolor: "rgba(30, 41, 59, 0.75)",
            color: "#FFFFFF",
            backdropFilter: "blur(4px)",
            fontWeight: 600,
            fontSize: { xs: "0.62rem", sm: "0.7rem" },
            height: { xs: 18, sm: 22 },
            borderRadius: "4px",
            px: { xs: 0.25, sm: 0.5 },
            "& .MuiChip-label": {
              px: { xs: 0.6, sm: 0.8 },
            },
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: { xs: 0.75, sm: 1 },
          p: { xs: 1.25, sm: 1.75 },
          "&:last-child": { pb: { xs: 1.25, sm: 1.75 } },
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "0.84rem", sm: "0.95rem" },
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, minWidth: 0 }}>
          <LocationOnOutlinedIcon
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: "primary.main",
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: { xs: "0.74rem", sm: "0.82rem" },
              minWidth: 0,
            }}
            noWrap
          >
            {memory.destination}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
          <CalendarMonthOutlinedIcon
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: "text.secondary",
              flexShrink: 0,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.72rem", sm: "0.8rem" },
            }}
            noWrap
          >
            {dateRangeLabel}
          </Typography>
        </Box>
      </CardContent>

      {/* Action Footer */}
      <CardActions
        sx={{
          px: { xs: 1, sm: 1.75 },
          py: { xs: 0.85, sm: 1.25 },
          borderTop: "1px solid",
          borderColor: "divider",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={
            <VisibilityOutlinedIcon
              sx={{
                fontSize: "14px !important",
                display: { xs: "none", sm: "inline-flex" },
              }}
            />
          }
          onClick={() => onView(memory.id)}
          sx={{
            flex: 1,
            minWidth: 0,
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "0.72rem", sm: "0.78rem" },
            px: { xs: 0.5, sm: 1.25 },
            height: { xs: 30, sm: 34 },
            whiteSpace: "nowrap",
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Xem
          </Box>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Xem chi tiết
          </Box>
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <Tooltip title="Chỉnh sửa chuyến đi">
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => onEdit(memory.id)}
              aria-label={`Chỉnh sửa ${memory.title}`}
              sx={{
                minWidth: { xs: 28, sm: 34 },
                width: { xs: 28, sm: 34 },
                height: { xs: 28, sm: 34 },
                p: 0,
                borderRadius: "6px",
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
              <EditOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
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
                minWidth: { xs: 28, sm: 34 },
                width: { xs: 28, sm: 34 },
                height: { xs: 28, sm: 34 },
                p: 0,
                borderRadius: "6px",
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
              <DeleteOutlinedIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </Button>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};
