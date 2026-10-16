import React from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import type {
  ILocationFilterState,
  LocationStatus,
} from "@/types/pages/travel-map/travelMap";

interface TravelMapFiltersProps {
  filters: ILocationFilterState;
  availableYears: number[];
  totalLocations: number;
  filteredCount: number;
  onFilterChange: (updater: (prev: ILocationFilterState) => ILocationFilterState) => void;
  onResetFilters: () => void;
}

export const TravelMapFilters: React.FC<TravelMapFiltersProps> = ({
  filters,
  availableYears,
  totalLocations,
  filteredCount,
  onFilterChange,
  onResetFilters,
}) => {
  const isFiltered =
    Boolean(filters.search.trim()) ||
    filters.status !== "ALL" ||
    filters.year !== "ALL";

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
            flex: { xs: "1 1 auto", sm: "1 1 320px" },
            width: { xs: "100%", sm: "auto" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "#F8FAFC",
            },
          }}
        />

        {/* Status Filter */}
        <FormControl
          size="small"
          sx={{ minWidth: 160, width: { xs: "100%", sm: "auto" } }}
        >
          <InputLabel id="travel-map-status-label">Trạng thái</InputLabel>
          <Select
            labelId="travel-map-status-label"
            label="Trạng thái"
            value={filters.status}
            onChange={(e) =>
              onFilterChange((prev) => ({
                ...prev,
                status: e.target.value as "ALL" | LocationStatus,
              }))
            }
            sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
          >
            <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
            <MenuItem value="Visited">Đã ghé thăm</MenuItem>
            <MenuItem value="Wishlist">Muốn đến (Wishlist)</MenuItem>
          </Select>
        </FormControl>

        {/* Year Filter */}
        <FormControl
          size="small"
          sx={{ minWidth: 140, width: { xs: "100%", sm: "auto" } }}
        >
          <InputLabel id="travel-map-year-label">Năm chuyến đi</InputLabel>
          <Select
            labelId="travel-map-year-label"
            label="Năm chuyến đi"
            value={filters.year}
            onChange={(e) =>
              onFilterChange((prev) => ({
                ...prev,
                year: e.target.value === "ALL" ? "ALL" : Number(e.target.value),
              }))
            }
            sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
          >
            <MenuItem value="ALL">Tất cả năm</MenuItem>
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
            isFiltered ? (
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {filteredCount} / {totalLocations} địa điểm
              </Typography>
            ) : (
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {totalLocations} địa điểm
              </Typography>
            )
          }
          size="small"
          sx={{
            bgcolor: isFiltered ? "#EFF6FF" : "#F1F5F9",
            color: isFiltered ? "#1976D2" : "#475569",
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
