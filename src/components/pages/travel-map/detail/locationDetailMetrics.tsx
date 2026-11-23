import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import dayjs from "dayjs";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";

export interface LocationDetailMetricsProps {
  details: ILocationWithDetails;
}

export const LocationDetailMetrics: React.FC<LocationDetailMetricsProps> = ({
  details,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        gap: 2,
      }}
    >
      {/* Metric 1: Latest visit date */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: "#EFF6FF",
            color: "#1976D2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Lần ghé thăm gần nhất
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#0F172A", mt: 0.25 }}
          >
            {details.latestVisitDate
              ? dayjs(details.latestVisitDate).format("DD/MM/YYYY")
              : "Chưa có thông tin"}
          </Typography>
        </Box>
      </Box>

      {/* Metric 2: Total memories */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: "#ECFDF5",
            color: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FlightTakeoffRoundedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Số chuyến đi đã lưu
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#0F172A", mt: 0.25 }}
          >
            {details.memories.length} chuyến đi
          </Typography>
        </Box>
      </Box>

      {/* Metric 3: GPS Coordinates & Google Maps Link */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: "14px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: "#FEF3C7",
            color: "#D97706",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MapOutlinedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Tọa độ địa lý
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              fontFamily: "monospace",
              mt: 0.25,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {typeof details.latitude === "number" &&
            typeof details.longitude === "number"
              ? `${details.latitude.toFixed(4)}, ${details.longitude.toFixed(
                  4,
                )}`
              : "Chưa có tọa độ"}
          </Typography>
          {details.googleMapsUrl && (
            <Button
              size="small"
              variant="text"
              href={details.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<OpenInNewIcon sx={{ fontSize: 13 }} />}
              sx={{
                p: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
                color: "#1976D2",
                mt: 0.25,
              }}
            >
              Mở trên Google Maps
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
