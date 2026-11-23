import React from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface LocationFormCoverImageProps {
  coverImage?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  imageError: string | null;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemoveImage: () => void;
}

export const LocationFormCoverImage: React.FC<LocationFormCoverImageProps> = ({
  coverImage,
  fileInputRef,
  isDragging,
  imageError,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveImage,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "#1E293B" }}
        >
          Ảnh đại diện điểm đến
        </Typography>
        {coverImage && (
          <Button
            variant="text"
            color="error"
            size="small"
            startIcon={<DeleteOutlinedIcon fontSize="small" />}
            onClick={onRemoveImage}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.8rem",
              p: 0.5,
            }}
          >
            Xoá ảnh
          </Button>
        )}
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={onFileInputChange}
      />

      {coverImage ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 180,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            component="img"
            src={coverImage || DEFAULT_NO_IMAGE}
            alt="Ảnh đại diện điểm đến"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = DEFAULT_NO_IMAGE;
              img.style.objectFit = "contain";
              img.style.padding = "16px";
              img.style.backgroundColor = "#F8FAFC";
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit:
                !coverImage || coverImage === DEFAULT_NO_IMAGE
                  ? "contain"
                  : "cover",
              p:
                !coverImage || coverImage === DEFAULT_NO_IMAGE
                  ? 2
                  : 0,
              bgcolor:
                !coverImage || coverImage === DEFAULT_NO_IMAGE
                  ? "#F8FAFC"
                  : "transparent",
              boxSizing: "border-box",
            }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<CloudUploadOutlinedIcon fontSize="small" />}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              bgcolor: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(4px)",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              "&:hover": { bgcolor: "rgba(15, 23, 42, 0.95)" },
            }}
          >
            Thay đổi ảnh
          </Button>
        </Box>
      ) : (
        <Box
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            p: 3,
            border: "2px dashed",
            borderColor: isDragging ? "#2563EB" : "#CBD5E1",
            borderRadius: "12px",
            bgcolor: isDragging ? "#EFF6FF" : "#F8FAFC",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              borderColor: "#2563EB",
              bgcolor: "#F1F5F9",
            },
          }}
        >
          <CloudUploadOutlinedIcon
            sx={{
              fontSize: 40,
              color: isDragging ? "#2563EB" : "#94A3B8",
              mb: 1,
            }}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#1E293B" }}
          >
            Kéo và thả ảnh vào đây, hoặc{" "}
            <Box
              component="span"
              sx={{ color: "#2563EB", textDecoration: "underline" }}
            >
              chọn ảnh từ thiết bị
            </Box>
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#64748B", mt: 0.5 }}
          >
            Hỗ trợ PNG, JPG, WebP (Tối đa 10MB)
          </Typography>
        </Box>
      )}

      {imageError && (
        <Typography variant="caption" sx={{ color: "#DC2626", mt: 0.5 }}>
          {imageError}
        </Typography>
      )}
    </Box>
  );
};
