import React from "react";
import { Card, Typography, CircularProgress } from "@mui/material";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";

export interface TravelMemoryEmptyStateProps {
  isLoading?: boolean;
  isFiltered?: boolean;
}

export const TravelMemoryEmptyState: React.FC<TravelMemoryEmptyStateProps> = ({
  isLoading = false,
  isFiltered = false,
}) => {
  if (isLoading) {
    return (
      <Card
        elevation={0}
        sx={{
          py: 8,
          px: 3,
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          bgcolor: "#FFFFFF",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={36} color="primary" />
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Đang tải danh sách kỷ niệm chuyến đi...
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        py: 6,
        px: 3,
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: "14px",
        bgcolor: "background.paper",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <CollectionsBookmarkOutlinedIcon
        sx={{ fontSize: 48, color: "text.secondary" }}
      />
      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
        Không tìm thấy chuyến đi nào
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", maxWidth: 460 }}
      >
        {isFiltered
          ? "Không có chuyến đi nào phù hợp với bộ lọc hiện tại. Thử thay đổi hoặc xóa bộ lọc."
          : "Bạn chưa có chuyến đi nào được lưu giữ. Hãy bấm '+ Thêm chuyến đi' để tạo kỷ niệm đầu tiên!"}
      </Typography>
    </Card>
  );
};
