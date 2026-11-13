import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import dayjs from "dayjs";
import type {
  ILocationWithDetails,
  ILocationFilterState,
} from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import { LocationStatus } from "@/constants/travelMap";

interface TravelMapListViewProps {
  locations: ILocationWithDetails[];
  selectedLocationId: number | null;
  onSelectLocation: (id: number) => void;
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const itemsPerGroup = isMobile ? 4 : isTablet ? 6 : 10;
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

  // Reset to first group when filter state changes
  const filterKey = filters
    ? `${filters.countryCode ?? ""}_${filters.status ?? ""}`
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

  if (locations.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: "14px",
          border: "1px dashed #CBD5E1",
          bgcolor: "#F8FAFC",
          p: { xs: 4, sm: 6 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
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
          <SearchOffOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5, fontSize: "1.1rem" }}
        >
          Không tìm thấy địa điểm nào
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#64748B", maxWidth: 440, mx: "auto", mb: 2.5 }}
        >
          Không có địa điểm nào phù hợp với bộ lọc hiện tại. Hãy thử chọn quốc gia
          khác hoặc làm mới bộ lọc.
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      {/* List Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 28,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: "1rem",
            letterSpacing: "-0.01em",
          }}
        >
          Danh sách địa điểm ({totalLocations})
        </Typography>
      </Box>

      {/* Grid: 5 cols Desktop, 2 cols Tablet, 1 col Mobile */}
      <Box
        key={currentGroup}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
          animation: prefersReducedMotion
            ? "none"
            : `${slideDirection === "next" ? "slideNext" : "slidePrev"} 220ms cubic-bezier(0.22, 1, 0.36, 1)`,
          "@keyframes slideNext": {
            "0%": {
              opacity: 0,
              transform: "translateX(12px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
          "@keyframes slidePrev": {
            "0%": {
              opacity: 0,
              transform: "translateX(-12px)",
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
          const isVisited = loc.status === LocationStatus.Visited;

          return (
            <Card
              key={loc.id}
              elevation={0}
              role="button"
              tabIndex={0}
              onClick={() => onSelectLocation(loc.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectLocation(loc.id);
                }
              }}
              sx={{
                borderRadius: "14px",
                border: isSelected
                  ? "2px solid #1976D2"
                  : "1px solid #E2E8F0",
                bgcolor: "background.paper",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.18s ease-in-out",
                boxShadow: isSelected
                  ? "0 4px 14px rgba(25, 118, 210, 0.14)"
                  : "none",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
                  borderColor: isSelected ? "primary.main" : "#CBD5E1",
                },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                },
              }}
            >
              {/* Cover Image & Status Badge */}
              <Box
                sx={{
                  position: "relative",
                  bgcolor:
                    !loc.coverImage || loc.coverImage === DEFAULT_NO_IMAGE
                      ? "background.default"
                      : "transparent",
                }}
              >
                <CardMedia
                  component="img"
                  loading="lazy"
                  decoding="async"
                  height="140"
                  image={loc.coverImage || DEFAULT_NO_IMAGE}
                  alt={loc.locationName || loc.name}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = DEFAULT_NO_IMAGE;
                    e.currentTarget.style.objectFit = "contain";
                    e.currentTarget.style.padding = "20px";
                    e.currentTarget.style.backgroundColor = "#F8FAFC";
                  }}
                  sx={{
                    objectFit:
                      !loc.coverImage || loc.coverImage === DEFAULT_NO_IMAGE
                        ? "contain"
                        : "cover",
                    p:
                      !loc.coverImage || loc.coverImage === DEFAULT_NO_IMAGE
                        ? 2
                        : 0,
                    boxSizing: "border-box",
                  }}
                />
                <Chip
                  label={isVisited ? "Đã ghé thăm" : "Muốn đến"}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: isVisited ? "#059669" : "#D97706",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.725rem",
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
                    height: 22,
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  p: 1.75,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ mb: 1.25 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      mb: 0.5,
                      minWidth: 0,
                    }}
                  >
                    {loc.countryCode && (
                      <Box
                        component="img"
                        loading="lazy"
                        width="18"
                        height="12"
                        src={`https://flagcdn.com/${loc.countryCode.toLowerCase()}.svg`}
                        alt={loc.countryCode}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                        sx={{
                          borderRadius: "2px",
                          objectFit: "cover",
                          border: "1px solid #CBD5E1",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{
                        fontWeight: 700,
                        color: "#0F172A",
                        fontSize: "0.95rem",
                        lineHeight: 1.35,
                        minWidth: 0,
                      }}
                    >
                      {loc.locationName || loc.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#64748B",
                      fontSize: "0.825rem",
                      mb: 1,
                      minWidth: 0,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 15, color: "#94A3B8", flexShrink: 0 }}
                    />
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "#64748B", fontSize: "0.8rem", minWidth: 0 }}
                    >
                      {loc.address}
                    </Typography>
                  </Box>

                  {loc.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475569",
                        fontSize: "0.825rem",
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

                {/* Bottom stats row (without redundant button) */}
                <Box
                  sx={{
                    pt: 1.25,
                    borderTop: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#0F172A",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      minWidth: 0,
                    }}
                  >
                    <CollectionsBookmarkOutlinedIcon
                      sx={{ fontSize: 15, color: "#1976D2", flexShrink: 0 }}
                    />
                    <Typography
                      variant="caption"
                      noWrap
                      sx={{ color: "#0F172A", fontWeight: 600, fontSize: "0.775rem" }}
                    >
                      {loc.visitCount > 0
                        ? `${loc.visitCount} chuyến`
                        : "Chưa có chuyến"}
                    </Typography>
                  </Box>

                  {loc.latestVisitDate && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.25,
                        color: "#64748B",
                        fontSize: "0.75rem",
                        flexShrink: 0,
                      }}
                    >
                      <CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} />
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748B", fontSize: "0.75rem" }}
                      >
                        {dayjs(loc.latestVisitDate).format("MM/YYYY")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Unified Bottom Pagination */}
      {totalGroups > 1 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pt: 2,
            borderTop: "1px solid #E2E8F0",
            flexWrap: "wrap",
            gap: 1.5,
            mt: 0.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.85rem",
              fontWeight: 500,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Đang xem {startItem}–{endItem} trong {totalLocations} địa điểm
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "space-between", sm: "flex-end" },
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<ChevronLeftRoundedIcon />}
              disabled={currentGroup === 0}
              onClick={handlePrevGroup}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.825rem",
                borderColor: "#CBD5E1",
                color: "text.primary",
                minHeight: 36,
                "&:hover": { borderColor: "primary.main", bgcolor: "#F8FAFC" },
              }}
            >
              Trước
            </Button>

            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                px: 1,
                fontSize: "0.825rem",
              }}
            >
              Trang {currentGroup + 1} / {totalGroups}
            </Typography>

            <Button
              size="small"
              variant="outlined"
              endIcon={<ChevronRightRoundedIcon />}
              disabled={currentGroup >= totalGroups - 1}
              onClick={handleNextGroup}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.825rem",
                borderColor: "#CBD5E1",
                color: "text.primary",
                minHeight: 36,
                "&:hover": { borderColor: "primary.main", bgcolor: "#F8FAFC" },
              }}
            >
              Sau
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
