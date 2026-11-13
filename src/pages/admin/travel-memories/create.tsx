import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { TravelMemoryForm } from "@/components/pages/travel-memories/travelMemoryForm";
import { useCreateTravelMemory } from "@/hooks/travel-memories/useCreateTravelMemory";
import type { ITravelMemoryFormSubmitData } from "@/types/pages/travel-memories/travelMemory";

export const TravelMemoryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createTravelMemory, isLoading, error: apiError } =
    useCreateTravelMemory();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (formData: ITravelMemoryFormSubmitData) => {
    const result = await createTravelMemory(formData);
    if (result.success) {
      navigate("/admin/travel-memories", {
        state: {
          successMessage: "Tạo mới kỷ niệm chuyến đi thành công.",
        },
      });
    } else {
      setSnackbar({
        open: true,
        message:
          result.error || apiError || "Tạo mới kỷ niệm chuyến đi thất bại.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/travel-memories");
  };

  return (
    <>
      <TravelMemoryForm
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

export default TravelMemoryCreatePage;
