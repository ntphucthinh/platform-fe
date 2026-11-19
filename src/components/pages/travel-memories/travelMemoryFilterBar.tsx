import React from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";
import type { IGlobalCountry } from "@/hooks/common/useGlobalGeo";

export interface TravelMemoryFilterBarProps {
  selectedYear: Dayjs | null;
  onYearChange: (newValue: Dayjs | null) => void;
  countries: IGlobalCountry[];
  selectedCountry: IGlobalCountry | null;
  onCountryChange: (countryCode: string) => void;
  travelLocationsSelections: { label: string; value: string | number }[];
  selectedLocation: { label: string; value: string | number } | null;
  onLocationChange: (locId: number | "") => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  totalTrips: number;
  uniqueDestinationsCount: number;
  totalPhotosCount: number;
  onCreateNew: () => void;
}

export const TravelMemoryFilterBar: React.FC<TravelMemoryFilterBarProps> = ({
  selectedYear,
  onYearChange,
  countries,
  selectedCountry,
  onCountryChange,
  travelLocationsSelections,
  selectedLocation,
  onLocationChange,
  isFiltered,
  onResetFilters,
  totalTrips,
  uniqueDestinationsCount,
  totalPhotosCount,
  onCreateNew,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.25 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.25,
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
      }}
    >
      {/* 1. Left Filters */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          flexWrap: "wrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Year Filter */}
        <DatePicker
          views={["year"]}
          openTo="year"
          format="YYYY"
          value={selectedYear}
          onChange={onYearChange}
          slotProps={{
            field: { clearable: true },
            actionBar: { actions: ["clear", "accept"] },
            textField: {
              size: "small",
              sx: {
                width: { xs: "100%", sm: 110 },
                "& .MuiOutlinedInput-root": {
                  height: 40,
                  boxSizing: "border-box",
                  borderRadius: "8px",
                  bgcolor: "#F8FAFC",
                  fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#CBD5E1" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                  "& .MuiOutlinedInput-input": {
                    py: "0 !important",
                    fontSize: "0.875rem",
                  },
                },
              },
            },
          }}
        />

        {/* Country Filter */}
        <Autocomplete<IGlobalCountry, false, false, false>
          size="small"
          options={countries}
          getOptionLabel={(option) =>
            option.vietnameseName !== option.name
              ? `${option.vietnameseName} (${option.name})`
              : option.name
          }
          value={selectedCountry}
          isOptionEqualToValue={(option, value) => option.iso2 === value.iso2}
          onChange={(_, newValue) => {
            onCountryChange(newValue ? newValue.iso2 : "");
          }}
          sx={{
            width: { xs: "100%", sm: 220, md: 230 },
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              height: 40,
              boxSizing: "border-box",
              borderRadius: "8px",
              bgcolor: "#F8FAFC",
              fontSize: "0.875rem",
              "& fieldset": { borderColor: "#CBD5E1" },
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
              "& .MuiOutlinedInput-input": {
                py: "0 !important",
                fontSize: "0.875rem",
              },
              "& .MuiAutocomplete-input": {
                py: "0 !important",
                fontSize: "0.875rem",
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Tất cả quốc gia..."
              size="small"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  startAdornment: selectedCountry ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 0.25,
                        pr: 0.5,
                      }}
                    >
                      <Box
                        component="img"
                        width="20"
                        height="14"
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
                        pl: 0.25,
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
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <Box
                key={key}
                component="li"
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
                  width="20"
                  height="14"
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
        />

        {/* Location Filter */}
        <Autocomplete<{ label: string; value: string | number }, false, false, false>
          size="small"
          options={travelLocationsSelections}
          getOptionLabel={(option) => option.label}
          value={selectedLocation}
          isOptionEqualToValue={(option, value) =>
            Number(option.value) === Number(value.value)
          }
          onChange={(_, newValue) => {
            onLocationChange(newValue ? Number(newValue.value) : "");
          }}
          sx={{
            width: { xs: "100%", sm: 220, md: 230 },
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              height: 40,
              boxSizing: "border-box",
              borderRadius: "8px",
              bgcolor: "#F8FAFC",
              fontSize: "0.875rem",
              "& fieldset": { borderColor: "#CBD5E1" },
              "&:hover fieldset": { borderColor: "primary.main" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
              "& .MuiOutlinedInput-input": {
                py: "0 !important",
                fontSize: "0.875rem",
              },
              "& .MuiAutocomplete-input": {
                py: "0 !important",
                fontSize: "0.875rem",
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Tất cả địa điểm..."
              size="small"
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  startAdornment: (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 0.25,
                        pr: 0.5,
                        color: "#94A3B8",
                      }}
                    >
                      <LocationOnOutlinedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                      {params.slotProps?.input?.startAdornment}
                    </Box>
                  ),
                },
              }}
            />
          )}
        />

        {/* Reset Filter Button */}
        {isFiltered && (
          <Button
            size="small"
            variant="text"
            startIcon={<RestartAltIcon sx={{ fontSize: 17 }} />}
            onClick={onResetFilters}
            sx={{
              height: 40,
              borderRadius: "8px",
              textTransform: "none",
              color: "#64748B",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 1.25,
              "&:hover": { color: "#0F172A", bgcolor: "#F1F5F9" },
            }}
          >
            Xóa lọc
          </Button>
        )}
      </Box>

      {/* 2. Right Action & Stats */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          ml: { xs: 0, sm: "auto" },
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "stretch", sm: "flex-end" },
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            height: 40,
            borderRadius: "8px",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#475569",
            fontSize: "0.8125rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <span>{totalTrips} chuyến đi</span>
          <span style={{ color: "#94A3B8" }}>•</span>
          <span>{uniqueDestinationsCount} địa điểm</span>
          <span style={{ color: "#94A3B8" }}>•</span>
          <span>{totalPhotosCount} ảnh</span>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon sx={{ fontSize: 19 }} />}
          onClick={onCreateNew}
          sx={{
            height: 40,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            px: 2,
            boxShadow: "none",
            whiteSpace: "nowrap",
            flex: { xs: 1, sm: "initial" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          Thêm chuyến đi
        </Button>
      </Box>
    </Card>
  );
};
