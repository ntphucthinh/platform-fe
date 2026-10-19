import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import dayjs from "dayjs";
import type {
  ILocationWithDetails,
  ILocationFilterState,
} from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

interface TravelMapListViewProps {
  locations: ILocationWithDetails[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
  onResetFilters: () => void;
  filters?: ILocationFilterState;
}

export const TravelMapListView: React.FC<TravelMapListViewProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onResetFilters,
  filters,
}) => {

  // Responsive Breakpoint logic:
  // Desktop (lg+): 4 columns x 2 rows = 8 items max
  // Tablet (sm-md): 2 columns x 2 rows = 4 items max
  // Mobile (xs): 1 column x 2 rows = 2 items max
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const itemsPerGroup = isMobile ? 2 : isTablet ? 4 : 8;
  const prefersReducedMotion = useMediaQuery(
    "@media (prefers-reduced-motion: reduce)",
  );

  const [currentGroup, setCurrentGroup] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  // Reset to first group when itemsPerGroup changes on viewport breakpoint resize
  const [prevItemsPerGroup, setPrevItemsPerGroup] = useState(itemsPerGroup);
  if (itemsPerGroup !== prevItemsPerGroup) {
    setPrevItemsPerGroup(itemsPerGroup);
    setCurrentGroup(0);
  }

  // Reset to first group when search/filter state changes
  const filterKey = filters
    ? `${filters.search}_${filters.status}_${filters.year}`
    : "";
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentGroup(0);
  }

  // If a new location is prepended to the top of the list, reset to group 0 to view it
  const firstLocationId = locations[0]?.id || "";
  const [prevFirstLocId, setPrevFirstLocId] = useState(firstLocationId);
  if (firstLocationId !== prevFirstLocId) {
    setPrevFirstLocId(firstLocationId);
    setCurrentGroup(0);
  }

  const totalLocations = locations.length;
  const totalGroups = Math.max(1, Math.ceil(totalLocations / itemsPerGroup));

  // Auto-clamp currentGroup if items are deleted or filtered
  if (currentGroup >= totalGroups) {
    setCurrentGroup(Math.max(0, totalGroups - 1));
  }

  // Calculate slice indices for the current group
  const startIndex = currentGroup * itemsPerGroup;
  const endIndex = Math.min(startIndex + itemsPerGroup, totalLocations);
  const visibleLocations = useMemo(() => {
    return locations.slice(startIndex, endIndex);
  }, [locations, startIndex, endIndex]);

  const startItem = totalLocations === 0 ? 0 : startIndex + 1;
  const endItem = endIndex;

  const handlePrevGroup = () => {
    if (currentGroup > 0) {
      setSlideDirection("prev");
      setCurrentGroup((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNextGroup = () => {
    if (currentGroup < totalGroups - 1) {
      setSlideDirection("next");
      setCurrentGroup((prev) => Math.min(totalGroups - 1, prev + 1));
    }
  };

  const handleGoToGroup = (targetGroup: number) => {
    if (targetGroup === currentGroup) return;
    setSlideDirection(targetGroup > currentGroup ? "next" : "prev");
    setCurrentGroup(targetGroup);
  };

  if (locations.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px dashed #CBD5E1",
          bgcolor: "#F8FAFC",
          p: { xs: 4, sm: 6 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "#EFF6FF",
            color: "#1976D2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <SearchOffOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}
        >
          Không tìm thấy địa điểm nào
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#64748B", maxWidth: 460, mx: "auto", mb: 2.5 }}
        >
          Không có địa điểm nào phù hợp với từ khóa hoặc bộ lọc đã chọn. Hãy thử
          thay đổi từ khóa tìm kiếm hoặc làm mới bộ lọc.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={onResetFilters}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
        >
          Xóa toàn bộ bộ lọc
        </Button>
      </Card>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}>
      {/* List Header & Navigation Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: "1.05rem",
            }}
          >
            Danh sách địa điểm
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ({totalLocations} địa điểm · Đang xem {startItem}–{endItem})
          </Typography>
        </Box>

        {/* Navigation Controls: Previous / Next buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              display: { xs: "none", sm: "block" },
            }}
          >
            Nhóm {currentGroup + 1} / {totalGroups}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <IconButton
              size="small"
              onClick={handlePrevGroup}
              disabled={currentGroup === 0 || totalGroups <= 1}
              aria-label="Nhóm trước"
              sx={{
                border: "1px solid",
                borderColor:
                  currentGroup === 0 || totalGroups <= 1
                    ? "#E2E8F0"
                    : "#CBD5E1",
                bgcolor: "#FFFFFF",
                borderRadius: "8px",
                width: 36,
                height: 36,
                color:
                  currentGroup === 0 || totalGroups <= 1
                    ? "action.disabled"
                    : "text.primary",
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                  borderColor: "primary.main",
                  color: "primary.main",
                },
                "&.Mui-disabled": {
                  borderColor: "#E2E8F0",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={handleNextGroup}
              disabled={currentGroup >= totalGroups - 1 || totalGroups <= 1}
              aria-label="Nhóm tiếp theo"
              sx={{
                border: "1px solid",
                borderColor:
                  currentGroup >= totalGroups - 1 || totalGroups <= 1
                    ? "#E2E8F0"
                    : "#CBD5E1",
                bgcolor: "#FFFFFF",
                borderRadius: "8px",
                width: 36,
                height: 36,
                color:
                  currentGroup >= totalGroups - 1 || totalGroups <= 1
                    ? "action.disabled"
                    : "text.primary",
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                  borderColor: "primary.main",
                  color: "primary.main",
                },
                "&.Mui-disabled": {
                  borderColor: "#E2E8F0",
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Grid: 4 cols Desktop, 2 cols Tablet, 1 col Mobile */}
      <Box
        key={currentGroup}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
          animation: prefersReducedMotion
            ? "none"
            : `${slideDirection === "next" ? "slideNext" : "slidePrev"} 240ms cubic-bezier(0.22, 1, 0.36, 1)`,
          "@keyframes slideNext": {
            "0%": {
              opacity: 0,
              transform: "translateX(16px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
          "@keyframes slidePrev": {
            "0%": {
              opacity: 0,
              transform: "translateX(-16px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
        }}
      >
        {visibleLocations.map((loc) => {
          const isSelected = loc.id === selectedLocationId;
          const isVisited = loc.status === "Visited";

          return (
            <Card
              key={loc.id}
              elevation={0}
              onClick={() => onSelectLocation(loc.id)}
              sx={{
                borderRadius: "16px",
                border: isSelected
                  ? "2px solid #1976D2"
                  : "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.2s ease-in-out",
                boxShadow: isSelected
                  ? "0 4px 16px rgba(25, 118, 210, 0.15)"
                  : "none",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  borderColor: isSelected ? "#1976D2" : "#CBD5E1",
                },
              }}
            >
              {/* Cover Image & Status Badge */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={loc.coverImage || DEFAULT_NO_IMAGE}
                  alt={loc.name}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = DEFAULT_NO_IMAGE;
                  }}
                  sx={{ objectFit: "cover" }}
                />
                <Chip
                  label={isVisited ? "Đã ghé thăm" : "Muốn đến"}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: isVisited ? "#059669" : "#D97706",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  p: 2.25,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#0F172A",
                      fontSize: "1.05rem",
                      mb: 0.5,
                      lineHeight: 1.3,
                    }}
                  >
                    {loc.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#64748B",
                      fontSize: "0.85rem",
                      mb: 1.25,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 16, color: "#94A3B8", flexShrink: 0 }}
                    />
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "#64748B", fontSize: "0.825rem" }}
                    >
                      {loc.address}
                    </Typography>
                  </Box>

                  {loc.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475569",
                        fontSize: "0.85rem",
                        lineHeight: 1.45,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {loc.description}
                    </Typography>
                  )}
                </Box>

                {/* Bottom stats row */}
                <Box
                  sx={{
                    pt: 1.75,
                    borderTop: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#0F172A",
                        fontSize: "0.825rem",
                        fontWeight: 600,
                      }}
                    >
                      <CollectionsBookmarkOutlinedIcon
                        sx={{ fontSize: 15, color: "#1976D2" }}
                      />
                      {loc.visitCount > 0
                        ? `${loc.visitCount} chuyến đi`
                        : "Chưa có chuyến"}
                    </Box>

                    {loc.latestVisitDate && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "#64748B",
                          fontSize: "0.775rem",
                        }}
                      >
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} />
                        {dayjs(loc.latestVisitDate).format("MM/YYYY")}
                      </Box>
                    )}
                  </Box>

                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLocation(loc.id);
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.825rem",
                      p: 0,
                    }}
                  >
                    Chi tiết
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Progress Info & Dots Indicator */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          mt: 0.5,
        }}
      >
        {/* Progress dots if multiple groups */}
        {totalGroups > 1 && totalGroups <= 12 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {Array.from({ length: totalGroups }).map((_, idx) => (
              <Box
                key={idx}
                onClick={() => handleGoToGroup(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleGoToGroup(idx);
                  }
                }}
                aria-label={`Chuyển đến nhóm ${idx + 1}`}
                sx={{
                  width: idx === currentGroup ? 24 : 8,
                  height: 8,
                  borderRadius: "4px",
                  bgcolor: idx === currentGroup ? "primary.main" : "#CBD5E1",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  "&:hover": {
                    bgcolor: idx === currentGroup ? "primary.main" : "#94A3B8",
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Progress text indicator */}
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Đang xem {startItem}–{endItem} trong {totalLocations} địa điểm
        </Typography>
      </Box>
    </Box>
  );
};
