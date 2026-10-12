import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DEFAULT_NO_IMAGE, isVideoMedia } from "@/constants/homestayConstant";

export interface ImageLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  title: string;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  title,
  onClose,
  onNavigate,
  triggerRef,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement | null>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  // Normalize image list and index
  const validImages = useMemo(() => {
    return images.length > 0 ? images : [DEFAULT_NO_IMAGE];
  }, [images]);
  const safeIndex =
    currentIndex >= 0 && currentIndex < validImages.length ? currentIndex : 0;
  const currentImage = validImages[safeIndex] || DEFAULT_NO_IMAGE;
  const hasMultipleImages = validImages.length > 1;

  // Navigation handlers with looping
  const handlePrev = useCallback(() => {
    if (!hasMultipleImages) return;
    const nextIndex = safeIndex === 0 ? validImages.length - 1 : safeIndex - 1;
    onNavigate(nextIndex);
  }, [hasMultipleImages, safeIndex, validImages.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (!hasMultipleImages) return;
    const nextIndex = safeIndex === validImages.length - 1 ? 0 : safeIndex + 1;
    onNavigate(nextIndex);
  }, [hasMultipleImages, safeIndex, validImages.length, onNavigate]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent content jump by compensating scrollbar width
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Focus management: focus Close button on open, return focus to trigger on close
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [isOpen, triggerRef]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing in form inputs
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Preload adjacent images for smooth instant transitions
  useEffect(() => {
    if (!isOpen || validImages.length <= 1) return;
    const nextIdx = (safeIndex + 1) % validImages.length;
    const prevIdx = (safeIndex - 1 + validImages.length) % validImages.length;

    const imgNext = new Image();
    imgNext.src = validImages[nextIdx];
    const imgPrev = new Image();
    imgPrev.src = validImages[prevIdx];
  }, [isOpen, safeIndex, validImages]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, safeIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages || e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      !isSwiping.current ||
      touchStartX.current === null ||
      touchStartY.current === null ||
      e.touches.length !== 1
    ) {
      return;
    }
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Only swipe horizontally if movement is more horizontal than vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      touchDeltaX.current = diffX;
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current || touchStartX.current === null) return;
    const swipeThreshold = 45; // Minimum px distance to trigger navigation

    if (touchDeltaX.current < -swipeThreshold) {
      // Swiped Left -> Next image
      handleNext();
    } else if (touchDeltaX.current > swipeThreshold) {
      // Swiped Right -> Previous image
      handlePrev();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    isSwiping.current = false;
  };

  if (!isOpen) return null;

  return createPortal(
    <Box
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} - Xem ảnh phóng to`}
      tabIndex={-1}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "rgba(10, 15, 29, 0.94)",
        backdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        outline: "none",
        animation: "fadeIn 0.22s ease-out",
        userSelect: "none",
        touchAction: "pan-y",
        p: { xs: 1.5, sm: 2.5, md: 3 },
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      {/* 1. Header Bar: Title / Counter / Close Button */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
          color: "#FFFFFF",
        }}
      >
        {/* Counter Badge & Homestay Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF",
              px: 1.75,
              py: 0.6,
              borderRadius: "20px",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              fontWeight: 700,
              letterSpacing: "0.03em",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {safeIndex + 1} / {validImages.length}
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              display: { xs: "none", sm: "block" },
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 600,
              fontSize: "0.9rem",
              maxWidth: { sm: 320, md: 500 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Close Button */}
        <Tooltip title="Đóng (Escape)">
          <IconButton
            ref={closeButtonRef}
            aria-label="Đóng xem ảnh phóng to"
            onClick={onClose}
            sx={{
              color: "#FFFFFF",
              bgcolor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.85)",
                borderColor: "transparent",
                transform: "scale(1.06)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 22, sm: 26 } }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 2. Main Image Viewer Area */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: { xs: 1, sm: 1.5 },
          overflow: "hidden",
        }}
      >
        {/* Previous Button (Desktop & Tablet) */}
        {hasMultipleImages && (
          <Tooltip title="Ảnh trước (Mũi tên trái)">
            <IconButton
              aria-label="Ảnh trước"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              sx={{
                position: "absolute",
                left: { xs: 8, sm: 16, md: 24 },
                zIndex: 10,
                color: "#FFFFFF",
                bgcolor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                width: { xs: 44, sm: 52 },
                height: { xs: 44, sm: 52 },
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(37, 99, 235, 0.85)",
                  borderColor: "transparent",
                  transform: "scale(1.08)",
                },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Center Main Image (Strictly contained, no crop, no distortion) */}
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            maxWidth: { xs: "96vw", sm: "90vw", md: "84vw" },
            maxHeight: {
              xs: "calc(100vh - 160px)",
              sm: "calc(100vh - 180px)",
              md: "calc(100vh - 200px)",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {isVideoMedia(currentImage) ? (
            <Box
              component="video"
              key={currentImage}
              src={currentImage}
              controls
              autoPlay
              loop
              playsInline
              draggable={false}
              sx={{
                maxWidth: "100%",
                maxHeight: {
                  xs: "calc(100vh - 160px)",
                  sm: "calc(100vh - 180px)",
                  md: "calc(100vh - 200px)",
                },
                objectFit: "contain",
                borderRadius: { xs: "8px", sm: "14px" },
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              }}
            />
          ) : (
            <Box
              component="img"
              key={currentImage}
              src={currentImage}
              alt={`${title} - Ảnh ${safeIndex + 1}`}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = DEFAULT_NO_IMAGE;
              }}
              draggable={false}
              sx={{
                maxWidth: "100%",
                maxHeight: {
                  xs: "calc(100vh - 160px)",
                  sm: "calc(100vh - 180px)",
                  md: "calc(100vh - 200px)",
                },
                objectFit: "contain",
                borderRadius: { xs: "8px", sm: "14px" },
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                transition: "transform 0.25s ease, opacity 0.25s ease",
                animation: "imagePop 0.22s ease-out",
                "@keyframes imagePop": {
                  from: { opacity: 0.8, transform: "scale(0.98)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                  transition: "none",
                },
              }}
            />
          )}
        </Box>

        {/* Next Button (Desktop & Tablet) */}
        {hasMultipleImages && (
          <Tooltip title="Ảnh tiếp theo (Mũi tên phải)">
            <IconButton
              aria-label="Ảnh tiếp theo"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              sx={{
                position: "absolute",
                right: { xs: 8, sm: 16, md: 24 },
                zIndex: 10,
                color: "#FFFFFF",
                bgcolor: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                width: { xs: 44, sm: 52 },
                height: { xs: 44, sm: 52 },
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(37, 99, 235, 0.85)",
                  borderColor: "transparent",
                  transform: "scale(1.08)",
                },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* 3. Bottom Thumbnail Strip for Fast Navigation */}
      {hasMultipleImages && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 680, md: 840 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            pt: 0.5,
          }}
        >
          <Box
            ref={thumbnailScrollRef}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              overflowX: "auto",
              py: 0.75,
              px: 1,
              maxWidth: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {validImages.map((imgUrl, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <Box
                  key={idx}
                  ref={(el: HTMLDivElement | null) => {
                    thumbnailRefs.current[idx] = el;
                  }}
                  onClick={() => onNavigate(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Chuyển đến ảnh ${idx + 1}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onNavigate(idx);
                    }
                  }}
                  sx={{
                    width: { xs: 52, sm: 64, md: 72 },
                    height: { xs: 38, sm: 46, md: 50 },
                    flexShrink: 0,
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    border: "2px solid",
                    borderColor: isSelected
                      ? "#3B82F6"
                      : "rgba(255, 255, 255, 0.2)",
                    boxShadow: isSelected
                      ? "0 0 12px rgba(59, 130, 246, 0.6)"
                      : "none",
                    opacity: isSelected ? 1 : 0.5,
                    transform: isSelected ? "scale(1.08)" : "scale(1)",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      opacity: 1,
                      borderColor: isSelected
                        ? "#3B82F6"
                        : "rgba(255, 255, 255, 0.6)",
                      transform: isSelected ? "scale(1.08)" : "scale(1.04)",
                    },
                  }}
                >
                  {isVideoMedia(imgUrl) ? (
                    <>
                      <Box
                        component="video"
                        src={imgUrl}
                        muted
                        playsInline
                        draggable={false}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "1rem",
                          pointerEvents: "none",
                        }}
                      >
                        ▶
                      </Box>
                    </>
                  ) : (
                    <Box
                      component="img"
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = DEFAULT_NO_IMAGE;
                      }}
                      draggable={false}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>,
    document.body
  );
};
