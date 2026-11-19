import React from "react";
import { useNavigate } from "react-router-dom";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import { TravelMemoryForm } from "@/components/pages/travel-memories/travelMemoryForm";
import { useCreateTravelMemory } from "@/hooks/travel-memories/useCreateTravelMemory";
import type { ITravelMemoryFormSubmitData } from "@/types/pages/travel-memories/travelMemory";

export const TravelMemoryCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, handleShowError } = useCustomOpenNotification();
  const { createTravelMemory, isLoading, error: apiError } =
    useCreateTravelMemory();

  const handleSubmit = async (formData: ITravelMemoryFormSubmitData) => {
    const result = await createTravelMemory(formData);
    if (result.success) {
      showSuccess("Tạo mới kỷ niệm chuyến đi thành công.");
      navigate("/admin/travel-memories");
    } else {
      handleShowError(
        result.rawError || result.error || apiError,
        "Tạo mới kỷ niệm chuyến đi thất bại.",
      );
    }
  };

  const handleCancel = () => {
    navigate("/admin/travel-memories");
  };

  return (
    <TravelMemoryForm
      isLoading={isLoading}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default TravelMemoryCreatePage;
