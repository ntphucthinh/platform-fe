import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import type {
  ITravelItinerary,
  ICreateItineraryInput,
} from "@/types/pages/itineraries/itinerary";
import useTravelLocationSelection from "@/hooks/selections/useTravelLocationSelection";
import useTravelThemeSelection from "@/hooks/selections/useTravelThemeSelection";
import { useItineraryForm } from "@/hooks/itineraries/useItineraryForm";
import { ItineraryGeneralInfo } from "@/components/pages/itineraries/form/itineraryGeneralInfo";
import { ItineraryDaysSection } from "@/components/pages/itineraries/form/itineraryDaysSection";
import { ItineraryActivityModal } from "@/components/pages/itineraries/form/itineraryActivityModal";
import { ItineraryDeleteDayDialog } from "@/components/pages/itineraries/form/itineraryDeleteDayDialog";

const ItineraryPreviewDialog = React.lazy(
  () => import("@/components/pages/itineraries/preview/itineraryPreviewDialog"),
);

export interface ItineraryFormProps {
  initialData?: ITravelItinerary | null;
  isEdit?: boolean;
  isLoading?: boolean;
  onSubmit: (formData: ICreateItineraryInput) => void | Promise<void>;
  onCancel: () => void;
}

export const ItineraryForm: React.FC<ItineraryFormProps> = ({
  initialData,
  isEdit = false,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  // Hook selection location
  const {
    travelLocationsSelections,
    data: locationData,
    isLoading: isLoadingLocations,
  } = useTravelLocationSelection();

  // Hook selection travel themes
  const {
    travelThemesSelections,
    data: themeData,
    isLoading: isLoadingThemes,
  } = useTravelThemeSelection();

  // Custom hook encapsulating all itinerary form state, refs, effects, and actions
  const {
    register,
    setValue,
    errors,
    isSubmitting,
    title,
    coverImage,
    selectedLocation,
    themes,
    displayedThemes,
    availableThemeNames,
    canToggleThemes,
    isThemesExpanded,
    setIsThemesExpanded,
    handleToggleTheme,
    travelTipsText,
    setTravelTipsText,
    days,
    setActiveDayIndex,
    safeActiveDayIndex,
    currentActiveDay,
    hasDayImage,
    displayActiveDayTitle,
    handleAddDay,
    handleUpdateDayField,
    dayToDelete,
    setDayToDelete,
    handleConfirmDeleteDay,
    coverInputRef,
    dayImageInputRef,
    activityImageInputRef,
    handleCoverUpload,
    handleDayImageUpload,
    handleActivityImageUpload,
    activityModal,
    setActivityModal,
    handleOpenAddActivity,
    handleOpenEditActivity,
    handleSaveActivity,
    handleDeleteActivity,
    handleSave,
    previewOpen,
    setPreviewOpen,
    livePreviewItinerary,
  } = useItineraryForm({
    initialData,
    onSubmit,
    travelLocationsSelections,
    locationData,
    travelThemesSelections,
    themeData,
  });

  const isBusy = isSubmitting || isLoading;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        pb: 8,
      }}
    >
      <HeaderTitle>
        {isEdit ? `Chỉnh sửa: ${title || "Lịch trình"}` : "Tạo lịch trình mới"}
      </HeaderTitle>

      {/* Top Action Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Quay lại">
            <IconButton
              onClick={onCancel}
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#334155",
                width: 40,
                height: 40,
                "&:hover": { bgcolor: "#F8FAFC" },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#0F172A",
                fontSize: { xs: "1.25rem", sm: "1.45rem" },
              }}
            >
              {isEdit ? "Chỉnh sửa lịch trình" : "Tạo lịch trình mới"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
              Thiết lập thông tin chuyến đi và các hoạt động chi tiết theo từng
              ngày.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderColor: "#CBD5E1",
              color: "#334155",
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
              flex: { xs: "1 1 auto", sm: "none" },
              minHeight: 40,
            }}
          >
            {isEdit ? "Hủy" : "Quay lại"}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
              flex: { xs: "1 1 auto", sm: "none" },
              minHeight: 40,
            }}
          >
            Xem trước
          </Button>

          <Button
            variant="contained"
            color="primary"
            disabled={isBusy}
            startIcon={
              isBusy ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleSave}
            sx={{
              fontWeight: 600,
              borderRadius: "8px",
              textTransform: "none",
              px: 2.5,
              boxShadow: "none",
              flex: { xs: "1 1 100%", sm: "none" },
              minHeight: 40,
            }}
          >
            {isBusy
              ? "Đang lưu..."
              : isEdit
              ? "Lưu thay đổi"
              : "Tạo lịch trình"}
          </Button>
        </Box>
      </Box>

      {/* FORM SECTION 1: THÔNG TIN CHUNG */}
      <ItineraryGeneralInfo
        register={register}
        setValue={setValue}
        errors={errors}
        isLoadingLocations={isLoadingLocations}
        travelLocationsSelections={travelLocationsSelections}
        selectedLocation={selectedLocation}
        isLoadingThemes={isLoadingThemes}
        displayedThemes={displayedThemes}
        themes={themes}
        handleToggleTheme={handleToggleTheme}
        canToggleThemes={canToggleThemes}
        isThemesExpanded={isThemesExpanded}
        setIsThemesExpanded={setIsThemesExpanded}
        availableThemeNames={availableThemeNames}
        coverImage={coverImage}
        coverInputRef={coverInputRef}
        handleCoverUpload={handleCoverUpload}
        travelTipsText={travelTipsText}
        setTravelTipsText={setTravelTipsText}
      />

      {/* FORM SECTION 2: LỊCH TRÌNH THEO TỪNG NGÀY */}
      <ItineraryDaysSection
        days={days}
        safeActiveDayIndex={safeActiveDayIndex}
        setActiveDayIndex={setActiveDayIndex}
        currentActiveDay={currentActiveDay}
        hasDayImage={hasDayImage}
        displayActiveDayTitle={displayActiveDayTitle}
        handleAddDay={handleAddDay}
        handleUpdateDayField={handleUpdateDayField}
        setDayToDelete={setDayToDelete}
        dayImageInputRef={dayImageInputRef}
        handleDayImageUpload={handleDayImageUpload}
        handleOpenAddActivity={handleOpenAddActivity}
        handleOpenEditActivity={handleOpenEditActivity}
        handleDeleteActivity={handleDeleteActivity}
      />

      {/* BOTTOM ACTION BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
          pt: 2,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          fullWidth
          sx={{
            borderColor: "#CBD5E1",
            color: "#334155",
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          {isEdit ? "Hủy" : "Quay lại"}
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={isBusy}
          fullWidth
          startIcon={
            isBusy ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleSave}
          sx={{
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
            px: 3.5,
            boxShadow: "none",
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          {isBusy
            ? "Đang lưu..."
            : isEdit
            ? "Lưu thay đổi"
            : "Tạo lịch trình"}
        </Button>
      </Box>

      {/* ACTIVITY EDIT/ADD DIALOG */}
      <ItineraryActivityModal
        activityModal={activityModal}
        setActivityModal={setActivityModal}
        handleSaveActivity={handleSaveActivity}
        activityImageInputRef={activityImageInputRef}
        handleActivityImageUpload={handleActivityImageUpload}
      />

      {/* DAY REMOVE CONFIRMATION DIALOG */}
      <ItineraryDeleteDayDialog
        dayToDelete={dayToDelete}
        onClose={() => setDayToDelete(null)}
        onConfirm={handleConfirmDeleteDay}
      />

      {/* REAL-TIME PREVIEW DIALOG (Lazy-loaded) */}
      {previewOpen && (
        <React.Suspense
          fallback={
            <Dialog open fullScreen>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                  bgcolor: "#F8FAFC",
                }}
              >
                <CircularProgress />
              </Box>
            </Dialog>
          }
        >
          <ItineraryPreviewDialog
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            itinerary={livePreviewItinerary}
          />
        </React.Suspense>
      )}
    </Box>
  );
};

export default ItineraryForm;
