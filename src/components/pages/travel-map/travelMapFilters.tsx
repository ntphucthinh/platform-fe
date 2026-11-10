import React, { useMemo } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Typography,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import type { ILocationFilterState } from "@/types/pages/travel-map/travelMap";
import { LocationStatus } from "@/constants/travelMap";
import { useCountries, type IGlobalCountry } from "@/hooks/common/useGlobalGeo";

interface TravelMapFiltersProps {
  filters: ILocationFilterState;
  availableYears: number[];
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
  availableYears,
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

  const isFiltered =
    Boolean(filters.search.trim()) ||
    Boolean(filters.status) ||
    filters.year !== undefined ||
    Boolean(selectedCountryCode);

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
      {/* Search Input & Selectors */}
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
        {/* Search */}
        <TextField
          size="small"
          placeholder="Tìm theo tên địa điểm, tỉnh thành hoặc địa chỉ..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange((prev) => ({ ...prev, search: e.target.value }))
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: { xs: "1 1 auto", sm: "1 1 240px", md: "1 1 280px" },
            width: { xs: "100%", sm: "auto" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "#F8FAFC",
            },
          }}
        />

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
            minWidth: { xs: "100%", sm: 260, md: 280 },
            width: { xs: "100%", sm: 260, md: 280 },
          }}
        />

        {/* Status Filter */}
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 260, md: 280 },
            width: { xs: "100%", sm: 260, md: 280 },
          }}
        >
          <InputLabel id="travel-map-status-label">Trạng thái</InputLabel>
          <Select<LocationStatus | "">
            labelId="travel-map-status-label"
            label="Trạng thái"
            value={filters.status ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange((prev) => ({
                ...prev,
                status: val ? (val as LocationStatus) : undefined,
              }));
            }}
            sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
          >
            <MenuItem value="">
              <em>Không chọn</em>
            </MenuItem>
            <MenuItem value={LocationStatus.Visited}>Đã ghé thăm</MenuItem>
            <MenuItem value={LocationStatus.Wishlist}>
              Muốn đến (Wishlist)
            </MenuItem>
          </Select>
        </FormControl>

        {/* Year Filter */}
        <FormControl
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: 260, md: 280 },
            width: { xs: "100%", sm: 260, md: 280 },
          }}
        >
          <InputLabel id="travel-map-year-label">Năm chuyến đi</InputLabel>
          <Select<number | "">
            labelId="travel-map-year-label"
            label="Năm chuyến đi"
            value={filters.year ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange((prev) => ({
                ...prev,
                year: val === "" ? undefined : Number(val),
              }));
            }}
            sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
          >
            <MenuItem value="">
              <em>Không chọn</em>
            </MenuItem>
            {availableYears.map((yr) => (
              <MenuItem key={yr} value={yr}>
                Năm {yr}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
