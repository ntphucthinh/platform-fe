import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import type { ITravelMapSummary } from "@/types/pages/travel-map/travelMap";

interface TravelMapHeaderProps {
  summary: ITravelMapSummary;
  viewMode: "map" | "list";
  onViewModeChange: (mode: "map" | "list") => void;
  onOpenCreate: () => void;
}

export const TravelMapHeader: React.FC<TravelMapHeaderProps> = ({
  summary,
  viewMode,
  onViewModeChange,
  onOpenCreate,
}) => {
  const cards = [
    {
      title: "Tổng địa điểm",
      value: summary.totalLocations,
      subtitle: "Điểm đến đã lưu",
      icon: (
        <LocationOnOutlinedIcon
          sx={{ fontSize: { xs: 20, sm: 22 }, color: "#1976D2" }}
        />
      ),
      bgColor: "#EFF6FF",
      borderColor: "#BFDBFE",
    },
    {
      title: "Đã ghé thăm",
      value: summary.visitedLocations,
      subtitle: "Đã từng đặt chân",
      icon: (
        <CheckCircleOutlineRoundedIcon
          sx={{ fontSize: { xs: 20, sm: 22 }, color: "#059669" }}
        />
      ),
      bgColor: "#ECFDF5",
      borderColor: "#A7F3D0",
    },
    {
      title: "Muốn đến",
      value: summary.wishlistLocations,
      subtitle: "Kế hoạch tương lai",
      icon: (
        <BookmarkBorderRoundedIcon
          sx={{ fontSize: { xs: 20, sm: 22 }, color: "#D97706" }}
        />
      ),
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
    },
    {
      title: "Chuyến đi hoàn thành",
      value: summary.completedTripsCount,
      subtitle: "Hành trình đã thực hiện",
      icon: (
        <FlightTakeoffRoundedIcon
          sx={{ fontSize: { xs: 20, sm: 22 }, color: "#7C3AED" }}
        />
      ),
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
      {/* Top Banner Toolbar */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          py: { xs: 1.5, sm: 1.75 },
          px: { xs: 2, sm: 2.5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              fontSize: { xs: "1.2rem", sm: "1.35rem" },
              letterSpacing: "-0.01em",
              mb: 0.25,
            }}
          >
            Bản đồ hành trình
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontSize: "0.825rem", lineHeight: 1.4 }}
          >
            Khám phá các điểm đến đã ghi dấu chân, nơi muốn đến và toàn bộ kỷ
            niệm gắn liền với từng vùng đất.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "space-between", md: "flex-end" },
            flexWrap: "wrap",
          }}
        >
          {/* View Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && onViewModeChange(val)}
            size="small"
            sx={{
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              "& .MuiToggleButton-root": {
                px: 1.5,
                py: 0.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.825rem",
                color: "#64748B",
                border: "none",
                "&.Mui-selected": {
                  bgcolor: "#FFFFFF",
                  color: "#1976D2",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                },
              },
            }}
          >
            <ToggleButton value="map">
              <MapOutlinedIcon sx={{ fontSize: 17, mr: 0.5 }} />
              Bản đồ
            </ToggleButton>
            <ToggleButton value="list">
              <FormatListBulletedOutlinedIcon sx={{ fontSize: 17, mr: 0.5 }} />
              Danh sách
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Add Location Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddLocationAltOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onOpenCreate}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              px: 2,
              py: 0.65,
              boxShadow: "none",
              whiteSpace: "nowrap",
            }}
          >
            Thêm địa điểm
          </Button>
        </Box>
      </Box>

      {/* 4 Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 1.25, sm: 1.5 },
        }}
      >
        {cards.map((c) => (
          <Card
            key={c.title}
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              minHeight: { xs: 70, sm: 75 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              },
            }}
          >
            <CardContent
              sx={{
                py: { xs: 1.25, sm: 1.6 },
                px: { xs: 1.5, sm: 2 },
                "&:last-child": { pb: { xs: 1.25, sm: 1.6 } },
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.75 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: "10px",
                  bgcolor: c.bgColor,
                  border: `1px solid ${c.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    display: "block",
                    fontWeight: 700,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: { xs: "0.01em", sm: "0.03em" },
                    fontSize: { xs: "0.62rem", sm: "0.72rem" },
                    lineHeight: 1.3,
                    mb: 0.35,
                  }}
                >
                  {c.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "baseline" },
                    gap: { xs: 0.1, sm: 0.75 },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 800,
                      color: "#0F172A",
                      fontSize: { xs: "1.15rem", sm: "1.42rem" },
                      lineHeight: 1.1,
                    }}
                  >
                    {c.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      color: "#94A3B8",
                      fontSize: { xs: "0.68rem", sm: "0.76rem" },
                      lineHeight: 1.2,
                      maxWidth: "100%",
                    }}
                  >
                    {c.subtitle}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
