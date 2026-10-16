import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { TravelMapHeader } from "@/components/pages/travel-map/travelMapHeader";
import { TravelMapFilters } from "@/components/pages/travel-map/travelMapFilters";
import { TravelLeafletMap } from "@/components/pages/travel-map/travelLeafletMap";
import { TravelMapListView } from "@/components/pages/travel-map/travelMapListView";
import { LocationDetailPanel } from "@/components/pages/travel-map/locationDetailPanel";
import { LocationFormDialog } from "@/components/pages/travel-map/locationFormDialog";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import {
  getLocations,
  subscribeTravelMap,
  getTravelMapSummary,
  getAvailableVisitYears,
  filterLocations,
  getLocationWithDetails,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/services/travelMapService";
import { subscribeTravelMemories } from "@/services/travelMemoryService";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const initialViewMode =
    searchParams.get("view") === "list" ? "list" : "map";
  const initialSearch = searchParams.get("q") || "";
  const rawStatus = searchParams.get("status");
  const initialStatus =
    rawStatus === "Visited" || rawStatus === "Wishlist" ? rawStatus : "ALL";
  const rawYear = searchParams.get("year");
  const initialYear: number | "ALL" =
    rawYear && !Number.isNaN(Number(rawYear)) ? Number(rawYear) : "ALL";

  // 1. Data Store States
  const [locations, setLocations] = useState<ILocation[]>(getLocations());
  const [viewMode, setViewMode] = useState<"map" | "list">(initialViewMode);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    searchParams.get("selected") || null,
  );

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
    if (selectedLocationId) params.set("selected", selectedLocationId);

    setSearchParams(params, { replace: true });
  }, [viewMode, filters, selectedLocationId, setSearchParams]);

  // 3. Dialog & Notification States
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<ILocation | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<{
    id: string;
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

  // 4. Subscriptions to Travel Map & Travel Memories
  useEffect(() => {
    const unsubMap = subscribeTravelMap(() => {
      setLocations(getLocations());
    });
    const unsubMemories = subscribeTravelMemories(() => {
      setLocations(getLocations());
    });

    return () => {
      unsubMap();
      unsubMemories();
    };
  }, []);

  // 5. Computed Derived Data
  const summary = useMemo(() => getTravelMapSummary(locations), [locations]);
  const availableYears = useMemo(
    () => getAvailableVisitYears(locations),
    [locations],
  );

  // Filtered locations
  const filteredLocations = useMemo(
    () => filterLocations(locations, filters),
    [locations, filters],
  );

  // Filtered locations with details (stats, memories, itineraries)
  const locationsWithDetails = useMemo<ILocationWithDetails[]>(() => {
    return filteredLocations.map((loc) => getLocationWithDetails(loc));
  }, [filteredLocations]);

  // Selected Location with details
  const selectedLocationDetails = useMemo<ILocationWithDetails | null>(() => {
    if (!selectedLocationId) return null;
    const target = locations.find((l) => l.id === selectedLocationId);
    return target ? getLocationWithDetails(target) : null;
  }, [selectedLocationId, locations]);

  // Handle location selection
  const handleSelectLocation = useCallback((id: string) => {
    setSelectedLocationId((prev) => (prev === id ? id : id));
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

  const handleFormSubmit = (formData: ILocationFormData) => {
    if (editingLocation) {
      const updated = updateLocation(editingLocation.id, formData);
      if (updated) {
        setSnackbar({
          open: true,
          message: `Đã cập nhật địa điểm "${updated.name}" thành công!`,
          severity: "success",
        });
      }
    } else {
      const created = createLocation(formData);
      setSelectedLocationId(created.id);
      setSnackbar({
        open: true,
        message: `Đã thêm địa điểm "${created.name}" vào bản đồ!`,
        severity: "success",
      });
    }
  };

  // Handlers for Delete
  const handleRequestDelete = (id: string, name: string) => {
    setLocationToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete.id);
      if (selectedLocationId === locationToDelete.id) {
        setSelectedLocationId(null);
      }
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

      {/* 3. Main Workspace Area: Map or List View */}
      {viewMode === "map" ? (
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
          {/* Leaflet Map Canvas */}
          <Box sx={{ flex: 1, minWidth: 0, height: "100%" }}>
            <TravelLeafletMap
              locations={locationsWithDetails}
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TravelMapListView
            locations={locationsWithDetails}
            selectedLocationId={selectedLocationId}
            onSelectLocation={handleSelectLocation}
            onResetFilters={handleResetFilters}
          />

          {/* Detail Panel in list view */}
          <LocationDetailPanel
            location={selectedLocationDetails}
            open={Boolean(selectedLocationDetails)}
            onClose={handleCloseDetailPanel}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
            isMobile={isMobile}
          />
        </Box>
      )}

      {/* 4. Add / Edit Location Dialog */}
      <LocationFormDialog
        open={formDialogOpen}
        initialData={editingLocation}
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
        message={`Bạn có chắc chắn muốn xóa địa điểm "${locationToDelete?.name || ""}" khỏi bản đồ? Các chuyến đi và kỷ niệm liên quan sẽ không bị xóa.`}
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
