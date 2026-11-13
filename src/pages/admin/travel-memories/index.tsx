import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Snackbar,
  Alert,
  useMediaQuery,
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import dayjs, { type Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import { useTravelMemoryList } from "@/hooks/travel-memories/useTravelMemoryList";
import { useDeleteTravelMemory } from "@/hooks/travel-memories/useDeleteTravelMemory";
import { TravelMemoryCard } from "@/components/pages/travel-memories/travelMemoryCard";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { useCountries, type IGlobalCountry } from "@/hooks/common/useGlobalGeo";
import useTravelLocationSelection from "@/hooks/selections/useTravelLocationSelection";
import { countTotalPhotos } from "@/utils/travelMemoryUtils";

export const TravelMemoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Page query parameter (1-based, required by backend API)
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
  const perPage = 10;

  // Year query parameter
  const yearParam = searchParams.get("year");
  const parsedYear =
    yearParam && !isNaN(parseInt(yearParam, 10))
      ? parseInt(yearParam, 10)
      : null;

  const selectedYear = useMemo<Dayjs | null>(() => {
    if (!parsedYear) return null;
    const d = dayjs().year(parsedYear).startOf("year");
    return d.isValid() ? d : null;
  }, [parsedYear]);

  // Country & Location query parameters from URL
  const countryParam = searchParams.get("country")?.trim() || "";
  const locationParam = searchParams.get("locationId");
  const locationFilter: number | "" =
    locationParam && !isNaN(parseInt(locationParam, 10))
      ? parseInt(locationParam, 10)
      : "";

  // Countries from global geo hook
  const countries = useCountries();

  // Travel locations selection hook filtered by country (nếu chưa chọn country thì gọi API gốc không có param)
  const { travelLocationsSelections, data: locationData } =
    useTravelLocationSelection({
      countryCode: countryParam || undefined,
    });

  // Country filter: lấy từ URL param hoặc suy luận từ locationFilter nếu URL chưa có country
  const countryFilter = useMemo(() => {
    if (countryParam) return countryParam;
    if (locationFilter !== "") {
      const matched = locationData.find((l) => l.id === locationFilter);
      if (matched?.countryCode) {
        return matched.countryCode;
      }
    }
    return "";
  }, [countryParam, locationFilter, locationData]);

  // Selected country object for Autocomplete
  const selectedCountry = useMemo(() => {
    if (!countryFilter) return null;
    return countries.find((c) => c.iso2 === countryFilter) ?? null;
  }, [countries, countryFilter]);

  // Selected location object for Autocomplete
  const selectedLocation = useMemo(() => {
    if (locationFilter === "") return null;
    const foundInOptions = travelLocationsSelections.find(
      (loc) => Number(loc.value) === Number(locationFilter),
    );
    if (foundInOptions) return foundInOptions;
    const foundInRaw = locationData.find((l) => l.id === locationFilter);
    if (foundInRaw) {
      return { label: foundInRaw.name, value: foundInRaw.id };
    }
    return null;
  }, [travelLocationsSelections, locationData, locationFilter]);

  const {
    data: rawMemories,
    total,
    isLoading,
    error,
    refetch,
  } = useTravelMemoryList({
    page,
    countryCode: countryFilter || undefined,
    locationId: typeof locationFilter === "number" ? locationFilter : undefined,
    year: parsedYear ?? undefined,
  });

  const memories = useMemo(() => {
    if (!parsedYear) return rawMemories;
    return rawMemories.filter((m) => {
      const startYear = m.startDate ? dayjs(m.startDate).year() : null;
      const endYear = m.endDate ? dayjs(m.endDate).year() : null;
      return startYear === parsedYear || endYear === parsedYear;
    });
  }, [rawMemories, parsedYear]);

  const handleYearChange = (newValue: Dayjs | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      if (newValue && newValue.isValid()) {
        next.set("year", newValue.year().toString());
      } else {
        next.delete("year");
      }
      return next;
    });
  };

  const { deleteTravelMemory, isLoading: isDeleting } = useDeleteTravelMemory();

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", newPage.toString());
      return next;
    });
  };

  // Xử lý khi chọn quốc gia
  const handleCountryChange = (newCountryCode: string) => {
    const code = (newCountryCode || "").trim();

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      if (code) {
        next.set("country", code);
      } else {
        next.delete("country");
      }
      next.delete("locationId");
      return next;
    });
  };

  // Xử lý khi chọn địa điểm
  const handleLocationChange = (newLocationId: number | "") => {
    let nextCountryCode = countryParam;

    if (newLocationId !== "") {
      const selectedLoc = locationData.find((l) => l.id === newLocationId);
      if (selectedLoc?.countryCode) {
        nextCountryCode = selectedLoc.countryCode;
      }
    }

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      if (nextCountryCode) {
        next.set("country", nextCountryCode);
      } else {
        next.delete("country");
      }
      if (newLocationId !== "") {
        next.set("locationId", newLocationId.toString());
      } else {
        next.delete("locationId");
      }
      return next;
    });
  };

  const isFiltered = Boolean(parsedYear) || Boolean(countryParam) || Boolean(locationParam);

  const handleResetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      next.delete("year");
      next.delete("country");
      next.delete("locationId");
      return next;
    });
  };

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<ITravelMemory | null>(null);

  // Toast feedback state
  const navSuccessMessage = (
    location.state as { successMessage?: string } | null
  )?.successMessage;

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>(() => ({
    open: Boolean(navSuccessMessage),
    message: navSuccessMessage || "",
    severity: "success",
  }));

  // Summary counts derived from live data
  const totalTrips = parsedYear
    ? memories.length
    : total > 0
      ? total
      : memories.length;
  const uniqueDestinationsCount = useMemo(() => {
    const destSet = new Set<string | number>();
    memories.forEach((m) => {
      if (m.locationId) {
        destSet.add(m.locationId);
      } else if (m.destination?.trim()) {
        destSet.add(m.destination.trim().toLowerCase());
      }
    });
    return destSet.size;
  }, [memories]);
  const totalPhotosCount = useMemo(
    () => memories.reduce((sum, m) => sum + countTotalPhotos(m.days), 0),
    [memories],
  );

  const prefersReducedMotion = useMediaQuery(
    "@media (prefers-reduced-motion: reduce)",
  );

  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  // Tổng số nhóm/trang theo pagination của server
  const totalItems = parsedYear
    ? memories.length
    : total > 0
      ? total
      : memories.length;
  const totalGroups = Math.max(1, Math.ceil(totalItems / perPage));

  const startItem = totalItems === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalItems);
  const visibleMemories = memories;

  const handlePrevGroup = () => {
    if (page > 1) {
      setSlideDirection("prev");
      handlePageChange(page - 1);
    }
  };

  const handleNextGroup = () => {
    if (page < totalGroups) {
      setSlideDirection("next");
      handlePageChange(page + 1);
    }
  };

  const handleGoToGroup = (groupIndex: number) => {
    const targetPage = groupIndex + 1;
    if (targetPage === page) return;
    setSlideDirection(targetPage > page ? "next" : "prev");
    handlePageChange(targetPage);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { success, error: delError } = await deleteTravelMemory(
      itemToDelete.id,
    );
    if (success) {
      setSnackbar({
        open: true,
        message: "Đã xóa chuyến đi thành công.",
        severity: "success",
      });
      setItemToDelete(null);
      await refetch();
    } else {
      setSnackbar({
        open: true,
        message: delError || "Xóa chuyến đi thất bại.",
        severity: "error",
      });
      setItemToDelete(null);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
      <HeaderTitle>Kỷ niệm chuyến đi</HeaderTitle>

      {/* 5.1 Distilled Control Bar (40px Uniform Controls) */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 1.25, sm: 1.25 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.25,
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Left Filters */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            flexWrap: "wrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Year Filter */}
          <DatePicker
            views={["year"]}
            openTo="year"
            format="YYYY"
            value={selectedYear}
            onChange={handleYearChange}
            slotProps={{
              field: { clearable: true },
              actionBar: { actions: ["clear", "accept"] },
              textField: {
                size: "small",
                sx: {
                  width: { xs: "100%", sm: 110 },
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    boxSizing: "border-box",
                    borderRadius: "8px",
                    bgcolor: "#F8FAFC",
                    fontSize: "0.875rem",
                    "& fieldset": { borderColor: "#CBD5E1" },
                    "&:hover fieldset": { borderColor: "primary.main" },
                    "&.Mui-focused fieldset": { borderColor: "primary.main" },
                    "& .MuiOutlinedInput-input": {
                      py: "0 !important",
                      fontSize: "0.875rem",
                    },
                  },
                },
              },
            }}
          />

          {/* Country Filter */}
          <Autocomplete<IGlobalCountry, false, false, false>
            size="small"
            options={countries}
            getOptionLabel={(option) =>
              option.vietnameseName !== option.name
                ? `${option.vietnameseName} (${option.name})`
                : option.name
            }
            value={selectedCountry}
            isOptionEqualToValue={(option, value) => option.iso2 === value.iso2}
            onChange={(_, newValue) => {
              handleCountryChange(newValue ? newValue.iso2 : "");
            }}
            sx={{
              width: { xs: "100%", sm: 220, md: 230 },
              flexShrink: 0,
              "& .MuiOutlinedInput-root": {
                height: 40,
                boxSizing: "border-box",
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#CBD5E1" },
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
                "& .MuiOutlinedInput-input": {
                  py: "0 !important",
                  fontSize: "0.875rem",
                },
                "& .MuiAutocomplete-input": {
                  py: "0 !important",
                  fontSize: "0.875rem",
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Tất cả quốc gia..."
                size="small"
                slotProps={{
                  ...params.slotProps,
                  input: {
                    ...params.slotProps?.input,
                    startAdornment: selectedCountry ? (
                      <Box sx={{ display: "flex", alignItems: "center", pl: 0.25, pr: 0.5 }}>
                        <Box
                          component="img"
                          width="20"
                          height="14"
                          src={selectedCountry.flagUrl}
                          alt={selectedCountry.iso2}
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
                        {params.slotProps?.input?.startAdornment}
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", pl: 0.25, pr: 0.5, color: "#94A3B8" }}>
                        <PublicOutlinedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        {params.slotProps?.input?.startAdornment}
                      </Box>
                    ),
                  },
                }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  {...rest}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    py: 0.75,
                  }}
                >
                  <Box
                    component="img"
                    loading="lazy"
                    width="20"
                    height="14"
                    src={option.flagUrl}
                    alt={option.iso2}
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
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "13.5px",
                        color: "#0F172A",
                      }}
                    >
                      {option.vietnameseName}
                    </Typography>
                    {option.vietnameseName !== option.name && (
                      <Typography sx={{ fontSize: "11.5px", color: "#64748B" }}>
                        {option.name}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#64748B",
                      fontFamily: "monospace",
                      bgcolor: "#F1F5F9",
                      px: 0.75,
                      py: 0.25,
                      borderRadius: "4px",
                    }}
                  >
                    {option.iso2}
                  </Typography>
                </Box>
              );
            }}
          />

          {/* Location Filter */}
          <Autocomplete<{ label: string; value: string | number }, false, false, false>
            size="small"
            options={travelLocationsSelections}
            getOptionLabel={(option) => option.label}
            value={selectedLocation}
            isOptionEqualToValue={(option, value) =>
              Number(option.value) === Number(value.value)
            }
            onChange={(_, newValue) => {
              handleLocationChange(newValue ? Number(newValue.value) : "");
            }}
            sx={{
              width: { xs: "100%", sm: 220, md: 230 },
              flexShrink: 0,
              "& .MuiOutlinedInput-root": {
                height: 40,
                boxSizing: "border-box",
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "#CBD5E1" },
                "&:hover fieldset": { borderColor: "primary.main" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
                "& .MuiOutlinedInput-input": {
                  py: "0 !important",
                  fontSize: "0.875rem",
                },
                "& .MuiAutocomplete-input": {
                  py: "0 !important",
                  fontSize: "0.875rem",
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Tất cả địa điểm..."
                size="small"
                slotProps={{
                  ...params.slotProps,
                  input: {
                    ...params.slotProps?.input,
                    startAdornment: (
                      <Box sx={{ display: "flex", alignItems: "center", pl: 0.25, pr: 0.5, color: "#94A3B8" }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        {params.slotProps?.input?.startAdornment}
                      </Box>
                    ),
                  },
                }}
              />
            )}
          />

          {/* Reset Filter Button */}
          {isFiltered && (
            <Button
              size="small"
              variant="text"
              startIcon={<RestartAltIcon sx={{ fontSize: 17 }} />}
              onClick={handleResetFilters}
              sx={{
                height: 40,
                borderRadius: "8px",
                textTransform: "none",
                color: "#64748B",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 1.25,
                "&:hover": { color: "#0F172A", bgcolor: "#F1F5F9" },
              }}
            >
              Xóa lọc
            </Button>
          )}
        </Box>

        {/* Right Action & Stats */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            ml: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "stretch", sm: "flex-end" },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              height: 40,
              borderRadius: "8px",
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#475569",
              fontSize: "0.8125rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <span>{totalTrips} chuyến đi</span>
            <span style={{ color: "#94A3B8" }}>•</span>
            <span>{uniqueDestinationsCount} địa điểm</span>
            <span style={{ color: "#94A3B8" }}>•</span>
            <span>{totalPhotosCount} ảnh</span>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon sx={{ fontSize: 19 }} />}
            onClick={() => navigate("/admin/travel-memories/create")}
            sx={{
              height: 40,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 2,
              boxShadow: "none",
              whiteSpace: "nowrap",
              flex: { xs: 1, sm: "initial" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Thêm chuyến đi
          </Button>
        </Box>
      </Card>

      {/* 5.4 List Header & Group Navigation */}
      {memories.length > 0 && (
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
              Danh sách chuyến đi
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ({totalItems} chuyến đi · Đang xem {startItem}–{endItem})
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
              Nhóm {page} / {totalGroups}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <IconButton
                size="small"
                onClick={handlePrevGroup}
                disabled={page <= 1 || totalGroups <= 1 || isLoading}
                aria-label="Nhóm trước"
                sx={{
                  border: "1px solid",
                  borderColor:
                    page <= 1 || totalGroups <= 1 || isLoading
                      ? "#E2E8F0"
                      : "#CBD5E1",
                  bgcolor: "#FFFFFF",
                  borderRadius: "8px",
                  width: 36,
                  height: 36,
                  color:
                    page <= 1 || totalGroups <= 1 || isLoading
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
                disabled={page >= totalGroups || totalGroups <= 1 || isLoading}
                aria-label="Nhóm tiếp theo"
                sx={{
                  border: "1px solid",
                  borderColor:
                    page >= totalGroups || totalGroups <= 1 || isLoading
                      ? "#E2E8F0"
                      : "#CBD5E1",
                  bgcolor: "#FFFFFF",
                  borderRadius: "8px",
                  width: 36,
                  height: 36,
                  color:
                    page >= totalGroups || totalGroups <= 1 || isLoading
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
      )}

      {/* Error Feedback */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void refetch()}
              sx={{ fontWeight: 600, textTransform: "none" }}
            >
              Thử lại
            </Button>
          }
          sx={{ borderRadius: "10px" }}
        >
          {error}
        </Alert>
      )}

      {/* 5.5 Trip Cards Grid / Empty State */}
      {isLoading ? (
        <Card
          elevation={0}
          sx={{
            py: 8,
            px: 3,
            border: "1px solid #E2E8F0",
            borderRadius: "14px",
            bgcolor: "#FFFFFF",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={36} color="primary" />
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Đang tải danh sách kỷ niệm chuyến đi...
          </Typography>
        </Card>
      ) : memories.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            py: 6,
            px: 3,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "14px",
            bgcolor: "background.paper",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <CollectionsBookmarkOutlinedIcon
            sx={{ fontSize: 48, color: "text.secondary" }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Không tìm thấy chuyến đi nào
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", maxWidth: 460 }}
          >
            {countryFilter || locationFilter !== "" || parsedYear
              ? "Không có chuyến đi nào phù hợp với bộ lọc hiện tại. Thử thay đổi hoặc xóa bộ lọc."
              : "Bạn chưa có chuyến đi nào được lưu giữ. Hãy bấm '+ Thêm chuyến đi' để tạo kỷ niệm đầu tiên!"}
          </Typography>
        </Card>
      ) : (
        <Box
          key={page}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 2,
            animation: prefersReducedMotion
              ? "none"
              : `${
                  slideDirection === "next" ? "slideNext" : "slidePrev"
                } 240ms cubic-bezier(0.22, 1, 0.36, 1)`,
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
          {visibleMemories.map((memory) => (
            <TravelMemoryCard
              key={memory.id}
              memory={memory}
              onView={(id) => navigate(`/admin/travel-memories/${id}`)}
              onEdit={(id) => navigate(`/admin/travel-memories/${id}/edit`)}
              onDelete={(m) => setItemToDelete(m)}
            />
          ))}
        </Box>
      )}

      {/* 5.6 Progress & Dots Footer */}
      {memories.length > 0 && (
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
          {/* Progress dots if multiple groups with accessible touch targets */}
          {totalGroups > 1 && totalGroups <= 12 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 32,
                    minWidth: idx === page - 1 ? 32 : 20,
                    px: 0.5,
                    cursor: "pointer",
                    borderRadius: "4px",
                    "&:focus-visible": {
                      outline: "2px solid #1976D2",
                      outlineOffset: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: idx === page - 1 ? 24 : 8,
                      height: 8,
                      borderRadius: "4px",
                      bgcolor:
                        idx === page - 1 ? "primary.main" : "text.disabled",
                      transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                      "&:hover": {
                        bgcolor:
                          idx === page - 1 ? "primary.main" : "text.secondary",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* Progress text indicator */}
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Đang xem {startItem}–{endItem} trong {totalItems} chuyến đi
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={Boolean(itemToDelete)}
        title="Xóa Kỷ Niệm Chuyến Đi"
        loading={isDeleting}
        message="Bạn có chắc chắn muốn xóa chuyến đi này? Toàn bộ hình ảnh và dữ liệu liên quan của chuyến đi sẽ bị xóa khỏi hệ thống."
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TravelMemoryListPage;
