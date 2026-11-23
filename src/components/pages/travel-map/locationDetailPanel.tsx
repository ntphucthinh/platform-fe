import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Divider,
  Portal,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import { LocationStatus } from "@/constants/travelMap";
import { useBottomSheetDrag } from "@/hooks/travel-map/useBottomSheetDrag";
import { LocationPanelHero } from "@/components/pages/travel-map/detail-panel/locationPanelHero";
import { LocationPanelInfo } from "@/components/pages/travel-map/detail-panel/locationPanelInfo";
import { LocationPanelMemories } from "@/components/pages/travel-map/detail-panel/locationPanelMemories";
import { LocationPanelItineraries } from "@/components/pages/travel-map/detail-panel/locationPanelItineraries";

interface LocationDetailPanelProps {
  location: ILocationWithDetails | null;
  open: boolean;
  onClose: () => void;
  onEdit: (location: ILocationWithDetails) => void;
  onDelete: (id: number, name: string) => void;
  isMobile?: boolean;
  variant?: "side" | "inline";
}

export const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location: propLocation,
  open,
  onClose,
  onEdit,
  onDelete,
  isMobile,
  variant = "side",
}) => {
  const theme = useTheme();
  const isMobileQuery = useMediaQuery(theme.breakpoints.down("md"));
  const effectiveIsMobile = isMobile !== undefined ? isMobile : isMobileQuery;
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const [prevPropLocation, setPrevPropLocation] = useState(propLocation);
  const [cachedLocation, setCachedLocation] = useState(propLocation);
  if (propLocation !== prevPropLocation) {
    setPrevPropLocation(propLocation);
    if (propLocation) {
      setCachedLocation(propLocation);
    }
  }
  const location = propLocation || cachedLocation;

  const [animStatus, setAnimStatus] = useState<
    "unmounted" | "entering" | "entered" | "exiting"
  >(open && location ? "entered" : "unmounted");

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && location) {
      setAnimStatus(prefersReducedMotion ? "entered" : "entering");
    } else if (!open && animStatus !== "unmounted") {
      setAnimStatus(prefersReducedMotion ? "unmounted" : "exiting");
    }
  }

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevPropLocationIdRef = useRef<number | null>(propLocation?.id ?? null);

  // Hook cử chỉ kéo thả bottom sheet mobile
  const {
    mobileSheetRef,
    backdropRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useBottomSheetDrag({
    effectiveIsMobile,
    prefersReducedMotion,
    open,
    onClose,
  });

  // Scroll to top when location changes while panel is already open
  useEffect(() => {
    if (propLocation?.id && prevPropLocationIdRef.current !== propLocation.id) {
      prevPropLocationIdRef.current = propLocation.id;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [propLocation?.id]);

  // Handle async lifecycle transitions (entering -> entered, exiting -> unmounted)
  useEffect(() => {
    if (animStatus === "entering") {
      let rafId2 = 0;
      const rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          setAnimStatus("entered");
        });
      });
      return () => {
        cancelAnimationFrame(rafId1);
        cancelAnimationFrame(rafId2);
      };
    }
    if (animStatus === "exiting") {
      const exitDuration = effectiveIsMobile ? 360 : 320;
      const timer = setTimeout(() => {
        setAnimStatus("unmounted");
      }, exitDuration);
      return () => clearTimeout(timer);
    }
  }, [animStatus, effectiveIsMobile]);

  // Handle Escape key to close panel
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (animStatus === "unmounted" || !location) {
    return null;
  }

  const isEntered = animStatus === "entered";
  const isVisited = location.status === LocationStatus.Visited;

  const panelContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "100%",
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
        animation: prefersReducedMotion
          ? "none"
          : "panelContentFadeIn 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        "@keyframes panelContentFadeIn": {
          "0%": {
            opacity: 0.5,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Top Header Image & Controls */}
      <LocationPanelHero
        location={location}
        effectiveIsMobile={effectiveIsMobile}
        variant={variant}
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        handleDragStart={handleDragStart}
        handleDragMove={handleDragMove}
        handleDragEnd={handleDragEnd}
      />

      {/* Scrollable Content Body */}
      <Box
        ref={scrollContainerRef}
        sx={{
          p: { xs: 2, sm: 2.5 },
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
          touchAction: "pan-y",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          pb: "calc(32px + env(safe-area-inset-bottom, 20px))",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#CBD5E1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#94A3B8",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
        }}
      >
        {/* Title, Address, Coordinates, Metrics, Description */}
        <LocationPanelInfo location={location} />

        <Divider sx={{ my: 0.5 }} />

        {/* Travel Memories */}
        <LocationPanelMemories location={location} isVisited={isVisited} />

        {/* Itineraries */}
        <LocationPanelItineraries location={location} />
      </Box>
    </Box>
  );

  if (effectiveIsMobile) {
    return (
      <Portal>
        {/* Backdrop */}
        <Box
          ref={backdropRef}
          onClick={onClose}
          aria-hidden="true"
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(2px)",
            zIndex: 1200,
            opacity: isEntered ? 1 : 0,
            transition: prefersReducedMotion
              ? "none"
              : "opacity 350ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: isEntered ? "auto" : "none",
          }}
        />

        {/* Bottom Sheet */}
        <Box
          ref={mobileSheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Chi tiết địa điểm ${
            location.locationName || location.name
          }`}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1201,
            height: "calc(100dvh - 44px - env(safe-area-inset-top, 0px))",
            maxHeight: "calc(100dvh - 44px - env(safe-area-inset-top, 0px))",
            "@supports not (height: 100dvh)": {
              height: "calc(100vh - 44px)",
              maxHeight: "calc(100vh - 44px)",
            },
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            overflow: "hidden",
            bgcolor: "#FFFFFF",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.18)",
            transform: isEntered ? "translateY(0)" : "translateY(40px)",
            opacity: isEntered ? 1 : 0,
            transition: prefersReducedMotion
              ? "none"
              : `transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
                 opacity 380ms cubic-bezier(0.22, 1, 0.36, 1)`,
            pointerEvents: isEntered ? "auto" : "none",
          }}
        >
          {panelContent}
        </Box>
      </Portal>
    );
  }

  // Desktop Inline Panel (Bottom Sheet style within list panel area)
  if (variant === "inline") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          transform: isEntered ? "translateY(0)" : "translateY(40px)",
          opacity: isEntered ? 1 : 0,
          transition: prefersReducedMotion
            ? "none"
            : `transform 340ms cubic-bezier(0.22, 1, 0.36, 1),
               opacity 340ms cubic-bezier(0.22, 1, 0.36, 1)`,
          pointerEvents: isEntered ? "auto" : "none",
        }}
      >
        {panelContent}
      </Box>
    );
  }

  // Desktop Side Panel (30% width on desktop matching 7:3 ratio with map)
  return (
    <Box
      sx={{
        width: isEntered ? { md: "calc(30% - 6px)" } : 0,
        flex: isEntered ? { md: "0 0 calc(30% - 6px)" } : "0 0 0px",
        marginLeft: (t) => (isEntered ? 0 : `-${t.spacing(2.5)}`),
        opacity: isEntered ? 1 : 0,
        transition: prefersReducedMotion
          ? "none"
          : `width 320ms cubic-bezier(0.22, 1, 0.36, 1),
             flex 320ms cubic-bezier(0.22, 1, 0.36, 1),
             margin-left 320ms cubic-bezier(0.22, 1, 0.36, 1),
             opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
        overflow: "hidden",
        flexShrink: 0,
        height: "100%",
        maxHeight: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        pointerEvents: isEntered ? "auto" : "none",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minWidth: { md: 280 },
          height: "100%",
          maxHeight: "100%",
          minHeight: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          transform: isEntered ? "translateX(0)" : "translateX(24px)",
          opacity: isEntered ? 1 : 0,
          transition: prefersReducedMotion
            ? "none"
            : `transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
               opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {panelContent}
      </Box>
    </Box>
  );
};
