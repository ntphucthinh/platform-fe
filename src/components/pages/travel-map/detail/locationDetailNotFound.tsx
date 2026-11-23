import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOffOutlinedIcon from "@mui/icons-material/LocationOffOutlined";
import { HeaderTitle } from "@/components/ui/header/headerTitle";

export interface LocationDetailNotFoundProps {
  error?: string | null;
  onBack: () => void;
  onRetry?: () => void;
}

export const LocationDetailNotFound: React.FC<LocationDetailNotFoundProps> = ({
  error,
  onBack,
  onRetry,
}) => {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <HeaderTitle>Không tìm thấy điểm đến</HeaderTitle>
      <LocationOffOutlinedIcon
        sx={{ fontSize: 56, color: "#94A3B8", mb: 2 }}
      />
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#0F172A", mb: 1 }}
      >
        {error || "Điểm đến không tồn tại hoặc đã bị xóa"}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#64748B", maxWidth: 440, mx: "auto", mb: 3 }}
      >
        {error
          ? "Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại."
          : "Không tìm thấy dữ liệu điểm đến tương ứng với mã định danh được yêu cầu."}
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
          Quay lại bản đồ
        </Button>
      </Box>
    </Box>
  );
};
