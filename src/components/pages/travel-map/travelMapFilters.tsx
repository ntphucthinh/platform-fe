import React, { useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  Autocomplete,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import type { ILocationFilterState } from "@/types/pages/travel-map/travelMap";
import { LocationStatus } from "@/constants/travelMap";
import { useCountries, type IGlobalCountry } from "@/hooks/common/useGlobalGeo";

const STATUS_OPTIONS = [
  { value: LocationStatus.Visited, label: "Đã ghé thăm" },
  { value: LocationStatus.Wishlist, label: "Muốn đến (Wishlist)" },
] as const;

type StatusOption = (typeof STATUS_OPTIONS)[number];

interface TravelMapFiltersProps {
  filters: ILocationFilterState;
  totalLocations: number;
  selectedCountryCode?: string | null;
  onFilterChange: (
    updater: (prev: ILocationFilterState) => ILocationFilterState,
  ) => void;
  onSelectCountry?: (code: string | null) => void;
  onResetFilters: () => void;
}

export const TravelMapFilters: React.FC<TravelMapFiltersProps> = ({
  filters,
  totalLocations,
  selectedCountryCode,
  onFilterChange,
  onSelectCountry,
  onResetFilters,
}) => {
  const countries = useCountries();

  const selectedCountry = useMemo(() => {
    if (!selectedCountryCode) return null;
    return countries.find((c) => c.iso2 === selectedCountryCode) ?? null;
  }, [countries, selectedCountryCode]);

  const selectedStatusOption = useMemo(() => {
    if (!filters.status) return null;
    return STATUS_OPTIONS.find((opt) => opt.value === filters.status) ?? null;
  }, [filters.status]);

  const isFiltered = Boolean(filters.status) || Boolean(selectedCountryCode);

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #E2E8F0",
        p: { xs: 2, sm: 2.25 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      {/* Selectors: Country & Status only */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 1.5,
          flex: 1,
          flexWrap: { xs: "nowrap", sm: "wrap" },
        }}
      >
        {/* Country Selector: Nhảy đến quốc gia & highlight ranh giới */}
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
          onChange={(_, newValue) =>
            onSelectCountry?.(newValue ? newValue.iso2 : null)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Quốc gia"
              placeholder="Chọn quốc gia..."
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#F8FAFC",
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
                    <Typography
                      sx={{ fontSize: "11.5px", color: "#64748B" }}
                    >
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
          sx={{
            minWidth: { xs: "100%", sm: 260, md: 300 },
            width: { xs: "100%", sm: 260, md: 300 },
          }}
        />

        {/* Status Selector: Dùng Autocomplete đồng bộ giao diện & close icon với Quốc gia */}
        <Autocomplete<StatusOption, false, false, false>
          size="small"
          options={STATUS_OPTIONS}
          getOptionLabel={(option) => option.label}
          value={selectedStatusOption}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, newValue) =>
            onFilterChange((prev) => ({
              ...prev,
              status: newValue ? newValue.value : undefined,
            }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Trạng thái"
              placeholder="Chọn trạng thái..."
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#F8FAFC",
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
                  fontWeight: 500,
                  fontSize: "13.5px",
                  color: "#0F172A",
                  py: 0.75,
                }}
              >
                {option.label}
              </Box>
            );
          }}
          sx={{
            minWidth: { xs: "100%", sm: 220, md: 240 },
            width: { xs: "100%", sm: 220, md: 240 },
          }}
        />
      </Box>

      {/* Right side: Count & Reset Action */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "space-between", md: "flex-end" },
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Chip
          icon={<FilterListIcon sx={{ fontSize: 16 }} />}
          label={
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {totalLocations} địa điểm
            </Typography>
          }
          size="small"
          sx={{
            bgcolor: "#EFF6FF",
            color: "#1976D2",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        />

        {isFiltered && (
          <Button
            size="small"
            variant="text"
            startIcon={<RestartAltIcon />}
            onClick={onResetFilters}
            sx={{
              textTransform: "none",
              color: "#64748B",
              fontWeight: 600,
              "&:hover": { color: "#0F172A", bgcolor: "#F1F5F9" },
            }}
          >
            Xóa bộ lọc
          </Button>
        )}
      </Box>
    </Box>
  );
};
