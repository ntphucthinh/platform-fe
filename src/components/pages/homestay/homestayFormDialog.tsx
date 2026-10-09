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
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  IHomestayFormData,
  IHomestayItem,
  IHomestayFormImageItem,
} from "@/types/pages/homestay/homestay";
import { homestaySchema } from "@/schemas/homestay/homestaySchema";

export interface HomestayFormDialogProps {
  open: boolean;
  initialData?: IHomestayItem | null;
  onClose: () => void;
  onSubmit: (data: IHomestayFormData) => Promise<void> | void;
}

interface ImageItemUI {
  id: string;
  url: string;
  file?: File;
  isObjectUrl?: boolean;
  imagePath?: string;
}

export const HomestayFormDialog: React.FC<HomestayFormDialogProps> = ({
  open,
  initialData,
  onClose,
  onSubmit: handleExternalSubmit,
}) => {
  const isEdit = Boolean(initialData);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageItems, setImageItems] = useState<ImageItemUI[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map((url, idx) => {
        const rawRec = initialData.imageRecords?.[idx];
        return {
          id: `existing-${idx}-${url}`,
          url,
          imagePath: rawRec?.imagePath || url,
          isObjectUrl: false,
        };
      });
    }
    return [];
  });

  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmittingAsync, setIsSubmittingAsync] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IHomestayFormData>({
    resolver: yupResolver(homestaySchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || initialData?.location || "",
      location: initialData?.address || initialData?.location || "",
      description: initialData?.description || "",
      images: initialData?.images || [],
      price: initialData?.price || "",
      googleMapsUrl: initialData?.googleMapsUrl || initialData?.googleMapLink || "",
      googleMapLink: initialData?.googleMapsUrl || initialData?.googleMapLink || "",
    },
  });

  // Sync image items to form on change
  const syncImagesToForm = (items: ImageItemUI[]) => {
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

  // Process array of File objects (from click input or drag-and-drop)
  const processFiles = (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setFileError(null);
    const newItems: ImageItemUI[] = [];
    let hasTypeError = false;

    Array.from(files).forEach((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type.toLowerCase())) {
        hasTypeError = true;
        return;
      }

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
      setImageItems((prev) => {
        const updated = [...prev, ...newItems];
        syncImagesToForm(updated);
        return updated;
      });
    }
  };

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmittingAsync) setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSubmittingAsync) {
      e.dataTransfer.dropEffect = "copy";
      if (!isDragging) setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isSubmittingAsync) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
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
  const handleFormSubmit = async (data: IHomestayFormData) => {
    const finalImageUrls = imageItems.map((item) => item.url);
    const finalImageItems: IHomestayFormImageItem[] = imageItems.map((item) => ({
      id: item.id,
      url: item.url,
      file: item.file,
      isObjectUrl: item.isObjectUrl,
      imagePath: item.imagePath,
    }));

    const rawMapUrl = typeof data.googleMapsUrl === "string" ? data.googleMapsUrl : data.googleMapLink ?? "";
    const mapUrlValue = rawMapUrl.trim() ? rawMapUrl.trim() : null;

    setIsSubmittingAsync(true);
    try {
      await handleExternalSubmit({
        ...data,
        address: data.address || data.location || "",
        location: data.address || data.location || "",
        googleMapsUrl: mapUrlValue,
        googleMapLink: mapUrlValue,
        images: finalImageUrls,
        imageItems: finalImageItems,
      });
    } finally {
      setIsSubmittingAsync(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmittingAsync ? undefined : onClose}
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
        <IconButton
          onClick={onClose}
          disabled={isSubmittingAsync}
          size="small"
          aria-label="close modal"
        >
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
              disabled={isSubmittingAsync}
            />

            {/* 2. Address / Location */}
            <TextField
              required
              fullWidth
              label="Địa Điểm / Địa Chỉ"
              placeholder="Nhập địa chỉ hoặc vị trí (ví dụ: Đà Lạt, Lâm Đồng)"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              size="small"
              disabled={isSubmittingAsync}
            />

            {/* 3. Description (Multiline, optional) */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô Tả Chi Tiết (tùy chọn)"
              placeholder="Nhập thông tin chi tiết về homestay (tiện nghi, điểm nổi bật...)"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              size="small"
              disabled={isSubmittingAsync}
            />

            {/* 4. Price (string input, optional) */}
            <TextField
              fullWidth
              label="Giá Thuê (dạng chuỗi chữ, tùy chọn)"
              placeholder="Ví dụ: 500.000đ, 100k → 500k, 1,500,000 VND"
              {...register("price")}
              error={!!errors.price}
              helperText={
                errors.price?.message ??
                "Nhập chuỗi văn bản tự do. Giá sẽ được lưu giữ chính xác theo chuỗi bạn nhập."
              }
              size="small"
              disabled={isSubmittingAsync}
            />

            {/* 5. Google Maps URL (optional) */}
            <TextField
              fullWidth
              label="Link Google Map (tùy chọn)"
              placeholder="https://maps.google.com/?q=..."
              {...register("googleMapsUrl")}
              error={!!errors.googleMapsUrl}
              helperText={errors.googleMapsUrl?.message ?? "Để trống nếu chưa có"}
              size="small"
              disabled={isSubmittingAsync}
            />

            {/* 6. Multiple Image Section (Drag & Drop enabled, Supabase Storage) */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#334155", mb: 1 }}>
                Hình Ảnh Homestay (Upload lên Supabase Storage)
              </Typography>

              {/* Drag & Drop Dropzone */}
              <Paper
                elevation={0}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmittingAsync && fileInputRef.current?.click()}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: "12px",
                  border: `2px dashed ${isDragging ? "#2563EB" : "#CBD5E1"}`,
                  bgcolor: isDragging ? "#EFF6FF" : "#F8FAFC",
                  cursor: isSubmittingAsync ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease-in-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.8,
                  mb: 2,
                  "&:hover": {
                    borderColor: isSubmittingAsync ? "#CBD5E1" : "#2563EB",
                    bgcolor: isSubmittingAsync ? "#F8FAFC" : "#F1F5F9",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: isDragging ? "#DBEAFE" : "#E2E8F0",
                    color: isDragging ? "#2563EB" : "#64748B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: isDragging ? "#1D4ED8" : "#334155" }}>
                  {isDragging
                    ? "Thả các tệp hình ảnh vào đây..."
                    : "Kéo & thả nhiều hình ảnh vào đây hoặc nhấp để chọn tệp"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Hỗ trợ chọn hoặc kéo thả 1 lúc nhiều tệp (PNG, JPG, JPEG, WebP)
                </Typography>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </Paper>

              {fileError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "8px", fontSize: "0.85rem" }}>
                  {fileError}
                </Alert>
              )}

              {/* Image Previews Grid */}
              {imageItems.length > 0 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: 1.5,
                    p: 2,
                    bgcolor: "#F8FAFC",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    maxHeight: 240,
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
                          disabled={isSubmittingAsync}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(item.id);
                          }}
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
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            disabled={isSubmittingAsync}
          >
            Hủy Bỏ
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmittingAsync}
            startIcon={isSubmittingAsync ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isSubmittingAsync
              ? "Đang lưu..."
              : isEdit
              ? "Cập Nhật Homestay"
              : "Tạo Homestay"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
