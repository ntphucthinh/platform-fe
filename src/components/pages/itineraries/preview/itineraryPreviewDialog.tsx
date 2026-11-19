import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ITravelItinerary } from "@/types/pages/itineraries/itinerary";
import { ItineraryHero } from "./itineraryHero";
import { ItineraryInfoPanel } from "./itineraryInfoPanel";
import {
  ItineraryDayTabs,
  type ItineraryTabKey,
} from "./itineraryDayTabs";
import { ItineraryOverview } from "./itineraryOverview";
import { ItineraryTimeline } from "./itineraryTimeline";
import { ItineraryImageGallery } from "./itineraryImageGallery";
import { ItineraryTravelTips } from "./itineraryTravelTips";
import { ItineraryDayRoute } from "./itineraryDayRoute";

export interface ItineraryPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  itinerary: ITravelItinerary;
}

export const ItineraryPreviewDialog: React.FC<ItineraryPreviewDialogProps> = ({
  open,
  onClose,
  itinerary,
}) => {
  const [activeTab, setActiveTab] = useState<ItineraryTabKey>("overview");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevTabRef = useRef<ItineraryTabKey>(activeTab);
  const isFirstRender = useRef(true);

  // Auto-scroll when tab changes
  useEffect(() => {
    if (!open) {
      isFirstRender.current = true;
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevTabRef.current === activeTab) {
      return;
    }
    prevTabRef.current = activeTab;

    if (!contentRef.current || !scrollContainerRef.current) return;

    const contentRect = contentRef.current.getBoundingClientRect();
    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    const currentScrollTop = scrollContainerRef.current.scrollTop;
    const offset = contentRect.top - containerRect.top;
    const targetScroll = currentScrollTop + offset - 115;

    scrollContainerRef.current.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: "smooth",
    });
  }, [activeTab, open]);

  const days = itinerary.days || [];
  const totalActivities = days.reduce(
    (acc, d) => acc + (d.activities?.length || 0),
    0,
  );

  const activeDay = (() => {
    if (activeTab === "overview") return null;
    const match = activeTab.match(/day-(\d+)/);
    if (!match) return null;
    const dayNumber = parseInt(match[1], 10);
    return days.find((d) => d.dayNumber === dayNumber) || null;
  })();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      slotProps={{
        paper: {
          sx: {
            overflow: "hidden",
          },
        },
      }}
    >
      <Box
        ref={scrollContainerRef}
        sx={{
          bgcolor: "#F8FAFC",
          height: "100vh",
          maxHeight: "100vh",
          overflowY: "auto",
          scrollBehavior: "smooth",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Preview Bar */}
        <Box
          sx={{
            bgcolor: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            px: { xs: 2, sm: 4 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#0F172A" }}
            >
              Xem trước: {itinerary.title || "Lịch trình chưa đặt tên"}
            </Typography>
            <Chip
              label="Bản xem trước thời gian thực"
              size="small"
              sx={{
                bgcolor: "#FEF3C7",
                color: "#92400E",
                fontWeight: 700,
                fontSize: "0.74rem",
                borderRadius: "6px",
              }}
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#CBD5E1",
              color: "#334155",
            }}
          >
            Đóng xem trước
          </Button>
        </Box>

        {/* Preview Content Body */}
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Top Banner & Info Section */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1fr 340px",
                xl: "1fr 360px",
              },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            <ItineraryHero
              coverImage={itinerary.coverImage}
              destination={itinerary.destination}
              title={itinerary.title}
              duration={itinerary.duration}
              description={itinerary.description}
            />

            <ItineraryInfoPanel
              duration={itinerary.duration}
              destination={itinerary.destination}
              suitableFor={
                itinerary.suitableFor || "Cặp đôi, nhóm bạn, gia đình"
              }
              totalActivities={totalActivities}
              themes={itinerary.themes}
            />
          </Box>

          {/* Day Navigation Tabs */}
          <Box
            sx={{
              position: "sticky",
              top: 57,
              zIndex: 15,
              bgcolor: "#F8FAFC",
              mx: { xs: -2, sm: -3, md: -4 },
              px: { xs: 2, sm: 3, md: 4 },
              pt: { xs: 0.75, sm: 1 },
              pb: { xs: 0.75, sm: 1.25 },
              borderBottom: "1px solid #E2E8F0",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
            }}
          >
            <ItineraryDayTabs
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              dayCount={days.length}
            />
          </Box>

          {/* Main Content & Supporting Sidebar */}
          <Box
            ref={contentRef}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1fr 340px",
                xl: "1fr 360px",
              },
              gap: 3,
              alignItems: "start",
              mt: { xs: 0.5, sm: 0 },
            }}
          >
            {/* Left Column: Overview or Timeline based on Active Tab */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              {activeTab === "overview" ? (
                <ItineraryOverview
                  itinerary={itinerary}
                  onSelectDay={(tabKey) => setActiveTab(tabKey)}
                />
              ) : activeDay ? (
                <ItineraryTimeline day={activeDay} />
              ) : (
                <Typography sx={{ color: "text.secondary", py: 4 }}>
                  Không tìm thấy thông tin cho ngày đã chọn.
                </Typography>
              )}
            </Box>

            {/* Right Column: Contextual based on Active Tab - Sticky below tabs on Desktop */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
                position: { xs: "static", lg: "sticky" },
                top: { xs: "auto", lg: 125 },
                alignSelf: "start",
                zIndex: 10,
                maxHeight: { xs: "none", lg: "calc(100vh - 145px)" },
                overflowY: { xs: "visible", lg: "auto" },
                pr: { lg: 0.5 },
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E1 transparent",
                "&::-webkit-scrollbar": {
                  width: 4,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#CBD5E1",
                  borderRadius: 2,
                },
              }}
            >
              {activeTab === "overview" ? (
                <>
                  <ItineraryImageGallery
                    images={itinerary.featuredImages || []}
                  />
                  <ItineraryTravelTips
                    tips={itinerary.travelTips || []}
                  />
                </>
              ) : activeDay ? (
                <ItineraryDayRoute day={activeDay} />
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ItineraryPreviewDialog;
