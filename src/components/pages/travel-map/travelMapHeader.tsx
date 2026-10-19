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
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 26, color: "#1976D2" }} />,
      bgColor: "#EFF6FF",
      borderColor: "#BFDBFE",
    },
    {
      title: "Đã ghé thăm",
      value: summary.visitedLocations,
      subtitle: "Đã từng đặt chân",
      icon: (
        <CheckCircleOutlineRoundedIcon
          sx={{ fontSize: 26, color: "#059669" }}
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
        <BookmarkBorderRoundedIcon sx={{ fontSize: 26, color: "#D97706" }} />
      ),
      bgColor: "#FFFBEB",
      borderColor: "#FDE68A",
    },
    {
      title: "Chuyến đi hoàn thành",
      value: summary.completedTripsCount,
      subtitle: "Hành trình đã thực hiện",
      icon: (
        <FlightTakeoffRoundedIcon sx={{ fontSize: 26, color: "#7C3AED" }} />
      ),
      bgColor: "#F5F3FF",
      borderColor: "#DDD6FE",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Top Banner Toolbar */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          p: { xs: 2.5, sm: 3 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              fontSize: { xs: "1.45rem", sm: "1.75rem" },
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            Bản đồ hành trình
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Khám phá các điểm đến đã ghi dấu chân, nơi muốn đến và toàn bộ kỷ
            niệm gắn liền với từng vùng đất.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
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
              borderRadius: "10px",
              "& .MuiToggleButton-root": {
                px: 1.75,
                py: 0.75,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
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
              <MapOutlinedIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Bản đồ
            </ToggleButton>
            <ToggleButton value="list">
              <FormatListBulletedOutlinedIcon sx={{ fontSize: 18, mr: 0.75 }} />
              Danh sách
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Add Location Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddLocationAltOutlinedIcon />}
            onClick={onOpenCreate}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 2.25,
              py: 0.9,
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
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        {cards.map((c) => (
          <Card
            key={c.title}
            elevation={0}
            sx={{
              borderRadius: "14px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              height: "100%",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              },
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {c.title}
                </Typography>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "10px",
                    bgcolor: c.bgColor,
                    border: `1px solid ${c.borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {c.icon}
                </Box>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  lineHeight: 1.1,
                  mb: 0.5,
                }}
              >
                {c.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                {c.subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
