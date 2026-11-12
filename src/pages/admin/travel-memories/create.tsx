import React from "react";
import { useNavigate } from "react-router-dom";
import { TravelMemoryForm } from "@/components/pages/travel-memories/travelMemoryForm";
import type { ITravelMemoryDay } from "@/types/pages/travel-memories/travelMemory";

export const TravelMemoryCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData: {
    title: string;
    destination: string;
    locationId?: number | null;
    startDate: string;
    endDate: string;
    description: string;
    coverImage: string;
    days: ITravelMemoryDay[];
  }) => {
    console.log("Create Travel Memory submit formData:", formData);
    navigate("/admin/travel-memories");
  };

  const handleCancel = () => {
    navigate("/admin/travel-memories");
  };

  return <TravelMemoryForm onSubmit={handleSubmit} onCancel={handleCancel} />;
};

export default TravelMemoryCreatePage;
