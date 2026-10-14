import React, { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import type { ITravelMemoryPhoto } from "@/types/pages/travel-memories/travelMemory";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

export interface TravelMemoryPhotoLightboxProps {
  open: boolean;
  photos: ITravelMemoryPhoto[];
  currentIndex: number;
  dateLabel?: string;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const TravelMemoryPhotoLightbox: React.FC<
  TravelMemoryPhotoLightboxProps
> = ({ open, photos, currentIndex, dateLabel, onClose, onNavigate }) => {
  const total = photos.length;
  const currentPhoto = photos[currentIndex];

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, total, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handlePrev, handleNext, onClose]);

  if (!currentPhoto) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#0F172A",
            color: "#F8FAFC",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            m: { xs: 1, sm: 2 },
          },
        },
      }}
    >
      {/* Lightbox Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {dateLabel && (
            <Typography
              variant="subtitle2"
              sx={{ color: "#94A3B8", fontWeight: 600 }}
            >
              {dateLabel}
            </Typography>
          )}
          <Typography
            variant="caption"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.12)",
              px: 1.2,
              py: 0.3,
              borderRadius: "12px",
              fontWeight: 600,
            }}
          >
            {currentIndex + 1} / {total}
          </Typography>
        </Box>

        <Tooltip title="Đóng (Esc)">
          <IconButton
            onClick={onClose}
            sx={{
              color: "#94A3B8",
              "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255, 255, 255, 0.1)" },
            }}
            aria-label="Đóng ảnh"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Image Stage */}
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#020617",
          minHeight: { xs: 300, sm: 460 },
          maxHeight: "75vh",
          overflow: "hidden",
        }}
      >
        {/* Previous Button */}
        {currentIndex > 0 && (
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(15, 23, 42, 0.75)",
              color: "#FFFFFF",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(15, 23, 42, 0.95)" },
              zIndex: 2,
            }}
            aria-label="Ảnh trước"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}

        {/* Current Image */}
        <Box
          component="img"
          src={currentPhoto.imageUrl || DEFAULT_NO_IMAGE}
          alt={currentPhoto.altText || currentPhoto.caption || "Travel photo"}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = DEFAULT_NO_IMAGE;
          }}
          sx={{
            maxWidth: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
            userSelect: "none",
          }}
        />

        {/* Next Button */}
        {currentIndex < total - 1 && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(15, 23, 42, 0.75)",
              color: "#FFFFFF",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(15, 23, 42, 0.95)" },
              zIndex: 2,
            }}
            aria-label="Ảnh tiếp theo"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        )}
      </DialogContent>

      {/* Caption footer if exists */}
      {currentPhoto.caption && (
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#CBD5E1", fontStyle: "italic" }}
          >
            {currentPhoto.caption}
          </Typography>
        </Box>
      )}
    </Dialog>
  );
};
