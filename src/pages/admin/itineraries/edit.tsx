import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import { ItineraryForm } from "@/components/pages/itineraries/itineraryForm";
import { ItineraryNotFound } from "@/components/pages/itineraries/preview/itineraryNotFound";
import { useItineraryDetail } from "@/hooks/itineraries/useItineraryDetail";
import { useUpdateItinerary } from "@/hooks/itineraries/useUpdateItinerary";
import type { ICreateItineraryInput } from "@/types/pages/itineraries/itinerary";

export const ItineraryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, handleShowError } = useCustomOpenNotification();
  const { data: itinerary, isLoading: isFetching } = useItineraryDetail(id);
  const {
    updateItinerary,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateItinerary();

  if (isFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 320,
        }}
      >
        <CircularProgress size={36} color="primary" />
      </Box>
    );
  }

  if (!itinerary || !id) {
    return (
      <ItineraryNotFound
        message={`Không tìm thấy lịch trình du lịch cho mã "${id || ""}" để chỉnh sửa.`}
      />
    );
  }

  const handleSubmit = async (formData: ICreateItineraryInput) => {
    const result = await updateItinerary(itinerary.id, formData);
    if (result.success) {
      showSuccess("Cập nhật lịch trình thành công.");
      navigate(`/admin/itineraries/${itinerary.id}/detail`);
    } else {
      handleShowError(
        result.rawError || result.error || updateError,
        "Cập nhật lịch trình thất bại.",
      );
    }
  };

  const handleCancel = () => {
    navigate(`/admin/itineraries/${itinerary.id}/detail`);
  };

  return (
    <ItineraryForm
      key={itinerary.id}
      initialData={itinerary}
      isEdit
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default ItineraryEditPage;
