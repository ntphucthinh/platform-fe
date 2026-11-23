import React from "react";
import {
  Box,
  CardMedia,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate } from "react-router-dom";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import { LocationStatus } from "@/constants/travelMap";

export interface LocationPanelHeroProps {
  location: ILocationWithDetails;
  effectiveIsMobile: boolean;
  variant?: "side" | "inline";
  onClose: () => void;
  onEdit: (location: ILocationWithDetails) => void;
  onDelete: (id: number, name: string) => void;
  handleDragStart: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleDragMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleDragEnd: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const LocationPanelHero: React.FC<LocationPanelHeroProps> = ({
  location,
  effectiveIsMobile,
  variant,
  onClose,
  onEdit,
  onDelete,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
}) => {
  const navigate = useNavigate();
  const isVisited = location.status === LocationStatus.Visited;

  return (
    <Box sx={{ position: "relative", flexShrink: 0 }}>
      {/* Grab Handle Touch Zone for mobile bottom sheet */}
      {effectiveIsMobile ? (
        <Box
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          onLostPointerCapture={handleDragEnd}
          role="slider"
          aria-label="Kéo xuống để đóng"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={100}
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
      ) : variant === "inline" ? (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 44,
            height: 4,
            borderRadius: "2px",
            bgcolor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            zIndex: 6,
            pointerEvents: "none",
          }}
        />
      ) : null}

      <CardMedia
        component="img"
        image={location.coverImage || DEFAULT_NO_IMAGE}
        alt={location.locationName || location.name}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = DEFAULT_NO_IMAGE;
          e.currentTarget.style.objectFit = "contain";
          e.currentTarget.style.padding = "24px";
          e.currentTarget.style.backgroundColor = "#0F172A";
          e.currentTarget.style.opacity = "0.75";
        }}
        sx={{
          height:
            !location.coverImage || location.coverImage === DEFAULT_NO_IMAGE
              ? { xs: 130, sm: 150 }
              : { xs: 160, sm: 200 },
          objectFit:
            !location.coverImage || location.coverImage === DEFAULT_NO_IMAGE
              ? "contain"
              : "cover",
          width: "100%",
          display: "block",
          p:
            !location.coverImage || location.coverImage === DEFAULT_NO_IMAGE
              ? { xs: 2, sm: 3 }
              : 0,
          bgcolor:
            !location.coverImage || location.coverImage === DEFAULT_NO_IMAGE
              ? "#0F172A"
              : "transparent",
          boxSizing: "border-box",
          opacity:
            !location.coverImage || location.coverImage === DEFAULT_NO_IMAGE
              ? 0.75
              : 1,
          transition: "all 0.2s ease",
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Tooltip title="Xem trang đầy đủ">
            <IconButton
              size="small"
              aria-label="Xem trang đầy đủ"
              onClick={() => navigate(`/admin/travel-map/${location.id}`)}
              sx={{
                width: { xs: 36, sm: 32 },
                height: { xs: 36, sm: 32 },
                bgcolor: "rgba(255,255,255,0.9)",
                color: "text.primary",
                "&:hover": {
                  bgcolor: "background.paper",
                  color: "primary.main",
                },
              }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <IconButton
              size="small"
              aria-label="Chỉnh sửa địa điểm"
              onClick={() => onEdit(location)}
              sx={{
                width: { xs: 36, sm: 32 },
                height: { xs: 36, sm: 32 },
                bgcolor: "rgba(255,255,255,0.9)",
                color: "text.primary",
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Xóa địa điểm">
            <IconButton
              size="small"
              aria-label="Xóa địa điểm"
              onClick={() =>
                onDelete(
                  location.id,
                  location.locationName || location.name || "",
                )
              }
              sx={{
                width: { xs: 36, sm: 32 },
                height: { xs: 36, sm: 32 },
                bgcolor: "rgba(255,255,255,0.9)",
                color: "error.main",
                "&:hover": { bgcolor: "#FEE2E2" },
              }}
            >
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Đóng">
            <IconButton
              size="small"
              aria-label="Đóng bảng chi tiết"
              onClick={onClose}
              sx={{
                width: { xs: 36, sm: 32 },
                height: { xs: 36, sm: 32 },
                bgcolor: "rgba(255,255,255,0.9)",
                color: "text.primary",
                "&:hover": { bgcolor: "background.paper" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
