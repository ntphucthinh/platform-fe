import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, CardMedia, Paper, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

export interface HomestayGalleryProps {
  mainImage: string;
  images: string[];
  title: string;
}

export const HomestayGallery: React.FC<HomestayGalleryProps> = ({
  mainImage,
  images,
  title,
}) => {
  const validImages = (images || []).filter((img) => Boolean(img) && img.trim() !== "");
  const fallbackImage = mainImage || validImages[0] || DEFAULT_NO_IMAGE;

  // Deduplicate and prepare image list
  const allImages =
    validImages.length > 0 ? Array.from(new Set(validImages)) : [fallbackImage];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const thumbnailScrollRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const safeIndex = selectedIndex < allImages.length ? selectedIndex : 0;

  // Scroll active thumbnail into view smoothly
  useEffect(() => {
    const activeEl = thumbnailRefs.current[safeIndex];
    if (activeEl && thumbnailScrollRef.current) {
      const container = thumbnailScrollRef.current;
      const elLeft = activeEl.offsetLeft;
      const elWidth = activeEl.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = elLeft - containerWidth / 2 + elWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      });
    }
  }, [safeIndex]);

  const handlePrev = useCallback(() => {
    if (allImages.length <= 1) return;
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    if (allImages.length <= 1) return;
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  const handleScrollStrip = (direction: "left" | "right") => {
    if (!thumbnailScrollRef.current) return;
    const scrollAmount = 260;
    thumbnailScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const hasMultipleImages = allImages.length > 1;

  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    if (e.touches.length === 1) {
      dragStartX.current = e.touches[0].clientX;
      dragStartY.current = e.touches[0].clientY;
      setDragOffset(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!hasMultipleImages || dragStartX.current === null || dragStartY.current === null || e.touches.length !== 1) {
      return;
    }
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - dragStartX.current;
    const diffY = currentY - dragStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      let effectiveOffset = diffX;
      if (safeIndex === 0 && diffX > 0) {
        effectiveOffset = diffX * 0.25;
      } else if (safeIndex === allImages.length - 1 && diffX < 0) {
        effectiveOffset = diffX * 0.25;
      }
      setDragOffset(effectiveOffset);
    }
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages) return;
    if (dragStartX.current !== null) {
      if (dragOffset < -40 && safeIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
      } else if (dragOffset > 40 && safeIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
      }
      dragStartX.current = null;
      dragStartY.current = null;
      setDragOffset(0);
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasMultipleImages || e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    setIsMouseDown(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasMultipleImages || !isMouseDown || dragStartX.current === null || dragStartY.current === null) {
      return;
    }
    const diffX = e.clientX - dragStartX.current;
    const diffY = e.clientY - dragStartY.current;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      let effectiveOffset = diffX;
      if (safeIndex === 0 && diffX > 0) {
        effectiveOffset = diffX * 0.25;
      } else if (safeIndex === allImages.length - 1 && diffX < 0) {
        effectiveOffset = diffX * 0.25;
      }
      setDragOffset(effectiveOffset);
    }
  };

  const handleMouseUp = () => {
    if (!hasMultipleImages) return;
    if (isMouseDown && dragStartX.current !== null) {
      if (dragOffset < -40 && safeIndex < allImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
      } else if (dragOffset > 40 && safeIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
      }
      dragStartX.current = null;
      dragStartY.current = null;
      setIsMouseDown(false);
      setDragOffset(0);
    }
  };

  const handleMouseLeave = () => {
    if (isMouseDown) {
      handleMouseUp();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      {/* 1. Main Image Frame */}
      <Paper
        elevation={0}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
          position: "relative",
          pt: { xs: "64%", sm: "54%", md: "52%" },
          bgcolor: "#F8FAFC",
          boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.08)",
          userSelect: "none",
          touchAction: "pan-y",
          cursor: hasMultipleImages
            ? isMouseDown
              ? "grabbing"
              : "grab"
            : "default",
        }}
      >
        {/* Continuous Slider Track */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            transform: `translateX(calc(-${safeIndex * 100}% + ${dragOffset}px))`,
            transition: dragOffset !== 0 ? "none" : "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {allImages.map((imgUrl, idx) => (
            <Box
              key={idx}
              sx={{
                width: "100%",
                height: "100%",
                flex: "0 0 100%",
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                image={imgUrl}
                alt={`${title} - image ${idx + 1}`}
                draggable={false}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = DEFAULT_NO_IMAGE;
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Overlay Navigation Buttons on Main Image */}
        {hasMultipleImages && (
          <>
            <IconButton
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(15, 23, 42, 0.65)",
                color: "#FFFFFF",
                backdropFilter: "blur(6px)",
                width: 44,
                height: 44,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease",
                pointerEvents: "auto",
                zIndex: 2,
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.88)",
                  transform: "translateY(-50%) scale(1.08)",
                },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 28 }} />
            </IconButton>

            <IconButton
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(15, 23, 42, 0.65)",
                color: "#FFFFFF",
                backdropFilter: "blur(6px)",
                width: 44,
                height: 44,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "all 0.2s ease",
                pointerEvents: "auto",
                zIndex: 2,
                "&:hover": {
                  bgcolor: "rgba(15, 23, 42, 0.88)",
                  transform: "translateY(-50%) scale(1.08)",
                },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 28 }} />
            </IconButton>

            {/* Counter Badge */}
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                bgcolor: "rgba(15, 23, 42, 0.75)",
                color: "#F8FAFC",
                px: 1.5,
                py: 0.5,
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 700,
                backdropFilter: "blur(4px)",
                letterSpacing: "0.02em",
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              {safeIndex + 1} / {allImages.length}
            </Box>
          </>
        )}
      </Paper>

      {/* 2. Single Horizontal Thumbnail Strip */}
      {hasMultipleImages && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
          {/* Scroll Strip Left Button */}
          <IconButton
            aria-label="Scroll thumbnails left"
            onClick={() => handleScrollStrip("left")}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#FFFFFF",
              border: "1px solid #CBD5E1",
              color: "#334155",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "#F1F5F9", borderColor: "#94A3B8" },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 22 }} />
          </IconButton>

          {/* Horizontal Scroll Area */}
          <Box
            ref={thumbnailScrollRef}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              overflowX: "auto",
              scrollBehavior: "smooth",
              py: 0.5,
              px: 0.5,
              flex: 1,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {allImages.map((imgUrl, index) => {
              const isSelected = index === safeIndex;
              return (
                <Paper
                  key={index}
                  elevation={0}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={() => setSelectedIndex(index)}
                  sx={{
                    width: 90,
                    height: 64,
                    flexShrink: 0,
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    border: "2.5px solid",
                    borderColor: isSelected ? "#2563EB" : "transparent",
                    boxShadow: isSelected
                      ? "0 0 0 2px rgba(37, 99, 235, 0.3), 0 4px 10px rgba(37, 99, 235, 0.2)"
                      : "0 2px 6px rgba(0,0,0,0.05)",
                    opacity: isSelected ? 1 : 0.65,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      opacity: 1,
                      borderColor: isSelected ? "#2563EB" : "#CBD5E1",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={imgUrl}
                    alt={`${title} thumbnail ${index + 1}`}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = DEFAULT_NO_IMAGE;
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Paper>
              );
            })}
          </Box>

          {/* Scroll Strip Right Button */}
          <IconButton
            aria-label="Scroll thumbnails right"
            onClick={() => handleScrollStrip("right")}
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#FFFFFF",
              border: "1px solid #CBD5E1",
              color: "#334155",
              flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "#F1F5F9", borderColor: "#94A3B8" },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
