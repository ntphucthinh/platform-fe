import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Snackbar, Alert, useTheme, useMediaQuery, CircularProgress } from "@mui/material";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { TravelMapHeader } from "@/components/pages/travel-map/travelMapHeader";
import { TravelMapFilters } from "@/components/pages/travel-map/travelMapFilters";
import { TravelLeafletMap } from "@/components/pages/travel-map/travelLeafletMap";
import { TravelMapListView } from "@/components/pages/travel-map/travelMapListView";
import { LocationDetailPanel } from "@/components/pages/travel-map/locationDetailPanel";
import { LocationFormDialog } from "@/components/pages/travel-map/locationFormDialog";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { useTravelLocationList } from "@/hooks/travel-map/useTravelLocationList";
import { useTravelLocationDetail } from "@/hooks/travel-map/useTravelLocationDetail";
import {
  getAvailableVisitYears,
  filterLocations,
} from "@/utils/travelMapUtils";
import { MOCK_TRAVEL_MAP_SUMMARY } from "@/constants/travelMap";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/services/travelMapService";
import { useSearchParams } from "react-router-dom";
import type {
  ILocation,
  ILocationFormData,
  ILocationFilterState,
  ILocationWithDetails,
} from "@/types/pages/travel-map/travelMap";

export function TravelMapPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const prefersReducedMotion = useMediaQuery(
    "@media (prefers-reduced-motion: reduce)",
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const initialViewMode = searchParams.get("view") === "list" ? "list" : "map";
  const initialSearch = searchParams.get("q") || "";
  const rawStatus = searchParams.get("status");
  const initialStatus =
    rawStatus === "Visited" || rawStatus === "Wishlist" ? rawStatus : "ALL";
  const rawYear = searchParams.get("year");
  const initialYear: number | "ALL" =
    rawYear && !Number.isNaN(Number(rawYear)) ? Number(rawYear) : "ALL";

  // 1. Data Hooks: Fetch locations list
  const {
    data: locations,
    isLoading: isLoadingLocations,
    error: locationsError,
    refetch: refetchLocations,
  } = useTravelLocationList();

  const [viewMode, setViewMode] = useState<"map" | "list">(initialViewMode);

  const rawSelected = searchParams.get("selected");
  const initialSelectedId =
    rawSelected && !isNaN(Number(rawSelected)) ? Number(rawSelected) : null;
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    initialSelectedId,
  );

  // Hook for single location detail
  const { data: detailData } = useTravelLocationDetail(selectedLocationId);

  // 2. Filters State
  const [filters, setFilters] = useState<ILocationFilterState>({
    search: initialSearch,
    status: initialStatus,
    year: initialYear,
  });

  // Sync state to URL search parameters for history & back navigation retention
  useEffect(() => {
    const params = new URLSearchParams();
    if (viewMode !== "map") params.set("view", viewMode);
    if (filters.search) params.set("q", filters.search);
    if (filters.status !== "ALL") params.set("status", filters.status);
    if (filters.year !== "ALL") params.set("year", String(filters.year));
    if (selectedLocationId !== null) params.set("selected", String(selectedLocationId));

    setSearchParams(params, { replace: true });
  }, [viewMode, filters, selectedLocationId, setSearchParams]);

  // 3. Dialog & Notification States
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<ILocation | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // 4. Computed Derived Data: Giữ data mock cho 4 card thống kê theo yêu cầu (chờ API riêng sau này)
  const summary = MOCK_TRAVEL_MAP_SUMMARY;
  const availableYears = useMemo(() => {
    const years = getAvailableVisitYears(locations);
    return years.length > 0 ? years : [2026, 2025, 2024, 2023, 2022];
  }, [locations]);

  // Filtered locations
  const filteredLocations = useMemo(
    () => filterLocations(locations, filters),
    [locations, filters],
  );

  // Selected Location with details: prefer fetchedDetail, fallback to list item
  const selectedLocationDetails = useMemo<ILocationWithDetails | null>(() => {
    if (selectedLocationId === null) return null;
    if (detailData && detailData.id === selectedLocationId) {
      return detailData;
    }
    const target = locations.find((l) => l.id === selectedLocationId);
    return target ?? null;
  }, [selectedLocationId, detailData, locations]);

  // Handle location selection
  const handleSelectLocation = useCallback((id: number) => {
    setSelectedLocationId(id);
  }, []);

  const handleCloseDetailPanel = useCallback(() => {
    setSelectedLocationId(null);
  }, []);

  // Handlers for Add / Edit
  const handleOpenCreate = () => {
    setEditingLocation(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (loc: ILocationWithDetails) => {
    setEditingLocation(loc);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (formData: ILocationFormData) => {
    if (editingLocation) {
      const updated = updateLocation(editingLocation.id, formData);
      if (updated) {
        await refetchLocations();
        setSnackbar({
          open: true,
          message: `Đã cập nhật địa điểm "${updated.name}" thành công!`,
          severity: "success",
        });
      }
    } else {
      const created = createLocation(formData);
      setSelectedLocationId(created.id);
      await refetchLocations();
      setSnackbar({
        open: true,
        message: `Đã thêm địa điểm "${created.name}" vào bản đồ!`,
        severity: "success",
      });
    }
  };

  // Handlers for Delete
  const handleRequestDelete = (id: number, name: string) => {
    setLocationToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete.id);
      if (selectedLocationId === locationToDelete.id) {
        setSelectedLocationId(null);
      }
      await refetchLocations();
      setSnackbar({
        open: true,
        message: `Đã xóa địa điểm "${locationToDelete.name}" thành công!`,
        severity: "success",
      });
    }
    setDeleteConfirmOpen(false);
    setLocationToDelete(null);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "ALL",
      year: "ALL",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        width: "100%",
        pb: 6,
      }}
    >
      <HeaderTitle>Bản đồ hành trình</HeaderTitle>

      {/* 1. Page Header & 4 Metrics */}
      <TravelMapHeader
        summary={summary}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={handleOpenCreate}
      />

      {/* 2. Search & Filters Bar */}
      <TravelMapFilters
        filters={filters}
        availableYears={availableYears}
        totalLocations={locations.length}
        filteredCount={filteredLocations.length}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Error state if fetch failed */}
      {locationsError && (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>
          Lỗi khi tải danh sách địa điểm: {locationsError}
        </Alert>
      )}

      {/* Loading state indicator */}
      {isLoadingLocations && locations.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
            bgcolor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E2E8F0",
          }}
        >
          <CircularProgress size={36} />
        </Box>
      ) : viewMode === "map" ? (
        /* 3. Main Workspace Area: Map or List View */
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2.5,
            height: { xs: "auto", md: "calc(100vh - 350px)" },
            minHeight: { xs: 480, md: 620 },
            position: "relative",
          }}
        >
          {/* Leaflet Map Canvas (70% width on desktop when panel open, 100% when closed) */}
          <Box
            sx={{
              flex: selectedLocationDetails
                ? { xs: "1 1 auto", md: "0 0 calc(70% - 14px)" }
                : "1 1 100%",
              width: selectedLocationDetails
                ? { xs: "100%", md: "calc(70% - 14px)" }
                : "100%",
              minWidth: 0,
              height: "100%",
              transition: prefersReducedMotion
                ? "none"
                : "width 320ms cubic-bezier(0.22, 1, 0.36, 1), flex 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <TravelLeafletMap
              locations={filteredLocations}
              selectedLocationId={selectedLocationId}
              onSelectLocation={handleSelectLocation}
              onSwitchToList={() => setViewMode("list")}
              panelOpen={Boolean(selectedLocationDetails)}
            />
          </Box>

          {/* Location Detail Panel */}
          <LocationDetailPanel
            location={selectedLocationDetails}
            open={Boolean(selectedLocationDetails)}
            onClose={handleCloseDetailPanel}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
            isMobile={isMobile}
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            minHeight: { xs: 520, sm: 640, md: 720 },
          }}
        >
          {/* List View */}
          <Box
            sx={{
              pointerEvents:
                Boolean(selectedLocationDetails) && !isMobile ? "none" : "auto",
            }}
            aria-hidden={Boolean(selectedLocationDetails) && !isMobile}
          >
            <TravelMapListView
              locations={filteredLocations}
              selectedLocationId={selectedLocationId}
              onSelectLocation={handleSelectLocation}
              onResetFilters={handleResetFilters}
              filters={filters}
            />
          </Box>

          {/* Detail Panel in list view */}
          <LocationDetailPanel
            location={selectedLocationDetails}
            open={Boolean(selectedLocationDetails)}
            onClose={handleCloseDetailPanel}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
            isMobile={isMobile}
            variant="inline"
          />
        </Box>
      )}

      {/* 4. Add / Edit Location Dialog */}
      <LocationFormDialog
        open={formDialogOpen}
        initialData={editingLocation}
        existingLocations={locations}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingLocation(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* 5. Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        title="Xác nhận xóa địa điểm"
        message={`Bạn có chắc chắn muốn xóa địa điểm "${
          locationToDelete?.name || ""
        }" khỏi bản đồ? Các chuyến đi và kỷ niệm liên quan sẽ không bị xóa.`}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setLocationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* 6. Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export { TravelMapPage as AdminTravelMapPage };
export default TravelMapPage;
