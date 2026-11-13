import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
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
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import type { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import { useTravelMemoryList } from "@/hooks/travel-memories/useTravelMemoryList";
import { useDeleteTravelMemory } from "@/hooks/travel-memories/useDeleteTravelMemory";
import { TravelMemoryCard } from "@/components/pages/travel-memories/travelMemoryCard";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { useCountries, type IGlobalCountry } from "@/hooks/common/useGlobalGeo";
import useTravelLocationSelection from "@/hooks/selections/useTravelLocationSelection";

export const TravelMemoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Page query parameter (1-based, required by backend API)
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
  const perPage = 10;

  // Filter state
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(null);

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
    data: memories,
    total,
    isLoading,
    error,
    refetch,
  } = useTravelMemoryList({
    page,
    countryCode: countryFilter || undefined,
    locationId: typeof locationFilter === "number" ? locationFilter : undefined,
  });

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

  // Summary counts - mock con số cụ thể theo yêu cầu
  const totalTrips = 12;
  const uniqueDestinationsCount = 8;
  const totalPhotosCount = 64;

  const prefersReducedMotion = useMediaQuery(
    "@media (prefers-reduced-motion: reduce)",
  );

  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  // Tổng số nhóm/trang theo pagination của server
  const totalItems = total > 0 ? total : memories.length;
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
    const { success, error: delError } = await deleteTravelMemory(itemToDelete.id);
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>
      <HeaderTitle>Kỷ niệm chuyến đi</HeaderTitle>

      {/* 5.1 Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Kỷ niệm chuyến đi
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Lưu giữ những hành trình và khoảnh khắc đáng nhớ.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/travel-memories/create")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            alignSelf: { xs: "stretch", sm: "auto" },
          }}
        >
          Thêm chuyến đi
        </Button>
      </Box>

      {/* 5.2 Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: { xs: 1.25, sm: 1.5 },
        }}
      >
        {[
          {
            title: "Tổng chuyến đi",
            value: totalTrips,
            subtitle: "Hành trình đã ghi lại",
            icon: (
              <CollectionsBookmarkOutlinedIcon
                sx={{ fontSize: { xs: 20, sm: 22 }, color: "#1976D2" }}
              />
            ),
            bgColor: "#EFF6FF",
            borderColor: "#BFDBFE",
          },
          {
            title: "Tổng địa điểm",
            value: uniqueDestinationsCount,
            subtitle: "Điểm đến trên khắp cả nước",
            icon: (
              <LocationOnOutlinedIcon
                sx={{ fontSize: { xs: 20, sm: 22 }, color: "#059669" }}
              />
            ),
            bgColor: "#ECFDF5",
            borderColor: "#A7F3D0",
          },
          {
            title: "Tổng hình ảnh",
            value: totalPhotosCount,
            subtitle: "Khoảnh khắc lưu giữ",
            icon: (
              <PhotoLibraryOutlinedIcon
                sx={{ fontSize: { xs: 20, sm: 22 }, color: "#D97706" }}
              />
            ),
            bgColor: "#FFFBEB",
            borderColor: "#FDE68A",
          },
        ].map((c) => (
          <Card
            key={c.title}
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              minHeight: { xs: 70, sm: 75 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              },
            }}
          >
            <CardContent
              sx={{
                py: { xs: 1.25, sm: 1.6 },
                px: { xs: 1.5, sm: 2 },
                "&:last-child": { pb: { xs: 1.25, sm: 1.6 } },
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.75 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: "10px",
                  bgcolor: c.bgColor,
                  border: `1px solid ${c.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    display: "block",
                    fontWeight: 700,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: { xs: "0.01em", sm: "0.03em" },
                    fontSize: { xs: "0.62rem", sm: "0.72rem" },
                    lineHeight: 1.3,
                    mb: 0.35,
                  }}
                >
                  {c.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "baseline" },
                    gap: { xs: 0.1, sm: 0.75 },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 800,
                      color: "#0F172A",
                      fontSize: { xs: "1.15rem", sm: "1.42rem" },
                      lineHeight: 1.1,
                    }}
                  >
                    {c.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: "#94A3B8",
                      fontSize: { xs: "0.68rem", sm: "0.76rem" },
                      lineHeight: 1.2,
                      maxWidth: "100%",
                    }}
                  >
                    {c.subtitle}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* 5.3 Filters Bar */}
      <Card
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Year Filter (DatePicker chỉ chọn năm) */}
        <DatePicker
          views={["year"]}
          openTo="year"
          label="Năm"
          format="YYYY"
          value={selectedYear}
          onChange={(newValue) => setSelectedYear(newValue)}
          sx={{ width: 160 }}
          slotProps={{
            field: { clearable: true },
            actionBar: {
              actions: ["clear", "accept"],
            },
            textField: {
              size: "small",
              sx: { width: 160 },
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
          sx={{ width: { xs: "100%", sm: 300 } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Quốc gia"
              placeholder="Tất cả quốc gia"
              size="small"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  startAdornment: selectedCountry ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 0.5,
                        pr: 0.5,
                      }}
                    >
                      <Box
                        component="img"
                        width="22"
                        height="15"
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
                    params.slotProps?.input?.startAdornment
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
                  width="22"
                  height="15"
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
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  {option.vietnameseName !== option.name
                    ? `${option.vietnameseName} (${option.name})`
                    : option.name}
                </Typography>
              </Box>
            );
          }}
        />

        {/* Location Filter */}
        <Autocomplete<
          { label: string; value: string | number },
          false,
          false,
          false
        >
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
          sx={{ width: { xs: "100%", sm: 300 } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Địa điểm"
              placeholder="Chọn địa điểm..."
              size="small"
            />
          )}
        />
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
          <CircularProgress size={36} sx={{ color: "#2563EB" }} />
          <Typography
            variant="body1"
            sx={{ color: "#64748B", fontWeight: 500 }}
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
            border: "1px dashed #CBD5E1",
            borderRadius: "14px",
            bgcolor: "#FFFFFF",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <CollectionsBookmarkOutlinedIcon
            sx={{ fontSize: 48, color: "#94A3B8" }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#334155" }}>
            Không tìm thấy chuyến đi nào
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", maxWidth: 460 }}>
            {countryFilter || locationFilter !== ""
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
                    width: idx === page - 1 ? 24 : 8,
                    height: 8,
                    borderRadius: "4px",
                    bgcolor: idx === page - 1 ? "primary.main" : "#CBD5E1",
                    cursor: "pointer",
                    transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                    "&:hover": {
                      bgcolor: idx === page - 1 ? "primary.main" : "#94A3B8",
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
