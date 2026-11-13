import React, { useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Autocomplete,
} from "@mui/material";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { LocationStatus } from "@/constants/travelMap";
import { useCountries, type IGlobalCountry } from "@/hooks/common/useGlobalGeo";

export interface TravelMapHeaderProps {
  totalLocations: number;
  visitedLocations: number;
  wishlistLocations: number;
  selectedStatus?: LocationStatus;
  selectedCountryCode?: string | null;
  onStatusChange: (status?: LocationStatus) => void;
  onSelectCountry: (countryCode: string | null) => void;
  onResetFilters: () => void;
  viewMode: "map" | "list";
  onViewModeChange: (mode: "map" | "list") => void;
  onOpenCreate: () => void;
}

export const TravelMapHeader: React.FC<TravelMapHeaderProps> = ({
  totalLocations,
  visitedLocations,
  wishlistLocations,
  selectedStatus,
  selectedCountryCode,
  onStatusChange,
  onSelectCountry,
  onResetFilters,
  viewMode,
  onViewModeChange,
  onOpenCreate,
}) => {
  const countries = useCountries();

  const selectedCountry = useMemo(() => {
    if (!selectedCountryCode) return null;
    return countries.find((c) => c.iso2 === selectedCountryCode) ?? null;
  }, [countries, selectedCountryCode]);

  const isFiltered = Boolean(selectedStatus) || Boolean(selectedCountryCode);

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
        p: { xs: 1.25, sm: 1.25 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: 1.25,
      }}
    >
      {/* Left controls: Country Autocomplete + Status Segmented Control */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 1.25,
          flexWrap: "wrap",
          minWidth: 0,
        }}
      >
        {/* Country Selector (Calibrated 40px height) */}
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
            onSelectCountry(newValue ? newValue.iso2 : null)
          }
          sx={{
            width: { xs: "100%", sm: 220, md: 230 },
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              height: 40,
              boxSizing: "border-box",
              borderRadius: "8px",
              bgcolor: "#F8FAFC",
              fontSize: "0.875rem",
              "& fieldset": {
                borderColor: "#CBD5E1",
              },
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
              },
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
        />

        {/* Status Filter Segmented Control (Harmonized 40px height) */}
        <ToggleButtonGroup
          value={selectedStatus ?? "all"}
          exclusive
          onChange={(_, val) => {
            if (!val) return;
            onStatusChange(val === "all" ? undefined : (val as LocationStatus));
          }}
          size="small"
          sx={{
            height: 40,
            bgcolor: "#F8FAFC",
            border: "1px solid #CBD5E1",
            borderRadius: "8px",
            p: "3px",
            gap: "2px",
            display: "inline-flex",
            alignItems: "center",
            boxSizing: "border-box",
            maxWidth: "100%",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "& .MuiToggleButton-root": {
              height: 34,
              minHeight: 34,
              maxHeight: 34,
              px: { xs: 1.25, sm: 1.5 },
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#64748B",
              border: "none",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
              "&.Mui-selected": {
                bgcolor: "#FFFFFF",
                color: "#1976D2",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                fontWeight: 700,
              },
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.03)",
              },
            },
          }}
        >
          <ToggleButton value="all">
            <Typography component="span" sx={{ fontSize: "0.875rem", fontWeight: "inherit" }}>
              Tất cả
            </Typography>
            <Box
              component="span"
              sx={{
                ml: 0.75,
                px: 0.65,
                py: 0.15,
                borderRadius: "10px",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                bgcolor: !selectedStatus ? "rgba(25, 118, 210, 0.1)" : "rgba(100, 116, 139, 0.12)",
                color: !selectedStatus ? "#1976D2" : "#64748B",
                lineHeight: 1,
              }}
            >
              {totalLocations}
            </Box>
          </ToggleButton>

          <ToggleButton value={LocationStatus.Visited}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#059669",
                mr: 0.75,
                flexShrink: 0,
              }}
            />
            <Typography component="span" sx={{ fontSize: "0.875rem", fontWeight: "inherit" }}>
              Đã ghé thăm
            </Typography>
            <Box
              component="span"
              sx={{
                ml: 0.75,
                px: 0.65,
                py: 0.15,
                borderRadius: "10px",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                bgcolor: selectedStatus === LocationStatus.Visited ? "rgba(5, 150, 105, 0.12)" : "rgba(100, 116, 139, 0.12)",
                color: selectedStatus === LocationStatus.Visited ? "#059669" : "#64748B",
                lineHeight: 1,
              }}
            >
              {visitedLocations}
            </Box>
          </ToggleButton>

          <ToggleButton value={LocationStatus.Wishlist}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#D97706",
                mr: 0.75,
                flexShrink: 0,
              }}
            />
            <Typography component="span" sx={{ fontSize: "0.875rem", fontWeight: "inherit" }}>
              Muốn đến
            </Typography>
            <Box
              component="span"
              sx={{
                ml: 0.75,
                px: 0.65,
                py: 0.15,
                borderRadius: "10px",
                fontSize: "0.75rem",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                bgcolor: selectedStatus === LocationStatus.Wishlist ? "rgba(217, 119, 6, 0.12)" : "rgba(100, 116, 139, 0.12)",
                color: selectedStatus === LocationStatus.Wishlist ? "#D97706" : "#64748B",
                lineHeight: 1,
              }}
            >
              {wishlistLocations}
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>

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

      {/* Right controls: View Toggle & Primary Action (Uniform 40px height) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          flexShrink: 0,
          flexWrap: "wrap",
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "space-between", md: "flex-end" },
        }}
      >
        {/* View Toggle (Harmonized 40px height) */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && onViewModeChange(val)}
          size="small"
          sx={{
            height: 40,
            bgcolor: "#F8FAFC",
            border: "1px solid #CBD5E1",
            borderRadius: "8px",
            p: "3px",
            gap: "2px",
            display: "inline-flex",
            alignItems: "center",
            boxSizing: "border-box",
            maxWidth: "100%",
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "& .MuiToggleButton-root": {
              height: 34,
              minHeight: 34,
              maxHeight: 34,
              px: 1.5,
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#64748B",
              border: "none",
              "&.Mui-selected": {
                bgcolor: "#FFFFFF",
                color: "#1976D2",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                fontWeight: 700,
              },
            },
          }}
        >
          <ToggleButton value="map" aria-label="Chế độ bản đồ">
            <MapOutlinedIcon sx={{ fontSize: 18, mr: 0.75 }} />
            Bản đồ
          </ToggleButton>
          <ToggleButton value="list" aria-label="Chế độ danh sách">
            <FormatListBulletedOutlinedIcon sx={{ fontSize: 18, mr: 0.75 }} />
            Danh sách
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Add Location Button (Uniform 40px height) */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddLocationAltOutlinedIcon sx={{ fontSize: 19 }} />}
          onClick={onOpenCreate}
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
          }}
        >
          Thêm địa điểm
        </Button>
      </Box>
    </Box>
  );
};
