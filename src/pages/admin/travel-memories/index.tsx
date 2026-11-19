import React, { useState, useMemo } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import { useTravelMemoryList } from "@/hooks/travel-memories/useTravelMemoryList";
import { useDeleteTravelMemory } from "@/hooks/travel-memories/useDeleteTravelMemory";
import { useTravelMemoryFilters } from "@/hooks/travel-memories/useTravelMemoryFilters";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { countTotalPhotos } from "@/utils/travelMemoryUtils";
import { TravelMemoryFilterBar } from "@/components/pages/travel-memories/travelMemoryFilterBar";
import { TravelMemoryEmptyState } from "@/components/pages/travel-memories/travelMemoryEmptyState";
import { TravelMemoryCardList } from "@/components/pages/travel-memories/travelMemoryCardList";
import {
  CardPagination,
  CardPaginationHeader,
} from "@/components/ui/pagination/cardPagination";

export const TravelMemoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, handleShowError } = useCustomOpenNotification();

  // 1. Quản lý Filters & URL Search Params
  const {
    page,
    perPage,
    parsedYear,
    selectedYear,
    countryFilter,
    selectedCountry,
    countries,
    locationFilter,
    selectedLocation,
    travelLocationsSelections,
    isFiltered,
    handlePageChange: onPageChange,
    handleYearChange,
    handleCountryChange,
    handleLocationChange,
    handleResetFilters,
  } = useTravelMemoryFilters();

  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");

  const handlePageChange = (newPage: number) => {
    setSlideDirection(newPage > page ? "next" : "prev");
    onPageChange(newPage);
  };

  // 2. Fetch danh sách từ API
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

  // Client-side filter fallback nếu backend chưa hỗ trợ filter theo năm chặt chẽ
  const memories = useMemo(() => {
    if (!parsedYear) return rawMemories;
    return rawMemories.filter((m) => {
      const startYear = m.startDate ? dayjs(m.startDate).year() : null;
      const endYear = m.endDate ? dayjs(m.endDate).year() : null;
      return startYear === parsedYear || endYear === parsedYear;
    });
  }, [rawMemories, parsedYear]);

  // 3. Delete memory handling
  const [itemToDelete, setItemToDelete] = useState<ITravelMemory | null>(null);
  const { deleteTravelMemory, isLoading: isDeleting } = useDeleteTravelMemory();

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { success, error: delError, rawError } = await deleteTravelMemory(
      itemToDelete.id,
    );
    if (success) {
      showSuccess("Đã xóa chuyến đi thành công.");
      setItemToDelete(null);
      await refetch();
    } else {
      handleShowError(rawError || delError, "Xóa chuyến đi thất bại.");
      setItemToDelete(null);
    }
  };

  // 4. Thống kê tóm tắt
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.5, sm: 2 },
        pb: { xs: 2, sm: 3 },
      }}
    >
      <HeaderTitle>Kỷ niệm chuyến đi</HeaderTitle>

      {/* 1. Control Toolbar & Filter Bar */}
      <TravelMemoryFilterBar
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        travelLocationsSelections={travelLocationsSelections}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        isFiltered={isFiltered}
        onResetFilters={handleResetFilters}
        totalTrips={totalTrips}
        uniqueDestinationsCount={uniqueDestinationsCount}
        totalPhotosCount={totalPhotosCount}
        onCreateNew={() => navigate("/admin/travel-memories/create")}
      />

      {/* 2. List Header & Desktop Compact Pagination */}
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

          <CardPaginationHeader
            page={page}
            totalItems={totalTrips}
            perPage={perPage}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </Box>
      )}

      {/* 3. Error Feedback */}
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

      {/* 4. Trip Cards Grid / Empty State */}
      {isLoading || memories.length === 0 ? (
        <TravelMemoryEmptyState isLoading={isLoading} isFiltered={isFiltered} />
      ) : (
        <>
          <TravelMemoryCardList
            memories={memories}
            page={page}
            slideDirection={slideDirection}
            onView={(id) => navigate(`/admin/travel-memories/${id}`)}
            onEdit={(id) => navigate(`/admin/travel-memories/${id}/edit`)}
            onDelete={(m) => setItemToDelete(m)}
          />

          {/* 5. Mobile & Desktop Dots Pagination */}
          <CardPagination
            page={page}
            totalItems={totalTrips}
            perPage={perPage}
            itemLabel="chuyến đi"
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </>
      )}

      {/* 6. Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={Boolean(itemToDelete)}
        title="Xóa Kỷ Niệm Chuyến Đi"
        loading={isDeleting}
        message="Bạn có chắc chắn muốn xóa chuyến đi này? Toàn bộ hình ảnh và dữ liệu liên quan của chuyến đi sẽ bị xóa khỏi hệ thống."
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default TravelMemoryListPage;
