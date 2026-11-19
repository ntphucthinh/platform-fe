import React from "react";
import {
  Card,
  Typography,
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { IItineraryFormData } from "@/types/pages/itineraries/itinerary";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface ItineraryGeneralInfoProps {
  register: UseFormRegister<IItineraryFormData>;
  setValue: UseFormSetValue<IItineraryFormData>;
  errors: FieldErrors<IItineraryFormData>;
  isLoadingLocations: boolean;
  travelLocationsSelections: { label: string; value: string | number }[];
  selectedLocation: { label: string; value: string | number } | null;
  isLoadingThemes: boolean;
  displayedThemes: string[];
  themes: string[];
  handleToggleTheme: (theme: string) => void;
  canToggleThemes: boolean;
  isThemesExpanded: boolean;
  setIsThemesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  availableThemeNames: string[];
  coverImage: string;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  handleCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  travelTipsText: string;
  setTravelTipsText: (val: string) => void;
}

export const ItineraryGeneralInfo: React.FC<ItineraryGeneralInfoProps> = ({
  register,
  setValue,
  errors,
  isLoadingLocations,
  travelLocationsSelections,
  selectedLocation,
  isLoadingThemes,
  displayedThemes,
  themes,
  handleToggleTheme,
  canToggleThemes,
  isThemesExpanded,
  setIsThemesExpanded,
  availableThemeNames,
  coverImage,
  coverInputRef,
  handleCoverUpload,
  travelTipsText,
  setTravelTipsText,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        p: { xs: 2.5, sm: 3.5 },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "#0F172A", mb: 2.5 }}
      >
        1. Thông tin chung
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Tên lịch trình (Full width) */}
        <TextField
          label="Tên lịch trình"
          placeholder="Ví dụ: Khám phá Đà Lạt – 3 ngày 2 đêm thơ mộng"
          {...register("title")}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          fullWidth
          required
          size="medium"
        />

        {/* Row 2: Địa điểm Selectbox */}
        <Autocomplete<
          { label: string; value: string | number },
          false,
          false,
          false
        >
          fullWidth
          loading={isLoadingLocations}
          options={travelLocationsSelections}
          getOptionLabel={(option) => option.label || ""}
          value={selectedLocation}
          isOptionEqualToValue={(option, value) =>
            Number(option.value) === Number(value.value)
          }
          onChange={(_, newValue) => {
            const nextId = newValue ? Number(newValue.value) : null;
            const nextLabel = newValue ? newValue.label : "";
            setValue("locationId", nextId, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("destination", nextLabel, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          noOptionsText="Không tìm thấy địa điểm"
          loadingText="Đang tải danh sách địa điểm..."
          renderInput={(params) => (
            <TextField
              {...params}
              label="Địa điểm"
              placeholder="Chọn địa điểm (không bắt buộc)..."
              error={Boolean(errors.destination)}
              helperText={errors.destination?.message}
            />
          )}
        />

        {/* Row 3: Đối tượng phù hợp */}
        <TextField
          label="Đối tượng phù hợp"
          placeholder="Ví dụ: Cặp đôi, nhóm bạn, gia đình"
          {...register("suitableFor")}
          fullWidth
        />

        {/* Row 4: Chủ đề */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#334155" }}
            >
              Chủ đề chuyến đi
            </Typography>
            {isLoadingThemes && (
              <CircularProgress size={14} sx={{ color: "primary.main" }} />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            {displayedThemes.map((theme) => {
              const isSelected = themes.includes(theme);
              return (
                <Chip
                  key={theme}
                  label={theme}
                  clickable
                  color={isSelected ? "primary" : "default"}
                  variant={isSelected ? "filled" : "outlined"}
                  onClick={() => handleToggleTheme(theme)}
                  sx={{
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                />
              );
            })}

            {canToggleThemes && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setIsThemesExpanded((prev) => !prev)}
                endIcon={
                  isThemesExpanded ? (
                    <KeyboardArrowUpIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="small" />
                  )
                }
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  height: 32,
                  borderColor: "#CBD5E1",
                  color: isThemesExpanded ? "primary.main" : "#475569",
                  bgcolor: "#F8FAFC",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: "primary.main",
                    bgcolor: "#EFF6FF",
                  },
                }}
              >
                {isThemesExpanded
                  ? "Thu gọn"
                  : `Xem thêm (+${
                      availableThemeNames.length - displayedThemes.length
                    })`}
              </Button>
            )}
          </Box>
        </Box>

        {/* Row 5: Mô tả tổng quan */}
        <TextField
          label="Mô tả tổng quan chuyến đi"
          placeholder="Mô tả cảm hứng, không khí, điểm nổi bật của toàn bộ chuyến hành trình..."
          {...register("description")}
          multiline
          rows={3}
          fullWidth
          sx={{
            "& textarea": {
              resize: "vertical",
            },
          }}
        />

        {/* Row 6: Ảnh bìa (Cover Image with Local Preview) */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "#334155", mb: 1 }}
          >
            Ảnh bìa lịch trình
          </Typography>

          <Box
            sx={{
              border: "2px dashed #CBD5E1",
              borderRadius: "12px",
              p: 2.5,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2.5,
              bgcolor: "#F8FAFC",
            }}
          >
            {coverImage && (
              <Box
                component="img"
                src={coverImage}
                alt="Ảnh bìa"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = DEFAULT_NO_IMAGE;
                }}
                sx={{
                  width: { xs: "100%", sm: 180 },
                  height: 120,
                  borderRadius: "8px",
                  objectFit: "cover",
                  bgcolor: "#E2E8F0",
                }}
              />
            )}

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#475569", fontWeight: 500 }}
              >
                Tải lên ảnh bìa đại diện cho toàn bộ lịch trình (JPG, PNG,
                WebP).
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleCoverUpload}
                />
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadOutlinedIcon />}
                  onClick={() => coverInputRef.current?.click()}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Chọn ảnh từ máy
                </Button>

                {coverImage && (
                  <Button
                    variant="text"
                    color="error"
                    startIcon={<DeleteOutlinedIcon />}
                    onClick={() =>
                      setValue("coverImage", "", { shouldDirty: true })
                    }
                    sx={{ textTransform: "none" }}
                  >
                    Xóa ảnh
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Row 7: Lưu ý cho chuyến đi */}
        <TextField
          label="Lưu ý / Mẹo du lịch (Mỗi dòng một lưu ý)"
          value={travelTipsText}
          onChange={(e) => setTravelTipsText(e.target.value)}
          multiline
          rows={3}
          fullWidth
          helperText="Nhập các mẹo thời tiết, chuẩn bị trang phục, vé vào cổng..."
          sx={{
            "& textarea": {
              resize: "vertical",
            },
          }}
        />
      </Box>
    </Card>
  );
};
