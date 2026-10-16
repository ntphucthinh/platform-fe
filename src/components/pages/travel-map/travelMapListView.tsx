import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import dayjs from "dayjs";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";
import { useNavigate } from "react-router-dom";

interface TravelMapListViewProps {
  locations: ILocationWithDetails[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
  onResetFilters: () => void;
}

export const TravelMapListView: React.FC<TravelMapListViewProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onResetFilters,
}) => {
  const navigate = useNavigate();
  if (locations.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px dashed #CBD5E1",
          bgcolor: "#F8FAFC",
          p: { xs: 4, sm: 6 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "#EFF6FF",
            color: "#1976D2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <SearchOffOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}
        >
          Không tìm thấy địa điểm nào
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#64748B", maxWidth: 460, mx: "auto", mb: 2.5 }}
        >
          Không có địa điểm nào phù hợp với từ khóa hoặc bộ lọc đã chọn. Hãy thử
          thay đổi từ khóa tìm kiếm hoặc làm mới bộ lọc.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={onResetFilters}
          sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
        >
          Xóa toàn bộ bộ lọc
        </Button>
      </Card>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 2.5,
      }}
    >
      {locations.map((loc) => {
        const isSelected = loc.id === selectedLocationId;
        const isVisited = loc.status === "Visited";

        return (
          <Card
            key={loc.id}
              elevation={0}
              onClick={() => onSelectLocation(loc.id)}
              sx={{
                borderRadius: "16px",
                border: isSelected
                  ? "2px solid #1976D2"
                  : "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "all 0.2s ease-in-out",
                boxShadow: isSelected
                  ? "0 4px 16px rgba(25, 118, 210, 0.15)"
                  : "none",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  borderColor: isSelected ? "#1976D2" : "#CBD5E1",
                },
              }}
            >
              {/* Cover Image & Status Badge */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="170"
                  image={loc.coverImage || DEFAULT_NO_IMAGE}
                  alt={loc.name}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = DEFAULT_NO_IMAGE;
                  }}
                  sx={{ objectFit: "cover" }}
                />
                <Chip
                  label={isVisited ? "Đã ghé thăm" : "Muốn đến"}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    bgcolor: isVisited ? "#059669" : "#D97706",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>

              <CardContent
                sx={{
                  p: 2.5,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#0F172A",
                      fontSize: "1.1rem",
                      mb: 0.5,
                    }}
                  >
                    {loc.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#64748B",
                      fontSize: "0.85rem",
                      mb: 1.5,
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 16, color: "#94A3B8", flexShrink: 0 }}
                    />
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "#64748B", fontSize: "0.85rem" }}
                    >
                      {loc.address}
                    </Typography>
                  </Box>

                  {loc.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#475569",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {loc.description}
                    </Typography>
                  )}
                </Box>

                {/* Bottom stats row */}
                <Box
                  sx={{
                    pt: 2,
                    borderTop: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#0F172A",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      <CollectionsBookmarkOutlinedIcon
                        sx={{ fontSize: 16, color: "#1976D2" }}
                      />
                      {loc.visitCount > 0
                        ? `${loc.visitCount} chuyến đi`
                        : "Chưa có chuyến"}
                    </Box>

                    {loc.latestVisitDate && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "#64748B",
                          fontSize: "0.8rem",
                        }}
                      >
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 15 }} />
                        {dayjs(loc.latestVisitDate).format("MM/YYYY")}
                      </Box>
                    )}
                  </Box>

                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/travel-map/${loc.id}`);
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.825rem",
                      p: 0,
                    }}
                  >
                    Chi tiết
                  </Button>
                </Box>
              </CardContent>
            </Card>
        );
      })}
    </Box>
  );
};
