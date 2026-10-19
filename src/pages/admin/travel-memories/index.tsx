import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import {
  getTravelMemories,
  deleteTravelMemory,
  subscribeTravelMemories,
} from "@/services/travelMemoryService";
import { countTotalPhotos } from "@/utils/travelMemoryUtils";
import { TravelMemoryCard } from "@/components/pages/travel-memories/travelMemoryCard";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";

export const TravelMemoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<ITravelMemory[]>(
    getTravelMemories(),
  );

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [destinationFilter, setDestinationFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<ITravelMemory | null>(null);

  // Toast feedback state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Subscribe to service updates (creates/edits/deletions)
  useEffect(() => {
    const unsubscribe = subscribeTravelMemories(() => {
      setMemories(getTravelMemories());
    });
    return unsubscribe;
  }, []);

  // Summary counts
  const totalTrips = memories.length;
  const uniqueDestinationsCount = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      if (m.destination) set.add(m.destination.trim());
    });
    return set.size;
  }, [memories]);

  const totalPhotosCount = useMemo(() => {
    return memories.reduce((acc, m) => acc + countTotalPhotos(m.days), 0);
  }, [memories]);

  // Unique Years for dropdown
  const uniqueYears = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      if (m.startDate) {
        const year = dayjs(m.startDate).format("YYYY");
        if (year && year !== "Invalid Date") set.add(year);
      }
    });
    return Array.from(set).sort().reverse();
  }, [memories]);

  // Unique Destinations for dropdown
  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      if (m.destination) set.add(m.destination.trim());
    });
    return Array.from(set).sort();
  }, [memories]);

  // Filtered & Sorted memories
  const filteredMemories = useMemo(() => {
    const list = memories.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.destination.toLowerCase().includes(term) ||
        (item.description || "").toLowerCase().includes(term);

      const matchesYear =
        yearFilter === "ALL" ||
        dayjs(item.startDate).format("YYYY") === yearFilter;

      const matchesDestination =
        destinationFilter === "ALL" ||
        item.destination.trim() === destinationFilter;

      return matchesSearch && matchesYear && matchesDestination;
    });

    list.sort((a, b) => {
      const timeA = dayjs(a.startDate).valueOf();
      const timeB = dayjs(b.startDate).valueOf();
      return sortOrder === "NEWEST" ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [memories, searchTerm, yearFilter, destinationFilter, sortOrder]);

  const isFiltered =
    searchTerm !== "" ||
    yearFilter !== "ALL" ||
    destinationFilter !== "ALL" ||
    sortOrder !== "NEWEST";

  // Responsive Carousel Grouping
  // Desktop (lg+): 4 cols x 2 rows = 8 items
  // Tablet (sm-md): 2 cols x 2 rows = 4 items
  // Mobile (xs): 1 col x 2 rows = 2 items
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const itemsPerGroup = isMobile ? 2 : isTablet ? 4 : 8;
  const prefersReducedMotion = useMediaQuery(
    "@media (prefers-reduced-motion: reduce)",
  );

  const [currentGroup, setCurrentGroup] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  // Reset to first group when itemsPerGroup changes (viewport breakpoint resize)
  const [prevItemsPerGroup, setPrevItemsPerGroup] = useState(itemsPerGroup);
  if (itemsPerGroup !== prevItemsPerGroup) {
    setPrevItemsPerGroup(itemsPerGroup);
    setCurrentGroup(0);
  }

  // Reset to first group when search/filter/sort changes
  const filterKey = `${searchTerm}_${yearFilter}_${destinationFilter}_${sortOrder}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentGroup(0);
  }

  const totalItems = filteredMemories.length;
  const totalGroups = Math.max(1, Math.ceil(totalItems / itemsPerGroup));

  // Auto-clamp currentGroup if items are deleted or filtered
  if (currentGroup >= totalGroups) {
    setCurrentGroup(Math.max(0, totalGroups - 1));
  }

  // Calculate slice indices for the current group
  const startIndex = currentGroup * itemsPerGroup;
  const endIndex = Math.min(startIndex + itemsPerGroup, totalItems);
  const visibleMemories = useMemo(() => {
    return filteredMemories.slice(startIndex, endIndex);
  }, [filteredMemories, startIndex, endIndex]);

  const startItem = totalItems === 0 ? 0 : startIndex + 1;
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

  const handleGoToGroup = (groupIndex: number) => {
    if (groupIndex === currentGroup) return;
    setSlideDirection(groupIndex > currentGroup ? "next" : "prev");
    setCurrentGroup(groupIndex);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setYearFilter("ALL");
    setDestinationFilter("ALL");
    setSortOrder("NEWEST");
    setCurrentGroup(0);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteTravelMemory(itemToDelete.id);
    setSnackbar({
      open: true,
      message: `Đã xóa chuyến đi "${itemToDelete.title}" thành công.`,
      severity: "success",
    });
    setItemToDelete(null);
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
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2.5,
        }}
      >
        <Box>
          <Card
            elevation={1}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  Tổng chuyến đi
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "8px",
                    bgcolor: "#EFF6FF",
                    color: "primary.main",
                  }}
                >
                  <CollectionsBookmarkOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {totalTrips}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Hành trình đã ghi lại
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card
            elevation={1}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  Tổng địa điểm
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "8px",
                    bgcolor: "#ECFDF5",
                    color: "#059669",
                  }}
                >
                  <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {uniqueDestinationsCount}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#059669", fontWeight: 600 }}
              >
                Điểm đến trên khắp cả nước
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card
            elevation={1}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  Tổng hình ảnh
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "8px",
                    bgcolor: "#FFFBEB",
                    color: "#D97706",
                  }}
                >
                  <PhotoLibraryOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {totalPhotosCount}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#D97706", fontWeight: 600 }}
              >
                Khoảnh khắc lưu giữ
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 5.3 Search & Filters Bar */}
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
        <TextField
          placeholder="Tìm theo tên chuyến đi hoặc địa điểm..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{ flex: { xs: "1 1 100%", md: "1 1 260px" }, minWidth: 220 }}
        />

        {/* Year Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 140 } }}>
          <InputLabel id="year-filter-label">Năm</InputLabel>
          <Select
            labelId="year-filter-label"
            value={yearFilter}
            label="Năm"
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả các năm</MenuItem>
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>
                Năm {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Destination Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
          <InputLabel id="destination-filter-label">Địa điểm</InputLabel>
          <Select
            labelId="destination-filter-label"
            value={destinationFilter}
            label="Địa điểm"
            onChange={(e) => setDestinationFilter(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả địa điểm</MenuItem>
            {uniqueDestinations.map((dest) => (
              <MenuItem key={dest} value={dest}>
                {dest}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort Order Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 140 } }}>
          <InputLabel id="sort-order-label">Sắp xếp</InputLabel>
          <Select
            labelId="sort-order-label"
            value={sortOrder}
            label="Sắp xếp"
            onChange={(e) =>
              setSortOrder(e.target.value as "NEWEST" | "OLDEST")
            }
          >
            <MenuItem value="NEWEST">Mới nhất</MenuItem>
            <MenuItem value="OLDEST">Cũ nhất</MenuItem>
          </Select>
        </FormControl>

        {/* Reset button */}
        {isFiltered && (
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<FilterAltOffIcon />}
            onClick={handleResetFilters}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "#CBD5E1",
              color: "#475569",
              height: 40,
            }}
          >
            Đặt lại bộ lọc
          </Button>
        )}
      </Card>

      {/* 5.4 List Header & Group Navigation */}
      {filteredMemories.length > 0 && (
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
      )}

      {/* 5.5 Trip Cards Grid / Empty State */}
      {filteredMemories.length === 0 ? (
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
            {isFiltered
              ? "Không có chuyến đi nào phù hợp với từ khóa hoặc bộ lọc đã chọn. Hãy thử đặt lại bộ lọc."
              : "Bạn chưa có chuyến đi nào được lưu giữ. Hãy bấm '+ Thêm chuyến đi' để tạo kỷ niệm đầu tiên!"}
          </Typography>
          {isFiltered && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetFilters}
              sx={{ mt: 1, borderRadius: "8px", textTransform: "none" }}
            >
              Xóa bộ lọc tìm kiếm
            </Button>
          )}
        </Card>
      ) : (
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
      {filteredMemories.length > 0 && (
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
            Đang xem {startItem}–{endItem} trong {totalItems} chuyến đi
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={Boolean(itemToDelete)}
        title="Xóa Kỷ Niệm Chuyến Đi"
        itemName={itemToDelete?.title}
        message={
          itemToDelete
            ? `Bạn có chắc chắn muốn xóa chuyến đi "${itemToDelete.title}"? Toàn bộ hình ảnh và dữ liệu liên quan của chuyến đi này sẽ bị xóa khỏi hệ thống.`
            : undefined
        }
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
