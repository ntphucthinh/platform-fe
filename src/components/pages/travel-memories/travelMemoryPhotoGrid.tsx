import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import type { ITravelMemoryPhoto } from "@/types/pages/travel-memories/travelMemory";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface TravelMemoryPhotoGridProps {
  photos: ITravelMemoryPhoto[];
  selectedPhotoIds?: number[];
  onPhotoClick?: (index: number) => void;
  onRemovePhoto?: (photoId: number) => void;
  onToggleSelectPhoto?: (photoId: number) => void;
  readOnly?: boolean;
  emptyMessage?: string;
  isDragOver?: boolean;
}

export const TravelMemoryPhotoGrid: React.FC<TravelMemoryPhotoGridProps> = ({
  photos,
  selectedPhotoIds = [],
  onPhotoClick,
  onRemovePhoto,
  onToggleSelectPhoto,
  readOnly = false,
  emptyMessage = "Chưa có hình ảnh nào cho ngày này.",
  isDragOver = false,
}) => {
  if (photos.length === 0) {
    if (isDragOver) {
      return (
        <Box
          sx={{
            py: 3.5,
            px: 2,
            border: "2px dashed #2563EB",
            borderRadius: "10px",
            bgcolor: "#EFF6FF",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            transition: "all 0.2s ease-in-out",
          }}
        >
          <AddPhotoAlternateOutlinedIcon
            sx={{ color: "#2563EB", fontSize: 32 }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#2563EB", fontWeight: 600 }}
          >
            Thả ảnh vào đây
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          py: 3,
          px: 2,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: "8px",
          bgcolor: "background.default",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <CollectionsOutlinedIcon
          sx={{ color: "text.secondary", fontSize: 28 }}
        />
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      {isDragOver && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            borderRadius: "8px",
            border: "2px dashed",
            borderColor: "primary.main",
            bgcolor: "rgba(239, 246, 255, 0.92)",
            backdropFilter: "blur(2px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pointerEvents: "none",
          }}
        >
          <AddPhotoAlternateOutlinedIcon
            sx={{ color: "primary.main", fontSize: 32 }}
          />
          <Typography
            variant="body2"
            sx={{ color: "primary.main", fontWeight: 600 }}
          >
            Thả ảnh vào đây
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: !readOnly && onRemovePhoto ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            sm: "repeat(4, 1fr)",
            md: "repeat(5, 1fr)",
            lg: "repeat(6, 1fr)",
          },
          gap: 1.5,
        }}
      >
        {photos.map((photo, index) => {
          const isSelected = selectedPhotoIds.includes(photo.id);
          return (
            <Box
              key={photo.id}
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "100%", // 1:1 Aspect ratio
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: "action.hover",
                border: isSelected ? "2px solid #2563EB" : "1px solid",
                borderColor: isSelected ? "#2563EB" : "divider",
                cursor: onPhotoClick ? "pointer" : "default",
                transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
                boxShadow: isSelected
                  ? "0 0 0 2px rgba(37, 99, 235, 0.25)"
                  : "none",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: isSelected
                    ? "0 4px 14px rgba(37, 99, 235, 0.3)"
                    : "0 4px 12px rgba(0, 0, 0, 0.08)",
                  "& .photo-overlay": {
                    opacity: 1,
                  },
                },
                "&:focus-visible": {
                  outline: "2px solid #1976D2",
                  outlineOffset: 2,
                },
              }}
              tabIndex={onPhotoClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onPhotoClick && (e.key === "Enter" || e.key === " ")) {
                  onPhotoClick(index);
                }
              }}
              onClick={() => onPhotoClick?.(index)}
            >
            {/* Image */}
            <Box
              component="img"
              loading="lazy"
              decoding="async"
              src={photo.imageUrl || DEFAULT_NO_IMAGE}
              alt={photo.altText || photo.caption || `Ảnh ${index + 1}`}
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

            {/* Hover Overlay */}
            <Box
              className="photo-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "rgba(15, 23, 42, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s ease",
              }}
            >
              {onPhotoClick && (
                <ZoomInRoundedIcon sx={{ color: "#FFFFFF", fontSize: 26 }} />
              )}
            </Box>

            {/* Multi-select toggle button if not read-only */}
            {!readOnly && onToggleSelectPhoto && (
              <Tooltip title={isSelected ? "Bỏ chọn ảnh này" : "Chọn ảnh này"}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelectPhoto(photo.id);
                  }}
                  aria-label={
                    isSelected
                      ? `Bỏ chọn ảnh ${index + 1}`
                      : `Chọn ảnh ${index + 1}`
                  }
                  sx={{
                    position: "absolute",
                    top: 5,
                    left: 5,
                    bgcolor: isSelected
                      ? "primary.main"
                      : "rgba(15, 23, 42, 0.55)",
                    color: "#FFFFFF",
                    width: { xs: 36, sm: 28 },
                    height: { xs: 36, sm: 28 },
                    p: 0,
                    "&:hover": {
                      bgcolor: isSelected
                        ? "primary.dark"
                        : "rgba(15, 23, 42, 0.8)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #FFFFFF",
                      outlineOffset: 1,
                    },
                    boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                    zIndex: 2,
                  }}
                >
                  {isSelected ? (
                    <CheckRoundedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid rgba(255, 255, 255, 0.85)",
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {/* Remove button if not read-only */}
            {!readOnly && onRemovePhoto && (
              <Tooltip title="Xóa hình ảnh này">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePhoto(photo.id);
                  }}
                  aria-label={`Xóa ảnh ${index + 1}`}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    bgcolor: "rgba(220, 38, 38, 0.9)",
                    color: "#FFFFFF",
                    width: { xs: 36, sm: 32 },
                    height: { xs: 36, sm: 32 },
                    p: 0,
                    "&:hover": {
                      bgcolor: "error.main",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #FFFFFF",
                      outlineOffset: 1,
                    },
                    boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                    zIndex: 2,
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}

            {/* Bottom small caption if present */}
            {photo.caption && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 0.5,
                  bgcolor: "rgba(15, 23, 42, 0.7)",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {photo.caption}
              </Box>
            )}
          </Box>
        );
      })}
      </Box>
    </Box>
  );
};
