import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import type {
  ILocation,
  ILocationFormData,
} from "@/types/pages/travel-map/travelMap";
import {
  useLocationForm,
  type LocationFormSubmitResult,
} from "@/hooks/travel-map/useLocationForm";
import { LocationFormGeneralInfo } from "@/components/pages/travel-map/form/locationFormGeneralInfo";
import { LocationFormMapPicker } from "@/components/pages/travel-map/form/locationFormMapPicker";
import { LocationFormCoordinates } from "@/components/pages/travel-map/form/locationFormCoordinates";
import { LocationFormCoverImage } from "@/components/pages/travel-map/form/locationFormCoverImage";
import { LocationFormAdditionalInfo } from "@/components/pages/travel-map/form/locationFormAdditionalInfo";

export type { LocationFormSubmitResult };

export interface LocationFormDialogProps {
  open: boolean;
  initialData?: ILocation | null;
  existingLocations?: ILocation[];
  onClose: () => void;
  onSubmit: (
    formData: ILocationFormData,
  ) => Promise<LocationFormSubmitResult> | LocationFormSubmitResult;
}

const LocationFormInner: React.FC<
  Omit<LocationFormDialogProps, "open">
> = ({ initialData, existingLocations, onClose, onSubmit }) => {
  const {
    isEdit,
    selectedCountry,
    allCountries,
    formData,
    setFormData,
    errors,
    setErrors,
    locationWarning,
    setLocationWarning,
    isSubmitting,
    initialCoordinates,
    fileInputRef,
    isDragging,
    imageError,
    handleFileInputChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveImage,
    handleCountryChange,
    handleLocationSelect,
    handleSave,
  } = useLocationForm({ initialData, onSubmit, onClose });

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          py: 2,
          borderBottom: "1px solid #F1F5F9",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: "#EFF6FF",
              color: "#1976D2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocationOnOutlinedIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, color: "#0F172A", fontSize: "1.15rem" }}
            >
              {isEdit ? "Chỉnh sửa điểm đến" : "Thêm điểm đến mới"}
            </Typography>
            <Typography
              variant="caption"
              component="p"
              sx={{ color: "#64748B", fontSize: "0.825rem" }}
            >
              {isEdit
                ? "Cập nhật thông tin điểm đến và vị trí trên bản đồ"
                : "Thêm điểm đến và chọn vị trí trực tiếp trên bản đồ"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ color: "#64748B" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          pt: "14px !important",
          pb: 2.5,
          flex: "1 1 auto",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Quốc gia & Tên điểm đến */}
          <LocationFormGeneralInfo
            allCountries={allCountries}
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />

          {/* Bản đồ chọn vị trí */}
          <LocationFormMapPicker
            country={selectedCountry}
            latitude={formData.latitude}
            longitude={formData.longitude}
            warning={locationWarning}
            onLocationSelect={handleLocationSelect}
            onLocationWarning={setLocationWarning}
            existingLocations={existingLocations}
            currentLocationId={initialData?.id}
            initialCoordinates={initialCoordinates}
          />

          {/* Tọa độ, Trạng thái, Google Maps Link */}
          <LocationFormCoordinates
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />

          {/* Ảnh đại diện */}
          <LocationFormCoverImage
            coverImage={formData.coverImage}
            fileInputRef={fileInputRef}
            isDragging={isDragging}
            imageError={imageError}
            onFileInputChange={handleFileInputChange}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemoveImage={handleRemoveImage}
          />

          {/* Giới thiệu điểm đến & Ghi chú cá nhân */}
          <LocationFormAdditionalInfo
            formData={formData}
            setFormData={setFormData}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          borderTop: "1px solid #F1F5F9",
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
          flexShrink: 0,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
          fullWidth
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            color: "#64748B",
            borderColor: "#CBD5E1",
            px: 2.5,
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={isSubmitting}
          fullWidth
          startIcon={
            isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3.5,
            boxShadow: "none",
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          {isSubmitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Lưu điểm đến"}
        </Button>
      </DialogActions>
    </>
  );
};

export const LocationFormDialog: React.FC<LocationFormDialogProps> = ({
  open,
  initialData,
  existingLocations,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 0, sm: "16px" },
            height: { xs: "100%", sm: "90vh" },
            maxHeight: "920px",
            display: "flex",
            flexDirection: "column",
            m: { xs: 0, sm: 2 },
          },
        },
      }}
    >
      {open && (
        <LocationFormInner
          initialData={initialData}
          existingLocations={existingLocations}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
};
