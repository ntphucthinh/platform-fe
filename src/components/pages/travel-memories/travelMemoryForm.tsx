import React from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import type {
  ITravelMemory,
  ITravelMemoryFormSubmitData,
} from "@/types/pages/travel-memories/travelMemory";
import { useTravelMemoryForm } from "@/hooks/travel-memories/useTravelMemoryForm";
import { TravelMemoryGeneralInfo } from "@/components/pages/travel-memories/form/travelMemoryGeneralInfo";
import { TravelMemoryCoverImage } from "@/components/pages/travel-memories/form/travelMemoryCoverImage";
import { TravelMemoryDaysSection } from "@/components/pages/travel-memories/form/travelMemoryDaysSection";
import { TravelMemoryDateConfirmDialog } from "@/components/pages/travel-memories/travelMemoryDateConfirmDialog";
import { TravelMemoryPhotoLightbox } from "@/components/pages/travel-memories/travelMemoryPhotoLightbox";

export interface TravelMemoryFormProps {
  initialData?: ITravelMemory | null;
  isEdit?: boolean;
  isLoading?: boolean;
  onSubmit: (formData: ITravelMemoryFormSubmitData) => void;
  onCancel: () => void;
}

export const TravelMemoryForm: React.FC<TravelMemoryFormProps> = ({
  initialData,
  isEdit = false,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    setValue,
    handleFormSubmit,
    errors,
    onFormValid,
    startDate,
    endDate,
    coverImage,
    selectedLocation,
    startDateError,
    endDateError,
    dateRangeValidation,
    activeDates,
    duration,
    travelLocationsSelections,
    isLoadingLocations,
    refetchLocations,
    coverInputRef,
    handleCoverFileChange,
    handleRemoveCover,
    photosByDate,
    descriptionsByDate,
    setDescriptionsByDate,
    collapsedDays,
    setCollapsedDays,
    toggleDayCollapse,
    dayInputRefs,
    handleDayFilesChange,
    dragOverDate,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    selectedPhotoIdsByDate,
    handleTogglePhotoSelect,
    handleSelectAllPhotos,
    handleDeleteSelectedPhotos,
    handleRemovePhoto,
    undoBuffer,
    showUndoSnackbar,
    setShowUndoSnackbar,
    handleUndoDelete,
    pendingDateChange,
    removedDatesWarning,
    handleDateChangeAttempt,
    handleConfirmDateChange,
    handleCancelDateChange,
    lightboxState,
    setLightboxState,
  } = useTravelMemoryForm({ initialData, onSubmit });

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit(onFormValid)}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 6 }}
    >
      <HeaderTitle>
        {isEdit ? "Chỉnh sửa kỷ niệm chuyến đi" : "Thêm kỷ niệm chuyến đi"}
      </HeaderTitle>

      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            {isEdit ? "Chỉnh sửa kỷ niệm chuyến đi" : "Thêm kỷ niệm chuyến đi"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Ghi lại thông tin và hình ảnh của một chuyến đi đã qua.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={onCancel}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              borderColor: "divider",
              color: "text.secondary",
              flex: { xs: 1, sm: "none" },
              minHeight: 40,
              "&:focus-visible": {
                outline: "2px solid #1976D2",
                outlineOffset: 2,
              },
            }}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              boxShadow: "none",
              flex: { xs: 1, sm: "none" },
              minHeight: 40,
              "&:focus-visible": {
                outline: "2px solid #1976D2",
                outlineOffset: 2,
              },
            }}
          >
            {isLoading
              ? "Đang lưu..."
              : isEdit
              ? "Lưu thay đổi"
              : "Lưu kỷ niệm"}
          </Button>
        </Box>
      </Box>

      {/* Trip Information Card */}
      <TravelMemoryGeneralInfo
        register={register}
        setValue={setValue}
        errors={errors}
        selectedLocation={selectedLocation}
        travelLocationsSelections={travelLocationsSelections}
        isLoadingLocations={isLoadingLocations}
        onRefetchLocations={refetchLocations}
        startDate={startDate}
        endDate={endDate}
        startDateError={startDateError}
        endDateError={endDateError}
        dateRangeValidation={dateRangeValidation}
        duration={duration}
        onDateChangeAttempt={handleDateChangeAttempt}
      />

      {/* Cover Image Section */}
      <TravelMemoryCoverImage
        coverImage={coverImage}
        coverInputRef={coverInputRef}
        onCoverFileChange={handleCoverFileChange}
        onRemoveCover={handleRemoveCover}
      />

      {/* Automatic Daily Photo Sections (Bao gồm Undo Snackbar) */}
      <TravelMemoryDaysSection
        activeDates={activeDates}
        photosByDate={photosByDate}
        descriptionsByDate={descriptionsByDate}
        setDescriptionsByDate={setDescriptionsByDate}
        collapsedDays={collapsedDays}
        setCollapsedDays={setCollapsedDays}
        toggleDayCollapse={toggleDayCollapse}
        dayInputRefs={dayInputRefs}
        onDayFilesChange={handleDayFilesChange}
        dragOverDate={dragOverDate}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        selectedPhotoIdsByDate={selectedPhotoIdsByDate}
        onTogglePhotoSelect={handleTogglePhotoSelect}
        onSelectAllPhotos={handleSelectAllPhotos}
        onDeleteSelectedPhotos={handleDeleteSelectedPhotos}
        onRemovePhoto={handleRemovePhoto}
        onPhotoClick={(dayNumber, formattedDate, dayPhotos, photoIdx) => {
          setLightboxState({
            open: true,
            photos: dayPhotos,
            currentIndex: photoIdx,
            dateLabel: `Ngày ${dayNumber} · ${formattedDate}`,
          });
        }}
        showUndoSnackbar={showUndoSnackbar}
        undoBuffer={undoBuffer}
        onCloseUndoSnackbar={() => setShowUndoSnackbar(false)}
        onUndoDelete={handleUndoDelete}
      />

      {/* Bottom Action Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          pt: 1,
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            borderColor: "divider",
            color: "text.secondary",
            minHeight: 40,
            px: 3,
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Hủy bỏ
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            minHeight: 40,
            px: 4,
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          {isLoading
            ? "Đang lưu..."
            : isEdit
            ? "Lưu thay đổi"
            : "Lưu kỷ niệm"}
        </Button>
      </Box>

      {/* Date Range Change Confirmation Dialog */}
      <TravelMemoryDateConfirmDialog
        open={Boolean(pendingDateChange)}
        removedDates={removedDatesWarning}
        onConfirm={handleConfirmDateChange}
        onCancel={handleCancelDateChange}
      />

      {/* Thumbnail Lightbox Preview */}
      <TravelMemoryPhotoLightbox
        open={lightboxState.open}
        photos={lightboxState.photos}
        currentIndex={lightboxState.currentIndex}
        dateLabel={lightboxState.dateLabel}
        onClose={() =>
          setLightboxState((prev) => ({ ...prev, open: false }))
        }
        onNavigate={(newIdx) =>
          setLightboxState((prev) => ({ ...prev, currentIndex: newIdx }))
        }
      />
    </Box>
  );
};
