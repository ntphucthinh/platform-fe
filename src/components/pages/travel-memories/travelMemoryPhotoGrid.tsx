import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import type { ITravelMemoryPhoto } from "@/types/pages/travel-memories/travelMemory";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

export interface TravelMemoryPhotoGridProps {
  photos: ITravelMemoryPhoto[];
  onPhotoClick?: (index: number) => void;
  onRemovePhoto?: (photoId: string) => void;
  readOnly?: boolean;
  emptyMessage?: string;
}

export const TravelMemoryPhotoGrid: React.FC<TravelMemoryPhotoGridProps> = ({
  photos,
  onPhotoClick,
  onRemovePhoto,
  readOnly = false,
  emptyMessage = "Chưa có hình ảnh nào cho ngày này.",
}) => {
  if (photos.length === 0) {
    return (
      <Box
        sx={{
          py: 3,
          px: 2,
          border: "1px dashed #CBD5E1",
          borderRadius: "10px",
          bgcolor: "#F8FAFC",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <CollectionsOutlinedIcon sx={{ color: "#94A3B8", fontSize: 28 }} />
        <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(3, 1fr)",
          sm: "repeat(4, 1fr)",
          md: "repeat(5, 1fr)",
          lg: "repeat(6, 1fr)",
        },
        gap: 1.5,
      }}
    >
      {photos.map((photo, index) => (
        <Box
          key={photo.id}
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "100%", // 1:1 Aspect ratio
            borderRadius: "10px",
            overflow: "hidden",
            bgcolor: "#F1F5F9",
            border: "1px solid #E2E8F0",
            cursor: onPhotoClick ? "pointer" : "default",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              "& .photo-overlay": {
                opacity: 1,
              },
            },
          }}
          onClick={() => onPhotoClick?.(index)}
        >
          {/* Image */}
          <Box
            component="img"
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
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(239, 68, 68, 0.9)",
                  color: "#FFFFFF",
                  width: 26,
                  height: 26,
                  p: 0,
                  "&:hover": {
                    bgcolor: "#DC2626",
                  },
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  zIndex: 2,
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
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
      ))}
    </Box>
  );
};
