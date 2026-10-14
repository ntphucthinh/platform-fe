import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { TravelMemoryForm } from "@/components/pages/travel-memories/travelMemoryForm";
import {
  getTravelMemoryById,
  updateTravelMemory,
} from "@/services/travelMemoryService";
import type { ITravelMemoryDay } from "@/types/pages/travel-memories/travelMemory";

export const TravelMemoryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const memory = id ? getTravelMemoryById(id) : undefined;

  if (!memory || !id) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <HeaderTitle>Không tìm thấy kỷ niệm</HeaderTitle>
        <CollectionsBookmarkOutlinedIcon
          sx={{ fontSize: 48, color: "#94A3B8", mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1E293B" }}>
          Chuyến đi không tồn tại hoặc đã bị xóa
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mt: 1, mb: 3 }}>
          Không thể tìm thấy thông tin chuyến đi để chỉnh sửa.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/travel-memories")}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
        >
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  const handleSubmit = (formData: {
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    description: string;
    coverImage: string;
    days: ITravelMemoryDay[];
  }) => {
    updateTravelMemory(id, formData);
    navigate(`/admin/travel-memories/${id}`);
  };

  const handleCancel = () => {
    navigate(`/admin/travel-memories/${id}`);
  };

  return (
    <TravelMemoryForm
      key={memory.id}
      initialData={memory}
      isEdit
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default TravelMemoryEditPage;
