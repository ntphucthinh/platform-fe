import React from "react";
import {
  Card,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface TravelMemoryCoverImageProps {
  coverImage: string;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  onCoverFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCover: () => void;
}

export const TravelMemoryCoverImage: React.FC<TravelMemoryCoverImageProps> = ({
  coverImage,
  coverInputRef,
  onCoverFileChange,
  onRemoveCover,
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
            Ảnh bìa chuyến đi
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Một hình ảnh đại diện tiêu biểu nhất cho toàn bộ chuyến đi.
          </Typography>
        </Box>

        {coverImage && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlinedIcon />}
            onClick={onRemoveCover}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Xóa ảnh bìa
          </Button>
        )}
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={coverInputRef}
        accept="image/png,image/jpeg,image/webp"
        style={{ display: "none" }}
        onChange={onCoverFileChange}
      />

      {coverImage ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 220, sm: 320 },
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            mt: 2,
          }}
        >
          <Box
            component="img"
            src={coverImage}
            alt="Ảnh bìa chuyến đi"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = DEFAULT_NO_IMAGE;
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => coverInputRef.current?.click()}
            sx={{
              position: "absolute",
              bottom: 14,
              right: 14,
              bgcolor: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(4px)",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": { bgcolor: "rgba(15, 23, 42, 0.95)" },
            }}
          >
            Thay đổi ảnh bìa
          </Button>
        </Box>
      ) : (
        <Box
          onClick={() => coverInputRef.current?.click()}
          sx={{
            mt: 2,
            p: 4,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: "12px",
            bgcolor: "background.default",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "#EFF6FF",
            },
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
          tabIndex={0}
          role="button"
          aria-label="Nhấp để tải lên ảnh bìa"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              coverInputRef.current?.click();
            }
          }}
        >
          <CloudUploadOutlinedIcon
            sx={{ fontSize: 44, color: "text.secondary", mb: 1 }}
          />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Nhấp để tải lên ảnh bìa
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            Hỗ trợ định dạng PNG, JPG, WebP. Tối ưu nhất với tỷ lệ 16:9.
          </Typography>
          <Button
            component="span"
            tabIndex={-1}
            variant="outlined"
            size="small"
            sx={{
              mt: 2,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Chọn ảnh từ thiết bị
          </Button>
        </Box>
      )}
    </Card>
  );
};
