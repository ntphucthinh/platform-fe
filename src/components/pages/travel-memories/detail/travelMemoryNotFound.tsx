import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import { HeaderTitle } from "@/components/ui/header/headerTitle";

export interface TravelMemoryNotFoundProps {
  error?: string | null;
  onBack: () => void;
  onRetry?: () => void;
}

export const TravelMemoryNotFound: React.FC<TravelMemoryNotFoundProps> = ({
  error,
  onBack,
  onRetry,
}) => {
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
        {error || "Chuyến đi không tồn tại hoặc đã bị xóa"}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mt: 1, mb: 3 }}
      >
        {error
          ? "Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại hoặc quay lại danh sách."
          : "Không tìm thấy dữ liệu kỷ niệm chuyến đi được yêu cầu."}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {error && onRetry && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
            sx={{ borderRadius: "8px", textTransform: "none" }}
          >
            Thử lại
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ borderRadius: "8px", textTransform: "none" }}
        >
          Quay lại danh sách
        </Button>
      </Box>
    </Box>
  );
};
