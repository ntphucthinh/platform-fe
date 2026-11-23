import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import { useTravelLocationDetail } from "@/hooks/travel-map/useTravelLocationDetail";
import { useTravelLocationList } from "@/hooks/travel-map/useTravelLocationList";
import { useUpdateTravelLocation } from "@/hooks/travel-map/useUpdateTravelLocation";
import type { ILocationFormData } from "@/types/pages/travel-map/travelMap";
import { LocationStatus } from "@/constants/travelMap";
import { LocationFormDialog } from "@/components/pages/travel-map/locationFormDialog";
import { LocationDetailNotFound } from "@/components/pages/travel-map/detail/locationDetailNotFound";
import { LocationDetailHeader } from "@/components/pages/travel-map/detail/locationDetailHeader";
import { LocationDetailHero } from "@/components/pages/travel-map/detail/locationDetailHero";
import { LocationDetailMetrics } from "@/components/pages/travel-map/detail/locationDetailMetrics";
import { LocationDetailMemories } from "@/components/pages/travel-map/detail/locationDetailMemories";
import { LocationDetailItineraries } from "@/components/pages/travel-map/detail/locationDetailItineraries";
import { LocationDetailNotes } from "@/components/pages/travel-map/detail/locationDetailNotes";

export const TravelMapDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    const state = routerLocation.state as { from?: string } | null;
    if (state?.from) {
      navigate(state.from);
    } else {
      navigate("/admin/travel-map");
    }
  };

  const numericId = id && !isNaN(Number(id)) ? Number(id) : null;
  const {
    data: details,
    isLoading,
    error,
    refetch,
  } = useTravelLocationDetail(numericId);
  const { data: allLocations } = useTravelLocationList();
  const { updateLocation } = useUpdateTravelLocation();

  const { showSuccess, handleShowError } = useCustomOpenNotification();
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleEditSubmit = async (formData: ILocationFormData) => {
    if (!numericId) return;
    const {
      data: updated,
      error: updateErr,
      rawError,
    } = await updateLocation(numericId, formData);
    if (updated) {
      showSuccess("Cập nhật điểm đến thành công!");
      setFormDialogOpen(false);
      refetch();
    } else {
      handleShowError(rawError || updateErr, "Cập nhật điểm đến thất bại");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          py: 12,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <HeaderTitle>Chi tiết điểm đến</HeaderTitle>
        <CircularProgress size={44} color="primary" />
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Đang tải thông tin điểm đến...
        </Typography>
      </Box>
    );
  }

  if (error || !details) {
    return (
      <LocationDetailNotFound
        error={error}
        onBack={handleBack}
        onRetry={refetch}
      />
    );
  }

  const isVisited = details.status === LocationStatus.Visited;
  const displayName = details.locationName || details.name || "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2.5, sm: 3.5 },
        pb: { xs: 4, sm: 6 },
      }}
    >
      <HeaderTitle>{displayName}</HeaderTitle>

      {/* 1. Header & Actions */}
      <LocationDetailHeader
        locationName={displayName}
        onBack={handleBack}
        onEdit={() => setFormDialogOpen(true)}
      />

      {/* 2. Hero Banner */}
      <LocationDetailHero details={details} isVisited={isVisited} />

      {/* 3. Metrics Strip */}
      <LocationDetailMetrics details={details} />

      {/* 4. Travel Memories */}
      <LocationDetailMemories details={details} isVisited={isVisited} />

      {/* 5. Related Itineraries */}
      <LocationDetailItineraries details={details} />

      {/* 6. Detailed Location Info & Personal Notes */}
      <LocationDetailNotes details={details} />

      {/* 7. Edit Location Dialog */}
      <LocationFormDialog
        open={formDialogOpen}
        initialData={details}
        existingLocations={allLocations}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </Box>
  );
};

export { TravelMapDetailPage as AdminTravelMapDetailPage };
export default TravelMapDetailPage;
