import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
} from "@mui/material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import type { ILocationWithDetails } from "@/types/pages/travel-map/travelMap";

export interface LocationDetailItinerariesProps {
  details: ILocationWithDetails;
}

export const LocationDetailItineraries: React.FC<
  LocationDetailItinerariesProps
> = ({ details }) => {
  const navigate = useNavigate();

  if (details.itineraries.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#0F172A",
            fontSize: { xs: "1.25rem", sm: "1.45rem" },
          }}
        >
          Lịch trình liên quan ({details.itineraries.length})
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
          Kế hoạch và lộ trình du lịch dự kiến gắn với điểm đến này.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {details.itineraries.map((it) => (
          <Card
            key={it.id}
            elevation={0}
            onClick={() => navigate(`/admin/itineraries/${it.id}/detail`)}
            sx={{
              borderRadius: "16px",
              border: "1px solid #E2E8F0",
              bgcolor: "#FFFFFF",
              p: 2.5,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                borderColor: "#1976D2",
              },
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    bgcolor: "#EFF6FF",
                    color: "#1976D2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MapOutlinedIcon sx={{ fontSize: 22 }} />
                </Box>
                <Chip
                  label={it.duration || `${it.durationDays} ngày`}
                  size="small"
                  sx={{
                    bgcolor: "#F1F5F9",
                    color: "#475569",
                    fontWeight: 600,
                    borderRadius: "6px",
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  fontSize: "1.05rem",
                  mb: 0.5,
                }}
              >
                {it.title}
              </Typography>

              {it.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {it.description}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                pt: 1.5,
                borderTop: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                Lộ trình gợi ý
              </Typography>
              <Button
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#1976D2",
                  p: 0,
                }}
              >
                Xem lịch trình
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
