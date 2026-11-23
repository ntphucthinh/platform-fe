import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { Link as RouterLink } from "react-router-dom";

export interface LocationDetailHeaderProps {
  locationName?: string;
  onBack: () => void;
  onEdit: () => void;
}

export const LocationDetailHeader: React.FC<LocationDetailHeaderProps> = ({
  locationName = "",
  onBack,
  onEdit,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Breadcrumbs */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          component={RouterLink}
          to="/admin/travel-map"
          startIcon={<ExploreOutlinedIcon fontSize="small" />}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            p: 0,
            minWidth: "auto",
            "&:hover": { color: "primary.main", bgcolor: "transparent" },
          }}
        >
          Bản đồ du lịch
        </Button>
        <Typography sx={{ color: "#94A3B8", flexShrink: 0 }}>/</Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#0F172A",
            fontWeight: 700,
            maxWidth: { xs: 160, sm: 300 },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {locationName}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: "divider",
            color: "text.secondary",
            width: { xs: "100%", sm: "auto" },
            minHeight: 40,
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Quay lại bản đồ
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditOutlinedIcon />}
          onClick={onEdit}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            width: { xs: "100%", sm: "auto" },
            minHeight: 40,
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Chỉnh sửa điểm đến
        </Button>
      </Box>
    </Box>
  );
};
