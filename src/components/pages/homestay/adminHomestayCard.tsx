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
  Link,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { IHomestayItem } from "@/types/pages/homestay/homestay";
import { DEFAULT_NO_IMAGE, formatRoomPrice } from "@/constants/homestay";

export interface AdminHomestayCardProps {
  homestay: IHomestayItem;
  onView: (homestay: IHomestayItem) => void;
  onEdit: (homestay: IHomestayItem) => void;
  onDelete: (homestay: IHomestayItem) => void;
}

export const AdminHomestayCard: React.FC<AdminHomestayCardProps> = ({
  homestay,
  onView,
  onEdit,
  onDelete,
}) => {
  const coverImage =
    homestay.mainImage ||
    (homestay.images && homestay.images.length > 0
      ? homestay.images[0]
      : DEFAULT_NO_IMAGE);

  const mapUrl = (homestay.googleMapsUrl || homestay.googleMapLink || "").trim();
  const roomsCount = (homestay.rooms || []).length;

  const roomWithPrice = homestay.rooms?.find(
    (r) => r.priceAmount && r.priceAmount > 0,
  );
  const priceDisplay = roomWithPrice
    ? formatRoomPrice(roomWithPrice.priceAmount, roomWithPrice.priceUnit)
    : homestay.price;

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
      <Box sx={{ position: "relative", width: "100%", pt: "56.25%" /* 16:9 */ }}>
        <CardMedia
          component="img"
          loading="lazy"
          decoding="async"
          image={coverImage || DEFAULT_NO_IMAGE}
          alt={homestay.name}
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

        {/* Featured Tag */}
        {homestay.featured && (
          <Chip
            label="Nổi Bật"
            size="small"
            sx={{
              position: "absolute",
              top: { xs: 5, sm: 8 },
              left: { xs: 5, sm: 8 },
              bgcolor: "rgba(15, 23, 42, 0.85)",
              color: "#F8FAFC",
              backdropFilter: "blur(4px)",
              fontWeight: 700,
              fontSize: { xs: "0.62rem", sm: "0.7rem" },
              height: { xs: 18, sm: 22 },
              borderRadius: "4px",
            }}
          />
        )}

        {/* Google Maps Chip */}
        {mapUrl && (
          <Tooltip title="Xem Google Map">
            <Link
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              onClick={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                top: { xs: 5, sm: 8 },
                right: { xs: 5, sm: 8 },
                zIndex: 1,
              }}
            >
              <Chip
                label="Map"
                size="small"
                clickable
                sx={{
                  bgcolor: "rgba(5, 150, 105, 0.9)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(4px)",
                  fontWeight: 700,
                  fontSize: { xs: "0.62rem", sm: "0.7rem" },
                  height: { xs: 18, sm: 22 },
                  borderRadius: "4px",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#059669" },
                }}
              />
            </Link>
          </Tooltip>
        )}

        {/* Room count badge */}
        <Chip
          icon={
            <MeetingRoomOutlinedIcon
              sx={{
                fontSize: { xs: "11px !important", sm: "13px !important" },
                color: "#FFFFFF !important",
              }}
            />
          }
          label={`${roomsCount} phòng`}
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
          gap: { xs: 0.6, sm: 0.85 },
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
              onView(homestay);
            }
          }}
          onClick={() => onView(homestay)}
        >
          {homestay.name}
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
              color: "text.secondary",
              fontSize: { xs: "0.74rem", sm: "0.82rem" },
              minWidth: 0,
            }}
            noWrap
          >
            {homestay.address || homestay.location || "Chưa cập nhật địa chỉ"}
          </Typography>
        </Box>

        {priceDisplay ? (
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: "#059669",
              fontWeight: 600,
              fontSize: { xs: "0.72rem", sm: "0.8rem" },
            }}
          >
            {priceDisplay}
          </Typography>
        ) : homestay.description ? (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.7rem", sm: "0.78rem" },
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.4,
            }}
          >
            {homestay.description}
          </Typography>
        ) : null}
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
          onClick={() => onView(homestay)}
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
            Chi tiết
          </Box>
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Chi tiết homestay
          </Box>
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <Tooltip title="Chỉnh sửa homestay">
            <Button
              variant="outlined"
              size="small"
              onClick={() => onEdit(homestay)}
              aria-label={`Chỉnh sửa ${homestay.name}`}
              sx={{
                minWidth: { xs: 28, sm: 34 },
                width: { xs: 28, sm: 34 },
                height: { xs: 28, sm: 34 },
                p: 0,
                borderRadius: "6px",
                borderColor: "divider",
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "text.secondary",
                  color: "text.primary",
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

          <Tooltip title="Xóa homestay">
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(homestay)}
              aria-label={`Xóa ${homestay.name}`}
              sx={{
                minWidth: { xs: 28, sm: 34 },
                width: { xs: 28, sm: 34 },
                height: { xs: 28, sm: 34 },
                p: 0,
                borderRadius: "6px",
                borderColor: "#FECACA",
                color: "error.main",
                "&:hover": {
                  bgcolor: "#FEF2F2",
                  borderColor: "error.main",
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
