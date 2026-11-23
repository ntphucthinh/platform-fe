import React from "react";
import {
  Card,
  Typography,
  Grid,
  TextField,
  Box,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { ITravelMemoryFormData } from "@/types/pages/travel-memories/travelMemory";
import { TravelLocationSelect } from "@/components/common/travelLocationSelect";

export interface TravelMemoryGeneralInfoProps {
  register: UseFormRegister<ITravelMemoryFormData>;
  setValue: UseFormSetValue<ITravelMemoryFormData>;
  errors: FieldErrors<ITravelMemoryFormData>;
  selectedLocation: { label: string; value: string | number } | null;
  travelLocationsSelections: { label: string; value: string | number }[];
  isLoadingLocations: boolean;
  onRefetchLocations?: () => Promise<unknown> | void;
  startDate: string;
  endDate: string;
  startDateError?: string;
  endDateError?: string;
  dateRangeValidation: { isValid: boolean; error?: string };
  duration: { days: number; nights: number; label: string };
  onDateChangeAttempt: (newStart: string, newEnd: string) => void;
}

export const TravelMemoryGeneralInfo: React.FC<TravelMemoryGeneralInfoProps> = ({
  register,
  setValue,
  errors,
  selectedLocation,
  travelLocationsSelections,
  isLoadingLocations,
  onRefetchLocations,
  startDate,
  endDate,
  startDateError,
  endDateError,
  dateRangeValidation,
  duration,
  onDateChangeAttempt,
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
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#172033", mb: 0.5 }}
      >
        Thông tin chuyến đi
      </Typography>
      <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
        Nhập các thông tin cơ bản về hành trình đã trải qua.
      </Typography>

      <Grid container spacing={2.5}>
        {/* Trip Title - Full Width */}
        <Grid sx={{ width: "100%" }}>
          <TextField
            fullWidth
            required
            label="Tên chuyến đi"
            placeholder="Ví dụ: Đà Lạt – Những ngày bình yên"
            {...register("title")}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />
        </Grid>

        {/* Destination / Location Selectbox - Full Width */}
        <Grid sx={{ width: "100%" }}>
          <TravelLocationSelect
            required
            value={selectedLocation}
            onChange={(newVal) => {
              const nextId = newVal ? Number(newVal.value) : null;
              const nextLabel = newVal ? newVal.label : "";
              setValue("locationId", nextId, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue("destination", nextLabel, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            options={travelLocationsSelections}
            isLoading={isLoadingLocations}
            onRefetchOptions={onRefetchLocations}
            label="Địa điểm"
            placeholder="Chọn địa điểm..."
            error={Boolean(errors.locationId || errors.destination)}
            helperText={
              errors.locationId?.message || errors.destination?.message
            }
          />
        </Grid>

        {/* Date Row: [Ngày khởi hành] ~ [Ngày kết thúc] + Duration inline */}
        <Grid sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr auto 1fr",
                lg: "minmax(180px, 1fr) auto minmax(180px, 1fr) auto",
              },
              alignItems: "start",
              columnGap: { xs: 2, sm: 1.5 },
              rowGap: { xs: 2, sm: 1.5 },
              width: "100%",
            }}
          >
            {/* Start Date Field Wrapper */}
            <Box
              sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
            >
              <DatePicker
                label="Ngày khởi hành"
                format="DD/MM/YYYY"
                value={
                  startDate && dayjs(startDate, "YYYY-MM-DD").isValid()
                    ? dayjs(startDate, "YYYY-MM-DD")
                    : null
                }
                onChange={(newValue) => {
                  const nextStart =
                    newValue && newValue.isValid()
                      ? newValue.format("YYYY-MM-DD")
                      : "";
                  onDateChangeAttempt(nextStart, endDate);
                }}
                slotProps={{
                  actionBar: {
                    actions: ["clear", "accept"],
                  },
                  textField: {
                    required: true,
                    fullWidth: true,
                    error: Boolean(startDateError),
                    helperText: undefined,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        height: "50px",
                        borderRadius: "8px",
                      },
                    },
                  },
                }}
              />
              <Box
                sx={{
                  minHeight: {
                    xs: startDateError ? "20px" : 0,
                    sm: startDateError || endDateError ? "20px" : 0,
                  },
                  mt: startDateError || endDateError ? 0.5 : 0,
                  px: 1.75,
                  transition: "min-height 0.15s ease",
                }}
              >
                {startDateError && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "error.main",
                      fontSize: "0.75rem",
                      lineHeight: 1.25,
                      fontWeight: 500,
                      display: "block",
                    }}
                  >
                    {startDateError}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ~ Separator Box */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                justifyContent: "center",
                height: "50px",
                userSelect: "none",
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  color: "#94A3B8",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  lineHeight: 1,
                }}
              >
                ~
              </Typography>
            </Box>

            {/* End Date Field Wrapper */}
            <Box
              sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}
            >
              <DatePicker
                label="Ngày kết thúc"
                format="DD/MM/YYYY"
                value={
                  endDate && dayjs(endDate, "YYYY-MM-DD").isValid()
                    ? dayjs(endDate, "YYYY-MM-DD")
                    : null
                }
                minDate={
                  startDate && dayjs(startDate, "YYYY-MM-DD").isValid()
                    ? dayjs(startDate, "YYYY-MM-DD")
                    : undefined
                }
                onChange={(newValue) => {
                  const nextEnd =
                    newValue && newValue.isValid()
                      ? newValue.format("YYYY-MM-DD")
                      : "";
                  onDateChangeAttempt(startDate, nextEnd);
                }}
                slotProps={{
                  actionBar: {
                    actions: ["clear", "accept"],
                  },
                  textField: {
                    required: true,
                    fullWidth: true,
                    error: Boolean(endDateError),
                    helperText: undefined,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        height: "50px",
                        borderRadius: "8px",
                      },
                    },
                  },
                }}
              />
              <Box
                sx={{
                  minHeight: {
                    xs: endDateError ? "20px" : 0,
                    sm: startDateError || endDateError ? "20px" : 0,
                  },
                  mt: startDateError || endDateError ? 0.5 : 0,
                  px: 1.75,
                  transition: "min-height 0.15s ease",
                }}
              >
                {endDateError && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "error.main",
                      fontSize: "0.75rem",
                      lineHeight: 1.25,
                      fontWeight: 500,
                      display: "block",
                    }}
                  >
                    {endDateError}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Duration Badge */}
            <Box
              sx={{
                gridColumn: { xs: "1", sm: "1 / -1", lg: "auto" },
                height: "50px",
                px: 2,
                py: 0.5,
                borderRadius: "8px",
                bgcolor: dateRangeValidation.isValid
                  ? "#EFF6FF"
                  : !startDate || !endDate
                  ? "background.default"
                  : "#FEF2F2",
                border: "1px solid",
                borderColor: dateRangeValidation.isValid
                  ? "#BFDBFE"
                  : !startDate || !endDate
                  ? "divider"
                  : "#FECACA",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                boxSizing: "border-box",
                minWidth: { xs: "100%", sm: "fit-content", lg: 200 },
                width: { xs: "100%", sm: "fit-content", lg: "auto" },
                transition:
                  "background-color 0.2s ease, border-color 0.2s ease",
              }}
            >
              <CalendarMonthOutlinedIcon
                sx={{
                  color: dateRangeValidation.isValid
                    ? "primary.main"
                    : !startDate || !endDate
                    ? "text.secondary"
                    : "error.main",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    fontSize: "0.75rem",
                    lineHeight: 1.15,
                    fontWeight: 500,
                  }}
                >
                  Thời lượng tính toán
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    lineHeight: 1.25,
                    color: dateRangeValidation.isValid
                      ? "#1E40AF"
                      : !startDate || !endDate
                      ? "#64748B"
                      : "#DC2626",
                  }}
                >
                  {!startDate || !endDate
                    ? "--"
                    : dateRangeValidation.isValid
                    ? duration.label
                    : "Không hợp lệ"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Description - Resizable Textarea */}
        <Grid sx={{ width: "100%" }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Mô tả chuyến đi"
            placeholder="Cảm nhận, ấn tượng hoặc tóm tắt những kỷ niệm đáng nhớ của chuyến đi..."
            {...register("description")}
            sx={{
              "& textarea": {
                resize: "vertical",
                minHeight: "90px",
              },
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
