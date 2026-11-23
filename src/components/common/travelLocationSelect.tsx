import React, { useState, useMemo, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  Paper,
  Box,
  Button,
  Divider,
  type PaperProps,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LocationFormDialog } from "@/components/pages/travel-map/locationFormDialog";
import { useCreateTravelLocation } from "@/hooks/travel-map/useCreateTravelLocation";
import { useTravelLocationList } from "@/hooks/travel-map/useTravelLocationList";
import { useCustomOpenNotification } from "@/hooks/common/useCustomOpenNotification";
import type {
  ILocation,
  ILocationFormData,
} from "@/types/pages/travel-map/travelMap";

export interface ITravelLocationOption {
  label: string;
  value: string | number;
}

export interface TravelLocationSelectProps {
  value: ITravelLocationOption | null;
  onChange: (newValue: ITravelLocationOption | null) => void;
  options: ITravelLocationOption[];
  isLoading?: boolean;
  onRefetchOptions?: () => Promise<unknown> | void;
  existingLocations?: ILocation[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
}

export const TravelLocationSelect: React.FC<TravelLocationSelectProps> = ({
  value,
  onChange,
  options,
  isLoading = false,
  onRefetchOptions,
  existingLocations,
  label = "Địa điểm",
  placeholder = "Chọn địa điểm...",
  required = false,
  error = false,
  helperText,
  disabled = false,
  fullWidth = true,
  size = "medium",
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { createLocation } = useCreateTravelLocation();
  const { data: allLocations, refetch: refetchAllLocations } =
    useTravelLocationList();
  const { showSuccess, handleShowError } = useCustomOpenNotification();

  const resolvedExistingLocations = existingLocations ?? allLocations;

  // Đảm bảo option đang chọn luôn có trong danh sách để Autocomplete không bị warning/lỗi hiển thị
  const mergedOptions = useMemo(() => {
    if (!value) return options;
    const exists = options.some(
      (opt) => Number(opt.value) === Number(value.value),
    );
    if (!exists) {
      return [value, ...options];
    }
    return options;
  }, [options, value]);

  const handleOpenModal = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData: ILocationFormData) => {
      const { data: created, error: createErr, rawError } =
        await createLocation(formData);
      if (createErr) {
        handleShowError(rawError || createErr, "Không thể tạo mới địa điểm.");
        return { success: false, error: createErr };
      }
      if (created) {
        showSuccess("Đã thêm địa điểm thành công!");
        if (onRefetchOptions) {
          try {
            await onRefetchOptions();
          } catch {
            // bỏ qua lỗi refetch ngầm
          }
        }
        try {
          await refetchAllLocations();
        } catch {
          // bỏ qua lỗi refetch ngầm
        }
        const newOption: ITravelLocationOption = {
          value: created.id,
          label:
            created.name ||
            created.locationName ||
            formData.locationName ||
            "",
        };
        onChange(newOption);
        setModalOpen(false);
        return { success: true };
      }
      return { success: false, error: "Không thể tạo mới địa điểm." };
    },
    [
      createLocation,
      handleShowError,
      showSuccess,
      onRefetchOptions,
      refetchAllLocations,
      onChange,
    ],
  );

  const CustomPaper = useCallback(
    (paperProps: PaperProps) => {
      return (
        <Paper
          {...paperProps}
          elevation={4}
          sx={{
            borderRadius: "8px",
            mt: 0.5,
            border: "1px solid #E2E8F0",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
            ...((paperProps.sx as object) || {}),
          }}
        >
          {paperProps.children}
          <Divider sx={{ my: 0, borderColor: "#E2E8F0" }} />
          <Box
            sx={{
              p: 1,
              backgroundColor: "#F8FAFC",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
            onMouseDown={(e) => {
              // Ngăn ngừa blur làm đóng popup trước khi sự kiện click kích hoạt
              e.preventDefault();
            }}
          >
            <Button
              fullWidth
              size="small"
              variant="outlined"
              startIcon={<AddIcon fontSize="small" />}
              onClick={handleOpenModal}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "primary.main",
                backgroundColor: "#FFFFFF",
                borderColor: "#CBD5E1",
                borderRadius: "8px",
                py: 0.75,
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                  backgroundColor: "#EFF6FF",
                  borderColor: "primary.main",
                  color: "primary.dark",
                },
              }}
            >
              Thêm địa điểm
            </Button>
          </Box>
        </Paper>
      );
    },
    [handleOpenModal],
  );

  return (
    <>
      <Autocomplete<ITravelLocationOption, false, false, false>
        fullWidth={fullWidth}
        disabled={disabled}
        size={size}
        loading={isLoading}
        options={mergedOptions}
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;
          return option.label || "";
        }}
        value={value}
        isOptionEqualToValue={(option, val) =>
          Number(option.value) === Number(val.value)
        }
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
        noOptionsText="Không tìm thấy địa điểm"
        loadingText="Đang tải danh sách địa điểm..."
        slots={{ paper: CustomPaper }}
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
          />
        )}
      />

      {/* Modal Thêm địa điểm */}
      <LocationFormDialog
        open={modalOpen}
        initialData={null}
        existingLocations={resolvedExistingLocations}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

export default TravelLocationSelect;
