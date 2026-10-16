import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import type {
  ILocation,
  ILocationFormData,
  LocationStatus,
} from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

interface LocationFormDialogProps {
  open: boolean;
  initialData?: ILocation | null;
  onClose: () => void;
  onSubmit: (formData: ILocationFormData) => void;
}

function getInitialFormData(initialData?: ILocation | null): ILocationFormData {
  if (initialData) {
    return {
      name: initialData.name,
      address: initialData.address,
      latitude: initialData.latitude,
      longitude: initialData.longitude,
      coverImage: initialData.coverImage,
      status: initialData.status,
      description: initialData.description || "",
      notes: initialData.notes || "",
      googleMapsUrl: initialData.googleMapsUrl || "",
    };
  }
  return {
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    coverImage: "",
    status: "Visited",
    description: "",
    notes: "",
    googleMapsUrl: "",
  };
}

interface FormInnerProps {
  initialData?: ILocation | null;
  onClose: () => void;
  onSubmit: (formData: ILocationFormData) => void;
}

const LocationFormInner: React.FC<FormInnerProps> = ({
  initialData,
  onClose,
  onSubmit,
}) => {
  const isEdit = Boolean(initialData);
  const [formData, setFormData] = useState<ILocationFormData>(() =>
    getInitialFormData(initialData),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên địa điểm không được để trống";
    }

    if (formData.latitude === "" || isNaN(Number(formData.latitude))) {
      newErrors.latitude = "Vĩ độ (Latitude) là bắt buộc và phải là số";
    } else {
      const lat = Number(formData.latitude);
      if (lat < -90 || lat > 90) {
        newErrors.latitude = "Vĩ độ phải nằm trong khoảng từ -90 đến 90";
      }
    }

    if (formData.longitude === "" || isNaN(Number(formData.longitude))) {
      newErrors.longitude = "Kinh độ (Longitude) là bắt buộc và phải là số";
    } else {
      const lng = Number(formData.longitude);
      if (lng < -180 || lng > 180) {
        newErrors.longitude = "Kinh độ phải nằm trong khoảng từ -180 đến 180";
      }
    }

    if (formData.googleMapsUrl && formData.googleMapsUrl.trim()) {
      try {
        new URL(formData.googleMapsUrl.trim());
      } catch {
        newErrors.googleMapsUrl = "Đường dẫn Google Maps không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: "#EFF6FF",
              color: "#1976D2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocationOnOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
              {isEdit ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              {isEdit
                ? "Cập nhật thông tin điểm đến trên bản đồ hành trình"
                : "Lưu lại một điểm đến mới vào bản đồ hành trình"}
            </Typography>
          </Box>
        </Box>

        <IconButton size="small" onClick={onClose} sx={{ color: "#64748B" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Tên địa điểm */}
          <TextField
            label="Tên địa điểm *"
            placeholder="Ví dụ: Đà Lạt, Nha Trang, Hội An..."
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            size="small"
          />

          {/* Địa chỉ */}
          <TextField
            label="Địa chỉ / Tỉnh thành"
            placeholder="Ví dụ: Thành phố Đà Lạt, Tỉnh Lâm Đồng"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            fullWidth
            size="small"
          />

          {/* Coordinates: Latitude & Longitude */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="Vĩ độ (Latitude) *"
              placeholder="Ví dụ: 11.9404"
              type="number"
              value={formData.latitude}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  latitude: e.target.value === "" ? "" : Number(e.target.value),
                }));
                if (errors.latitude)
                  setErrors((prev) => ({ ...prev, latitude: "" }));
              }}
              error={Boolean(errors.latitude)}
              helperText={errors.latitude}
              fullWidth
              size="small"
            />
            <TextField
              label="Kinh độ (Longitude) *"
              placeholder="Ví dụ: 108.4583"
              type="number"
              value={formData.longitude}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  longitude: e.target.value === "" ? "" : Number(e.target.value),
                }));
                if (errors.longitude)
                  setErrors((prev) => ({ ...prev, longitude: "" }));
              }}
              error={Boolean(errors.longitude)}
              helperText={errors.longitude}
              fullWidth
              size="small"
            />
          </Box>

          {/* Status Select */}
          <FormControl fullWidth size="small">
            <InputLabel id="form-location-status-label">Trạng thái *</InputLabel>
            <Select
              labelId="form-location-status-label"
              label="Trạng thái *"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as LocationStatus,
                }))
              }
            >
              <MenuItem value="Visited">Đã ghé thăm (Visited)</MenuItem>
              <MenuItem value="Wishlist">Muốn đến (Wishlist)</MenuItem>
            </Select>
          </FormControl>

          {/* Cover Image URL */}
          <TextField
            label="Ảnh đại diện (URL)"
            placeholder="https://images.unsplash.com/..."
            value={formData.coverImage}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
            }
            fullWidth
            size="small"
          />

          {/* Image Preview if provided */}
          {formData.coverImage && (
            <Box
              component="img"
              src={formData.coverImage}
              alt="Xem trước ảnh bìa"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = DEFAULT_NO_IMAGE;
              }}
              sx={{
                width: "100%",
                height: 120,
                borderRadius: "10px",
                objectFit: "cover",
                border: "1px solid #E2E8F0",
              }}
            />
          )}

          {/* Google Maps URL */}
          <TextField
            label="Đường dẫn Google Maps (Tùy chọn)"
            placeholder="https://maps.google.com/?q=..."
            value={formData.googleMapsUrl}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                googleMapsUrl: e.target.value,
              }));
              if (errors.googleMapsUrl)
                setErrors((prev) => ({ ...prev, googleMapsUrl: "" }));
            }}
            error={Boolean(errors.googleMapsUrl)}
            helperText={errors.googleMapsUrl}
            fullWidth
            size="small"
          />

          {/* Mô tả */}
          <TextField
            label="Giới thiệu điểm đến"
            placeholder="Đặc điểm nổi bật, cảnh quan, khí hậu..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            multiline
            rows={2}
            fullWidth
            size="small"
          />

          {/* Ghi chú cá nhân */}
          <TextField
            label="Ghi chú cá nhân / Kinh nghiệm"
            placeholder="Lưu ý thời gian đi, quán xá nên ghé, trang phục..."
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            multiline
            rows={2}
            fullWidth
            size="small"
          />

          <Alert severity="info" sx={{ borderRadius: "8px", py: 0.5 }}>
            Dữ liệu được lưu trong phiên làm việc trình duyệt (Demo UI / Mock
            state).
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            color: "#64748B",
            borderColor: "#CBD5E1",
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: "none",
          }}
        >
          {isEdit ? "Cập nhật" : "Lưu địa điểm"}
        </Button>
      </DialogActions>
    </>
  );
};

export const LocationFormDialog: React.FC<LocationFormDialogProps> = ({
  open,
  initialData,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
      {open && (
        <LocationFormInner
          key={initialData?.id || "new"}
          initialData={initialData}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
};
