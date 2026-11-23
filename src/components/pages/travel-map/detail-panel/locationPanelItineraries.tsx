import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useNavigate } from "react-router-dom";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

export interface LocationPanelItinerariesProps {
  location: ILocationWithDetails;
}

export const LocationPanelItineraries: React.FC<
  LocationPanelItinerariesProps
> = ({ location }) => {
  const navigate = useNavigate();

  if (location.itineraries.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, color: "#0F172A" }}
        >
          Lịch trình liên quan ({location.itineraries.length})
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          ...(location.itineraries.length > 2 && {
            maxHeight: 240,
            overflowY: "auto",
            pr: 0.5,
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#CBD5E1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#94A3B8",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }),
        }}
      >
        {location.itineraries.map((it) => (
          <Card
            key={it.id}
            elevation={0}
            onClick={() => navigate(`/admin/itineraries/${it.id}`)}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              display: "flex",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.15s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                borderColor: "#1976D2",
              },
            }}
          >
            <CardMedia
              component="img"
              image={it.coverImage || DEFAULT_NO_IMAGE}
              alt={it.title}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = DEFAULT_NO_IMAGE;
                e.currentTarget.style.objectFit = "contain";
                e.currentTarget.style.padding = "8px";
                e.currentTarget.style.backgroundColor = "#F8FAFC";
              }}
              sx={{
                width: 90,
                minHeight: 85,
                objectFit:
                  !it.coverImage || it.coverImage === DEFAULT_NO_IMAGE
                    ? "contain"
                    : "cover",
                p:
                  !it.coverImage || it.coverImage === DEFAULT_NO_IMAGE
                    ? 1
                    : 0,
                bgcolor: "#F8FAFC",
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            />

            <CardContent
              sx={{
                p: 1.5,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "&:last-child": { pb: 1.5 },
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "#0F172A",
                    fontSize: "0.9rem",
                    lineHeight: 1.3,
                    mb: 0.5,
                  }}
                >
                  {it.title}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#64748B",
                    fontSize: "0.75rem",
                  }}
                >
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} />
                  {it.duration ||
                    (it.durationDays !== undefined
                      ? `${it.durationDays} ngày ${Math.max(
                          0,
                          it.durationDays - 1,
                        )} đêm`
                      : "—")}
                </Box>
              </Box>

              {it.themes && it.themes.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    flexWrap: "wrap",
                    mt: 1,
                  }}
                >
                  {it.themes.slice(0, 2).map((t, idx) => (
                    <Chip
                      key={idx}
                      label={t}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.7rem",
                        bgcolor: "#EFF6FF",
                        color: "#1976D2",
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
