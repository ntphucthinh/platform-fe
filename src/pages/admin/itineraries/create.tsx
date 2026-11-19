import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { ItineraryForm } from "@/components/pages/itineraries/itineraryForm";
import { useCreateItinerary } from "@/hooks/itineraries/useCreateItinerary";
import type { ICreateItineraryInput } from "@/types/pages/itineraries/itinerary";

export const ItineraryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    createItinerary,
    isLoading,
    error: apiError,
  } = useCreateItinerary();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (formData: ICreateItineraryInput) => {
    const result = await createItinerary(formData);
    if (result.success) {
      navigate("/admin/itineraries", {
        state: {
          successMessage: "Tạo lịch trình mới thành công.",
        },
      });
    } else {
      setSnackbar({
        open: true,
        message:
          result.error || apiError || "Tạo lịch trình mới thất bại.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/itineraries");
  };

  return (
    <>
      <ItineraryForm
        isLoading={isLoading}
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

export default ItineraryCreatePage;
