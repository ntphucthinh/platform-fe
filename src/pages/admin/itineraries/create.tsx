import React from "react";
import { useNavigate } from "react-router-dom";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import { ItineraryForm } from "@/components/pages/itineraries/itineraryForm";
import { useCreateItinerary } from "@/hooks/itineraries/useCreateItinerary";
import type { ICreateItineraryInput } from "@/types/pages/itineraries/itinerary";

export const ItineraryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, handleShowError } = useCustomOpenNotification();
  const {
    createItinerary,
    isLoading,
    error: apiError,
  } = useCreateItinerary();

  const handleSubmit = async (formData: ICreateItineraryInput) => {
    const result = await createItinerary(formData);
    if (result.success) {
      showSuccess("Tạo lịch trình mới thành công.");
      navigate("/admin/itineraries");
    } else {
      handleShowError(
        result.rawError || result.error || apiError,
        "Tạo lịch trình mới thất bại.",
      );
    }
  };

  const handleCancel = () => {
    navigate("/admin/itineraries");
  };

  return (
    <ItineraryForm
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default ItineraryCreatePage;
