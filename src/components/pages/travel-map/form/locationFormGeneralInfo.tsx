import React from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import type { IGlobalCountry } from "@/hooks/common/useGlobalGeo";
import type { ILocationFormData } from "@/types/pages/travel-map/travelMap";

export interface LocationFormGeneralInfoProps {
  allCountries: IGlobalCountry[];
  selectedCountry: IGlobalCountry | null;
  onCountryChange: (country: IGlobalCountry | null) => void;
  formData: ILocationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ILocationFormData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const LocationFormGeneralInfo: React.FC<
  LocationFormGeneralInfoProps
> = ({
  allCountries,
  selectedCountry,
  onCountryChange,
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
      }}
    >
      {/* SELECTBOX: QUỐC GIA */}
      <Autocomplete<IGlobalCountry, false, false, false>
        sx={{ width: "100%" }}
        options={allCountries}
        getOptionLabel={(option) =>
          option.vietnameseName !== option.name
            ? `${option.vietnameseName} (${option.name})`
            : option.name
        }
        value={selectedCountry}
        isOptionEqualToValue={(option, value) => option.iso2 === value.iso2}
        onChange={(_, newValue) => onCountryChange(newValue)}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <Box
              component="li"
              key={key}
              {...rest}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                py: 0.75,
              }}
            >
              <Box
                component="img"
                loading="lazy"
                width="22"
                height="15"
                src={option.flagUrl}
                alt={option.iso2}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                sx={{
                  borderRadius: "2px",
                  objectFit: "cover",
                  border: "1px solid #CBD5E1",
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "13.5px",
                    color: "#0F172A",
                  }}
                >
                  {option.vietnameseName}
                </Typography>
                {option.vietnameseName !== option.name && (
                  <Typography sx={{ fontSize: "11.5px", color: "#64748B" }}>
                    {option.name}
                  </Typography>
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#64748B",
                  fontFamily: "monospace",
                  bgcolor: "#F1F5F9",
                  px: 0.75,
                  py: 0.25,
                  borderRadius: "4px",
                }}
              >
                {option.iso2}
              </Typography>
            </Box>
          );
        }}
        noOptionsText="Không tìm thấy quốc gia"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Quốc gia *"
            placeholder="Chọn quốc gia..."
            size="small"
            error={Boolean(errors.country)}
            helperText={errors.country}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps?.input,
                startAdornment: selectedCountry ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 0.5,
                      pr: 0.5,
                    }}
                  >
                    <Box
                      component="img"
                      width="22"
                      height="15"
                      src={selectedCountry.flagUrl}
                      alt={selectedCountry.iso2}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      sx={{
                        borderRadius: "2px",
                        objectFit: "cover",
                        border: "1px solid #CBD5E1",
                        flexShrink: 0,
                      }}
                    />
                    {params.slotProps?.input?.startAdornment}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pl: 0.5,
                      pr: 0.5,
                      color: "#94A3B8",
                    }}
                  >
                    <PublicOutlinedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    {params.slotProps?.input?.startAdornment}
                  </Box>
                ),
              },
            }}
          />
        )}
      />

      {/* TEXT INPUT: TÊN ĐIỂM ĐẾN */}
      <TextField
        label="Tên điểm đến *"
        placeholder="Ví dụ: Đà Lạt, Hà Nội, Tokyo, Manchester..."
        value={formData.locationName}
        onChange={(e) => {
          const val = e.target.value;
          setFormData((prev) => ({
            ...prev,
            locationName: val,
            name: val,
          }));
          if (errors.locationName) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next.locationName;
              return next;
            });
          }
        }}
        error={Boolean(errors.locationName)}
        helperText={errors.locationName}
        fullWidth
        size="small"
      />
    </Box>
  );
};
