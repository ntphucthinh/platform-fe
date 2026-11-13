import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
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

  const {
    updateTravelMemory,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateTravelMemory();

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
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress size={36} sx={{ color: "#2563EB" }} />
      </Box>
    );
  }

  if (!memory || !numericId || fetchError) {
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

  const handleSubmit = async (formData: ITravelMemoryFormSubmitData) => {
    const result = await updateTravelMemory(numericId, formData);
    if (result.success) {
      navigate(`/admin/travel-memories/${numericId}`, {
        state: {
          successMessage: "Cập nhật kỷ niệm chuyến đi thành công.",
        },
      });
    } else {
      setSnackbar({
        open: true,
        message:
          result.error || updateError || "Cập nhật kỷ niệm chuyến đi thất bại.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate(`/admin/travel-memories/${numericId}`);
  };

  return (
    <>
      <TravelMemoryForm
        key={memory.id}
        initialData={memory}
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

export default TravelMemoryEditPage;
