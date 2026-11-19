import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { ItineraryForm } from "@/components/pages/itineraries/itineraryForm";
import { ItineraryNotFound } from "@/components/pages/itineraries/preview/itineraryNotFound";
import { useItineraryDetail } from "@/hooks/itineraries/useItineraryDetail";
import { useUpdateItinerary } from "@/hooks/itineraries/useUpdateItinerary";
import type { ICreateItineraryInput } from "@/types/pages/itineraries/itinerary";

export const ItineraryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: itinerary, isLoading: isFetching } = useItineraryDetail(id);
  const {
    updateItinerary,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateItinerary();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

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
      navigate(`/admin/itineraries/${itinerary.id}/detail`, {
        state: {
          successMessage: "Cập nhật lịch trình thành công.",
        },
      });
    } else {
      setSnackbar({
        open: true,
        message:
          result.error || updateError || "Cập nhật lịch trình thất bại.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate(`/admin/itineraries/${itinerary.id}/detail`);
  };

  return (
    <>
      <ItineraryForm
        key={itinerary.id}
        initialData={itinerary}
        isEdit
        isLoading={isUpdating}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

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
    </>
  );
};

export default ItineraryEditPage;
