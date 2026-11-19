import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { TravelMemoryForm } from "@/components/pages/travel-memories/travelMemoryForm";
import { useTravelMemoryDetail } from "@/hooks/travel-memories/useTravelMemoryDetail";
import { useUpdateTravelMemory } from "@/hooks/travel-memories/useUpdateTravelMemory";
import type { ITravelMemoryFormSubmitData } from "@/types/pages/travel-memories/travelMemory";

export const TravelMemoryEditPage: React.FC = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : null;
  const navigate = useNavigate();

  const {
    data: memory,
    isLoading: isFetching,
    error: fetchError,
  } = useTravelMemoryDetail(numericId && !isNaN(numericId) ? numericId : null);

  const { showSuccess, handleShowError } = useCustomOpenNotification();
  const {
    updateTravelMemory,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateTravelMemory();

  if (isFetching) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress size={36} color="primary" />
      </Box>
    );
  }

  if (!memory || !numericId || fetchError) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <HeaderTitle>Không tìm thấy kỷ niệm</HeaderTitle>
        <CollectionsBookmarkOutlinedIcon
          sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
        />
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Chuyến đi không tồn tại hoặc đã bị xóa
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mt: 1, mb: 3 }}
        >
          Không thể tìm thấy thông tin chuyến đi để chỉnh sửa.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/travel-memories")}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  const handleSubmit = async (formData: ITravelMemoryFormSubmitData) => {
    const result = await updateTravelMemory(numericId, formData);
    if (result.success) {
      showSuccess("Cập nhật kỷ niệm chuyến đi thành công.");
      navigate(`/admin/travel-memories/${numericId}`);
    } else {
      handleShowError(
        result.rawError || result.error || updateError,
        "Cập nhật kỷ niệm chuyến đi thất bại."
      );
    }
  };

  const handleCancel = () => {
    navigate(`/admin/travel-memories/${numericId}`);
  };

  return (
    <TravelMemoryForm
      key={memory.id}
      initialData={memory}
      isEdit
      isLoading={isUpdating}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default TravelMemoryEditPage;
