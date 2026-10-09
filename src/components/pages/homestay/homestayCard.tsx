import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import type { IHomestayItem } from "@/types/pages/homestay/homestay";

export interface HomestayCardProps {
  homestay: IHomestayItem;
}

export const HomestayCard: React.FC<HomestayCardProps> = ({ homestay }) => {
  const navigate = useNavigate();

  const coverImage = homestay.mainImage ?? homestay.images[0] ?? "";

  const handleCardClick = () => {
    navigate(`/homestay/${homestay.id}`);
  };

  return (
    <Card
      elevation={0}
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow:
            "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.03)",
          borderColor: "#CBD5E1",
          "& .card-media": {
            transform: "scale(1.05)",
          },
          "& .view-button": {
            color: "#2563EB",
            transform: "translateX(4px)",
          },
        },
      }}
    >
      {/* Cover Image */}
      <Box sx={{ position: "relative", overflow: "hidden", pt: "62%" }}>
        <CardMedia
          component="img"
          image={coverImage}
          alt={homestay.name}
          className="card-media"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
        />

        {/* Featured Tag */}
        {homestay.featured && (
          <Chip
            label="Nổi Bật"
            size="small"
            sx={{
              position: "absolute",
              top: 14,
              left: 14,
              bgcolor: "rgba(15, 23, 42, 0.85)",
              color: "#F8FAFC",
              backdropFilter: "blur(6px)",
              fontWeight: 700,
              fontSize: "0.75rem",
              borderRadius: "8px",
              height: 26,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          p: 2.5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.8 }}>
          <LocationOnIcon sx={{ color: "#2563EB", fontSize: 18 }} />
          <Typography
            variant="caption"
            noWrap
            sx={{ color: "#64748B", fontWeight: 600, fontSize: "0.825rem" }}
          >
            {homestay.location}
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "#0F172A",
            lineHeight: 1.3,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {homestay.name}
        </Typography>

        {/* Description preview — nếu có */}
        {homestay.description && (
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              fontSize: "0.875rem",
              lineHeight: 1.5,
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flex: 1,
            }}
          >
            {homestay.description}
          </Typography>
        )}

        {/* Footer: Price + CTA */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pt: 1.5,
            borderTop: "1px solid #F1F5F9",
            mt: "auto",
          }}
        >
          {homestay.price ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AttachMoneyIcon sx={{ color: "#2563EB", fontSize: 18 }} />
              <Typography
                component="span"
                noWrap
                sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#2563EB", maxWidth: 160 }}
              >
                {homestay.price}
              </Typography>
            </Box>
          ) : (
            <Typography
              component="span"
              sx={{ fontSize: "0.8rem", color: "#CBD5E1", fontStyle: "italic" }}
            >
              Liên hệ để biết giá
            </Typography>
          )}

          <Button
            size="small"
            endIcon={<ArrowForwardIcon className="view-button" sx={{ transition: "transform 0.2s" }} />}
            sx={{
              color: "#334155",
              fontWeight: 700,
              fontSize: "0.875rem",
              textTransform: "none",
              p: 0,
              flexShrink: 0,
            }}
          >
            Xem Chi Tiết
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
