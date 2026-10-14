import React from "react";
import { useNavigate } from "react-router-dom";
import { TravelMemoryForm } from "@/components/pages/travel-memories/travelMemoryForm";
import { createTravelMemory } from "@/services/travelMemoryService";
import type { ITravelMemoryDay } from "@/types/pages/travel-memories/travelMemory";

export const TravelMemoryCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (formData: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    description: string;
    coverImage: string;
    days: ITravelMemoryDay[];
  }) => {
    const created = createTravelMemory(formData);
    navigate(`/admin/travel-memories/${created.id}`);
  };

  const handleCancel = () => {
    navigate("/admin/travel-memories");
  };

  return <TravelMemoryForm onSubmit={handleSubmit} onCancel={handleCancel} />;
};

export default TravelMemoryCreatePage;
