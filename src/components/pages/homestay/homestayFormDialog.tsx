import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IHomestayFormData, IHomestayItem } from "@/types/pages/homestay/homestay";
import { homestaySchema } from "@/schemas/homestay/homestaySchema";
import { SAMPLE_IMAGE_PRESETS } from "@/constants/homestayConstant";

export interface HomestayFormDialogProps {
  open: boolean;
  initialData?: IHomestayItem | null;
  onClose: () => void;
  onSubmit: (data: IHomestayFormData) => void;
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isObjectUrl?: boolean;
}

export const HomestayFormDialog: React.FC<HomestayFormDialogProps> = ({
  open,
  initialData,
  onClose,
  onSubmit: handleExternalSubmit,
}) => {
  const isEdit = Boolean(initialData);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageItems, setImageItems] = useState<ImageItem[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map((url, idx) => ({
        id: `existing-${idx}-${url}`,
        url,
        isObjectUrl: false,
      }));
    }
    return [
      { id: `default-0-${SAMPLE_IMAGE_PRESETS[0]}`, url: SAMPLE_IMAGE_PRESETS[0], isObjectUrl: false },
      { id: `default-1-${SAMPLE_IMAGE_PRESETS[1]}`, url: SAMPLE_IMAGE_PRESETS[1], isObjectUrl: false },
    ];
  });

  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IHomestayFormData>({
    resolver: yupResolver(homestaySchema),
    defaultValues: {
      name: initialData?.name || "",
      location: initialData?.location || "",
      description: initialData?.description || "",
      images: initialData?.images || [SAMPLE_IMAGE_PRESETS[0], SAMPLE_IMAGE_PRESETS[1]],
      price: initialData?.price || "",
      googleMapLink: initialData?.googleMapLink ?? "",
    },
  });

  // Sync image items to form on change
  const syncImagesToForm = (items: ImageItem[]) => {
    const urls = items.map((item) => item.url);
    setValue("images", urls, { shouldValidate: true });
  };

  // Revoke object URLs when dialog unmounts
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => {
        if (item.isObjectUrl && item.url) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [imageItems]);

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setFileError(null);
    const newItems: ImageItem[] = [];
    let hasTypeError = false;

    Array.from(files).forEach((file) => {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type.toLowerCase())) {
        hasTypeError = true;
        return;
      }

      // Check duplicates by file name & size
      const isDuplicate = imageItems.some(
        (item) => item.file && item.file.name === file.name && item.file.size === file.size
      );
      if (isDuplicate) return;

      const objectUrl = URL.createObjectURL(file);
      newItems.push({
        id: `file-${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        url: objectUrl,
        file,
        isObjectUrl: true,
      });
    });

    if (hasTypeError) {
      setFileError("Vui lòng chỉ chọn tệp hình ảnh có định dạng PNG, JPG, JPEG hoặc WebP.");
    }

    if (newItems.length > 0) {
      const updated = [...imageItems, ...newItems];
      setImageItems(updated);
      syncImagesToForm(updated);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove individual image
  const handleRemoveImage = (idToRemove: string) => {
    const itemToRemove = imageItems.find((item) => item.id === idToRemove);
    if (itemToRemove && itemToRemove.isObjectUrl) {
      URL.revokeObjectURL(itemToRemove.url);
    }

    const updated = imageItems.filter((item) => item.id !== idToRemove);
    setImageItems(updated);
    syncImagesToForm(updated);
  };

  // Form submit
  const handleFormSubmit = (data: IHomestayFormData) => {
    const finalImages = imageItems.map((item) => item.url);
    if (finalImages.length === 0) {
      setFileError("Vui lòng chọn ít nhất 1 hình ảnh cho homestay.");
      return;
    }
    handleExternalSubmit({
      ...data,
      images: finalImages,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            p: 1,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
          {isEdit ? "Chỉnh Sửa Homestay" : "Thêm Homestay Mới"}
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="close modal">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <DialogContent dividers sx={{ py: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* 1. Homestay Name */}
            <TextField
              required
              fullWidth
              label="Tên Homestay"
              placeholder="Nhập tên homestay (ví dụ: Pine Forest Eco Villa)"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
            />

            {/* 2. Location */}
            <TextField
              required
              fullWidth
              label="Địa Điểm / Địa Chỉ"
              placeholder="Nhập địa chỉ hoặc vị trí (ví dụ: Đà Lạt, Lâm Đồng)"
              {...register("location")}
              error={!!errors.location}
              helperText={errors.location?.message}
              size="small"
            />

            {/* 3. Description (Multiline, optional) */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô Tả Chi Tiết (tùy chọn)"
              placeholder="Nhập thông tin chi tiết về homestay (tiện nghi, điểm nổi bật...)"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              size="small"
            />

            {/* 4. Price (optional string) */}
            <TextField
              fullWidth
              label="Giá Thuê (tùy chọn)"
              placeholder="Ví dụ: 100k → 500k, 2.500.000đ / đêm"
              {...register("price")}
              error={!!errors.price}
              helperText={errors.price?.message}
              size="small"
            />

            {/* 5. Google Map Link (optional, nullable) */}
            <TextField
              fullWidth
              label="Link Google Map (tùy chọn)"
              placeholder="https://maps.google.com/?q=..."
              {...register("googleMapLink")}
              error={!!errors.googleMapLink}
              helperText={errors.googleMapLink?.message ?? "Để trống nếu chưa có"}
              size="small"
            />

            {/* 4. Unified Multiple Image Section */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#334155" }}>
                  Hình Ảnh Homestay (Chọn nhiều ảnh)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
                >
                  Chọn Ảnh Từ Máy
                </Button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </Box>

              {fileError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "8px", fontSize: "0.85rem" }}>
                  {fileError}
                </Alert>
              )}

              {errors.images && !fileError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "8px", fontSize: "0.85rem" }}>
                  {errors.images.message}
                </Alert>
              )}

              {/* Image Previews Grid */}
              {imageItems.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: 1.5,
                    p: 2,
                    bgcolor: "#F8FAFC",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    maxHeight: 280,
                    overflowY: "auto",
                  }}
                >
                  {imageItems.map((item, index) => (
                    <Paper
                      key={item.id}
                      elevation={0}
                      sx={{
                        position: "relative",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid #CBD5E1",
                        pt: "80%",
                        bgcolor: "#E2E8F0",
                        "&:hover .remove-btn": {
                          opacity: 1,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={item.url}
                        alt={`Preview ${index + 1}`}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {index === 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 4,
                            left: 4,
                            bgcolor: "rgba(15, 23, 42, 0.8)",
                            color: "#FFF",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            px: 0.8,
                            py: 0.2,
                            borderRadius: "4px",
                          }}
                        >
                          Ảnh chính
                        </Box>
                      )}
                      <Tooltip title="Xóa hình ảnh này">
                        <IconButton
                          size="small"
                          className="remove-btn"
                          onClick={() => handleRemoveImage(item.id)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(220, 38, 38, 0.9)",
                            color: "#FFFFFF",
                            p: 0.4,
                            opacity: 0.85,
                            transition: "opacity 0.2s",
                            "&:hover": {
                              bgcolor: "#DC2626",
                              opacity: 1,
                            },
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: "12px",
                    border: "2px dashed #CBD5E1",
                    bgcolor: "#F8FAFC",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#2563EB",
                      bgcolor: "#EFF6FF",
                    },
                  }}
                >
                  <PhotoLibraryIcon sx={{ fontSize: 40, color: "#94A3B8", mb: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                    Chưa chọn hình ảnh nào
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Nhấp vào đây để chọn tệp hình ảnh (PNG, JPG, JPEG, WebP)
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Hủy Bỏ
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isEdit ? "Cập Nhật Homestay" : "Tạo Homestay"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
