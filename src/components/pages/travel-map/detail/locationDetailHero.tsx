import React from "react";
import {
  Card,
  CardMedia,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface LocationDetailHeroProps {
  details: ILocationWithDetails;
  isVisited: boolean;
}

export const LocationDetailHero: React.FC<LocationDetailHeroProps> = ({
  details,
  isVisited,
}) => {
  return (
    <Card
      elevation={1}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 260, sm: 380, md: 440 },
          bgcolor: "#0F172A",
        }}
      >
        <CardMedia
          component="img"
          loading="eager"
          image={details.coverImage || DEFAULT_NO_IMAGE}
          alt={details.locationName || details.name}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = DEFAULT_NO_IMAGE;
            e.currentTarget.style.objectFit = "contain";
            e.currentTarget.style.padding = "32px";
            e.currentTarget.style.backgroundColor = "#0F172A";
            e.currentTarget.style.opacity = "0.75";
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit:
              !details.coverImage || details.coverImage === DEFAULT_NO_IMAGE
                ? "contain"
                : "cover",
            p:
              !details.coverImage || details.coverImage === DEFAULT_NO_IMAGE
                ? 4
                : 0,
            opacity:
              !details.coverImage || details.coverImage === DEFAULT_NO_IMAGE
                ? 0.75
                : 1,
          }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.15) 100%)",
          }}
        />

        {/* Floating Details */}
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
          <Box sx={{ mb: 1.5 }}>
            <Chip
              label={isVisited ? "Đã ghé thăm" : "Muốn đến"}
              size="small"
              sx={{
                bgcolor: isVisited ? "#059669" : "#D97706",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.8rem",
                borderRadius: "6px",
              }}
            />
          </Box>

          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#FFFFFF",
              fontSize: { xs: "1.75rem", sm: "2.5rem" },
              lineHeight: 1.2,
              mb: 1.5,
              wordBreak: "break-word",
            }}
          >
            {details.locationName || details.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              flexWrap: "wrap",
              color: "#E2E8F0",
              fontSize: "0.95rem",
            }}
          >
            {details.countryCode && (
              <Box
                component="img"
                loading="lazy"
                width="24"
                height="16"
                src={`https://flagcdn.com/${details.countryCode.toLowerCase()}.svg`}
                alt={details.countryCode}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                sx={{
                  borderRadius: "2px",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.4)",
                  flexShrink: 0,
                }}
              />
            )}
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {details.countryName || details.countryCode}
            </Typography>
            <Typography sx={{ color: "#94A3B8" }}>•</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnOutlinedIcon
                sx={{ fontSize: 18, color: "#60A5FA" }}
              />
              <Typography variant="body1">{details.address}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Description Section if available */}
      {details.description && (
        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
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
            Giới thiệu điểm đến
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
            {details.description}
          </Typography>
        </Box>
      )}
    </Card>
  );
};
