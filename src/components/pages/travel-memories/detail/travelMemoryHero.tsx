import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface TravelMemoryHeroProps {
  title: string;
  coverImage?: string;
  destination: string;
  durationLabel: string;
  dateRangeLabel: string;
  totalPhotos: number;
  description?: string | null;
}

export const TravelMemoryHero: React.FC<TravelMemoryHeroProps> = ({
  title,
  coverImage,
  destination,
  durationLabel,
  dateRangeLabel,
  totalPhotos,
  description,
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: "14px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      {/* Cover Image Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 240, sm: 360, md: 420 },
          bgcolor: "#0F172A",
        }}
      >
        <Box
          component="img"
          src={coverImage || DEFAULT_NO_IMAGE}
          alt={title}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = DEFAULT_NO_IMAGE;
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Dark Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.3) 60%, rgba(15, 23, 42, 0.1) 100%)",
          }}
        />

        {/* Banner Floating Details */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 2.5, sm: 4 },
            color: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.2,
              mb: 1.5,
            }}
          >
            <Chip
              icon={
                <AccessTimeOutlinedIcon
                  sx={{
                    fontSize: "15px !important",
                    color: "#FFFFFF !important",
                  }}
                />
              }
              label={durationLabel}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                backdropFilter: "blur(6px)",
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: "4px",
              }}
            />
            <Chip
              icon={
                <PhotoCameraBackOutlinedIcon
                  sx={{
                    fontSize: "15px !important",
                    color: "#FFFFFF !important",
                  }}
                />
              }
              label={`${totalPhotos} hình ảnh`}
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.2)",
                color: "#FFFFFF",
                backdropFilter: "blur(6px)",
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: "4px",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#FFFFFF",
              fontSize: { xs: "1.5rem", sm: "2.1rem" },
              lineHeight: 1.25,
              mb: 1.5,
              wordBreak: "break-word",
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2.5,
              color: "#E2E8F0",
              fontSize: "0.92rem",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, minWidth: 0 }}>
              <LocationOnOutlinedIcon
                sx={{ fontSize: 20, color: "#60A5FA", flexShrink: 0 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
                {destination}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              <CalendarMonthOutlinedIcon
                sx={{ fontSize: 19, color: "#93C5FD", flexShrink: 0 }}
              />
              <Typography variant="body2">{dateRangeLabel}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Description Section */}
      {description && (
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              mb: 1,
            }}
          >
            Nhật ký chuyến đi
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#334155",
              lineHeight: 1.7,
              fontSize: "0.98rem",
              whiteSpace: "pre-line",
              wordBreak: "break-word",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
};
