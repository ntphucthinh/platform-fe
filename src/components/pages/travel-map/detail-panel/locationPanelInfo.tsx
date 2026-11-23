import React from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import dayjs from "dayjs";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";

export interface LocationPanelInfoProps {
  location: ILocationWithDetails;
}

export const LocationPanelInfo: React.FC<LocationPanelInfoProps> = ({
  location,
}) => {
  return (
    <>
      {/* Title & Address */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            mb: 0.75,
          }}
        >
          {location.countryCode && (
            <Box
              component="img"
              loading="lazy"
              width="24"
              height="16"
              src={`https://flagcdn.com/${location.countryCode.toLowerCase()}.svg`}
              alt={location.countryCode}
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
          )}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              fontSize: "1.35rem",
              wordBreak: "break-word",
            }}
          >
            {location.locationName || location.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 0.75,
            color: "#64748B",
            fontSize: "0.875rem",
            mb: 1.5,
          }}
        >
          <LocationOnOutlinedIcon
            sx={{ fontSize: 18, color: "#94A3B8", mt: 0.25, flexShrink: 0 }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#64748B", wordBreak: "break-word" }}
          >
            {location.address}
          </Typography>
        </Box>

        {/* Coordinates & Google Maps Link */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.25,
            bgcolor: "#F8FAFC",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#64748B", fontFamily: "monospace" }}
          >
            {typeof location.latitude === "number" &&
            !isNaN(location.latitude) &&
            typeof location.longitude === "number" &&
            !isNaN(location.longitude)
              ? `${location.latitude.toFixed(
                  4,
                )}, ${location.longitude.toFixed(4)}`
              : "Chưa có tọa độ"}
          </Typography>

          {location.googleMapsUrl && (
            <Button
              size="small"
              variant="text"
              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                p: 0,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
                color: "#1976D2",
              }}
            >
              Mở Google Maps
            </Button>
          )}
        </Box>
      </Box>

      {/* Compact Metrics Strip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
          p: 1.25,
          bgcolor: "#F8FAFC",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <FlightTakeoffRoundedIcon sx={{ fontSize: 16, color: "#1976D2" }} />
          <Typography
            variant="body2"
            sx={{ fontSize: "0.825rem", fontWeight: 600, color: "#0F172A" }}
          >
            {location.visitCount > 0
              ? `${location.visitCount} lần ghé thăm`
              : "Chưa ghé thăm"}
          </Typography>
        </Box>

        <Box sx={{ width: "1px", height: 16, bgcolor: "#CBD5E1" }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <PhotoCameraBackOutlinedIcon
            sx={{ fontSize: 16, color: "#059669" }}
          />
          <Typography
            variant="body2"
            sx={{ fontSize: "0.825rem", fontWeight: 600, color: "#0F172A" }}
          >
            {location.totalPhotos} ảnh
          </Typography>
        </Box>

        {location.latestVisitDate && (
          <>
            <Box sx={{ width: "1px", height: 16, bgcolor: "#CBD5E1" }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarMonthOutlinedIcon
                sx={{ fontSize: 14, color: "#64748B" }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.775rem",
                  color: "#64748B",
                  fontWeight: 500,
                }}
              >
                Gần nhất: {dayjs(location.latestVisitDate).format("MM/YYYY")}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* Description & Notes */}
      {(location.description || location.notes) && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {location.description && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#334155", mb: 0.5 }}
              >
                Giới thiệu
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#475569",
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                }}
              >
                {location.description}
              </Typography>
            </Box>
          )}

          {location.notes && (
            <Box
              sx={{
                p: 1.75,
                bgcolor: "#FFFBEB",
                border: "1px solid #FDE68A",
                borderRadius: "10px",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.25,
              }}
            >
              <NotesOutlinedIcon
                sx={{
                  fontSize: 18,
                  color: "#D97706",
                  mt: 0.25,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#92400E",
                    display: "block",
                    mb: 0.25,
                  }}
                >
                  Ghi chú cá nhân
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#78350F",
                    fontSize: "0.85rem",
                    wordBreak: "break-word",
                  }}
                >
                  {location.notes}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
