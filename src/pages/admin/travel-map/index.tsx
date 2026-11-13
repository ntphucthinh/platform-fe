import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { TravelMapHeader } from "@/components/pages/travel-map/travelMapHeader";
import { TravelLeafletMap } from "@/components/pages/travel-map/travelLeafletMap";
import { TravelMapListView } from "@/components/pages/travel-map/travelMapListView";
import { LocationDetailPanel } from "@/components/pages/travel-map/locationDetailPanel";
import { LocationFormDialog } from "@/components/pages/travel-map/locationFormDialog";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { useTravelLocationList } from "@/hooks/travel-map/useTravelLocationList";
import { useTravelLocationDetail } from "@/hooks/travel-map/useTravelLocationDetail";
import { useCreateTravelLocation } from "@/hooks/travel-map/useCreateTravelLocation";
import { useUpdateTravelLocation } from "@/hooks/travel-map/useUpdateTravelLocation";
import { useDeleteTravelLocation } from "@/hooks/travel-map/useDeleteTravelLocation";
import { filterLocations } from "@/utils/travelMapUtils";
import { LocationStatus } from "@/constants/travelMap";
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
  const rawStatus = searchParams.get("status");
  const initialStatus: LocationStatus | undefined =
    rawStatus === LocationStatus.Visited ||
    rawStatus === LocationStatus.Wishlist ||
    rawStatus?.toLowerCase() === LocationStatus.Visited ||
    rawStatus?.toLowerCase() === LocationStatus.Wishlist
      ? (rawStatus.toLowerCase() as LocationStatus)
      : undefined;
  const rawCountry = searchParams.get("country");
  const initialCountry = rawCountry ? rawCountry.toUpperCase() : null;

  // State chọn quốc gia để nhảy tới, highlight & lọc dữ liệu theo query param API
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    initialCountry,
  );

  // 1. Filters State (Chỉ giữ lọc quốc gia và trạng thái theo backend API)
  const [filters, setFilters] = useState<ILocationFilterState>({
    status: initialStatus,
  });

  // 2. Data Hooks: Fetch locations list (hỗ trợ lọc trực tiếp từ backend khi có filter)
  const {
    data: locations,
    isLoading: isLoadingLocations,
    error: locationsError,
    refetch: refetchLocations,
  } = useTravelLocationList({
    status: filters.status,
    countryCode: selectedCountryCode || undefined,
  });

  const { createLocation } = useCreateTravelLocation();
  const { updateLocation } = useUpdateTravelLocation();
  const { deleteLocation } = useDeleteTravelLocation();

  const [viewMode, setViewMode] = useState<"map" | "list">(initialViewMode);

  const rawSelected = searchParams.get("selected");
  const initialSelectedId =
    rawSelected && !isNaN(Number(rawSelected)) ? Number(rawSelected) : null;
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    initialSelectedId,
  );

  // Hook for single location detail
  const { data: detailData, refetch: refetchDetail } =
    useTravelLocationDetail(selectedLocationId);

  // Sync state to URL search parameters for history & back navigation retention
  useEffect(() => {
    const params = new URLSearchParams();
    if (viewMode !== "map") params.set("view", viewMode);
    if (filters.status) params.set("status", filters.status);
    if (selectedCountryCode) params.set("country", selectedCountryCode);
    if (selectedLocationId !== null)
      params.set("selected", String(selectedLocationId));

    setSearchParams(params, { replace: true });
  }, [
    viewMode,
    filters.status,
    selectedCountryCode,
    selectedLocationId,
    setSearchParams,
  ]);

  // 3. Dialog & Notification States
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<ILocation | null>(
    null,
  );

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<{
    id: number;
    name?: string;
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

  // 4. Computed Derived Data: Thống kê trực tiếp từ danh sách địa điểm thực tế
  const counts = useMemo(() => {
    let visited = 0;
    let wishlist = 0;
    for (const loc of locations) {
      if (loc.status === LocationStatus.Visited) visited++;
      else if (loc.status === LocationStatus.Wishlist) wishlist++;
    }
    return {
      total: locations.length,
      visited,
      wishlist,
    };
  }, [locations]);

  // Filtered locations (client-side fallback / local filter)
  const filteredLocations = useMemo(
    () =>
      filterLocations(locations, {
        status: filters.status,
        countryCode: selectedCountryCode || undefined,
      }),
    [locations, filters.status, selectedCountryCode],
  );

  // Selected Location with details: merge target from locations list and detailData
  const selectedLocationDetails = useMemo<ILocationWithDetails | null>(() => {
    if (selectedLocationId === null) return null;
    const target = locations.find((l) => l.id === selectedLocationId);
    const detail =
      detailData && detailData.id === selectedLocationId ? detailData : null;

    if (!target && !detail) return null;
    if (!detail) return target ?? null;
    if (!target) return detail;

    return {
      ...detail,
      ...target,
    };
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
      const { data: updated, error } = await updateLocation(
        editingLocation.id,
        formData,
      );
      if (error) {
        setSnackbar({
          open: true,
          message: error,
          severity: "error",
        });
        return { success: false, error };
      }
      if (updated) {
        await Promise.all([refetchLocations(), refetchDetail()]);
        setSnackbar({
          open: true,
          message: `Đã cập nhật địa điểm thành công!`,
          severity: "success",
        });
        return { success: true };
      }
      return { success: false, error: "Không thể cập nhật địa điểm" };
    } else {
      const { data: created, error } = await createLocation(formData);
      if (error) {
        setSnackbar({
          open: true,
          message: error,
          severity: "error",
        });
        return { success: false, error };
      }
      if (created) {
        setSelectedLocationId(created.id);
        await refetchLocations();
        setSnackbar({
          open: true,
          message: `Đã thêm địa điểm vào bản đồ!`,
          severity: "success",
        });
        return { success: true };
      }
      return { success: false, error: "Không thể tạo mới địa điểm" };
    }
  };

  // Handlers for Delete
  const handleRequestDelete = (id: number, name?: string) => {
    const loc = locations.find((l) => l.id === id);
    setLocationToDelete({
      id,
      name: name || loc?.locationName || loc?.name || "",
    });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (locationToDelete) {
      const { success, error } = await deleteLocation(locationToDelete.id);
      if (error) {
        setSnackbar({
          open: true,
          message: error,
          severity: "error",
        });
      } else if (success) {
        if (selectedLocationId === locationToDelete.id) {
          setSelectedLocationId(null);
        }
        await refetchLocations();
        setSnackbar({
          open: true,
          message: `Đã xóa địa điểm thành công!`,
          severity: "success",
        });
      }
    }
    setDeleteConfirmOpen(false);
    setLocationToDelete(null);
  };

  const handleResetFilters = () => {
    setFilters({
      status: undefined,
    });
    setSelectedCountryCode(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.25, sm: 2 },
        width: "100%",
        flex: 1,
        minHeight: 0,
        pb: viewMode === "map" ? { xs: 0, sm: 4 } : { xs: 2, sm: 4 },
      }}
    >
      <HeaderTitle>Bản đồ hành trình</HeaderTitle>

      {/* 1. Unified Distilled Toolbar */}
      <TravelMapHeader
        totalLocations={counts.total}
        visitedLocations={counts.visited}
        wishlistLocations={counts.wishlist}
        selectedStatus={filters.status}
        selectedCountryCode={selectedCountryCode}
        onStatusChange={(status) => setFilters({ status })}
        onSelectCountry={setSelectedCountryCode}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={handleOpenCreate}
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
        /* 2. Main Workspace Area: Map or List View */
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2.5,
            flex: 1,
            minHeight: { xs: 360, sm: 550, md: 660 },
            height: {
              xs: "calc(100dvh - 215px - env(safe-area-inset-bottom, 0px))",
              sm: "calc(100dvh - 235px)",
              md: "calc(100vh - 185px)",
            },
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
              display: "flex",
              flexDirection: "column",
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
              selectedCountryCode={selectedCountryCode}
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
              filters={{
                ...filters,
                countryCode: selectedCountryCode || undefined,
              }}
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
        message="Bạn có chắc chắn muốn xóa địa điểm này khỏi bản đồ? Các chuyến đi và kỷ niệm liên quan sẽ không bị xóa."
        onClose={() => {
          setDeleteConfirmOpen(false);
          setLocationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* 6. Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
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
