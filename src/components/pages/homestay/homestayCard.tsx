import React, { useState } from "react";
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

import { DEFAULT_NO_IMAGE, formatRoomPrice } from "@/constants/homestay";

export interface HomestayCardProps {
  homestay: IHomestayItem;
}

export const HomestayCard: React.FC<HomestayCardProps> = ({ homestay }) => {
  const navigate = useNavigate();
  const rawCover =
    homestay.mainImage ||
    (homestay.images && homestay.images.length > 0 ? homestay.images[0] : null);
  const coverImage =
    rawCover && rawCover.trim() !== "" ? rawCover : DEFAULT_NO_IMAGE;

  const [prevCover, setPrevCover] = useState<string>(coverImage);
  const [hasError, setHasError] = useState<boolean>(false);

  if (coverImage !== prevCover) {
    setPrevCover(coverImage);
    setHasError(false);
  }

  const isNoCover = coverImage === DEFAULT_NO_IMAGE || hasError;
  const currentCover = hasError ? DEFAULT_NO_IMAGE : coverImage;

  const handleCardClick = () => {
    navigate(`/homestay/${homestay.id}`);
  };

  return (
    <Card
      elevation={0}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "14px",
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
            transform: isNoCover ? "none" : "scale(1.05)",
          },
          "& .view-button": {
            color: "primary.main",
            transform: "translateX(4px)",
          },
        },
        "&:focus-visible": {
          outline: "2px solid #1976D2",
          outlineOffset: 2,
        },
      }}
    >
      {/* Cover Image */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: "62%",
          bgcolor: "#F8FAFC",
        }}
      >
        <CardMedia
          component="img"
          loading="lazy"
          decoding="async"
          image={currentCover}
          alt={homestay.name}
          className="card-media"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = DEFAULT_NO_IMAGE;
            e.currentTarget.style.objectFit = "contain";
            setHasError(true);
          }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: isNoCover ? "contain" : "cover",
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.8, minWidth: 0 }}>
          <LocationOnIcon sx={{ color: "#2563EB", fontSize: 18, flexShrink: 0 }} />
          <Typography
            variant="caption"
            noWrap
            sx={{ color: "#64748B", fontWeight: 600, fontSize: "0.825rem", minWidth: 0 }}
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
            wordBreak: "break-word",
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
            minWidth: 0,
            gap: 1,
          }}
        >
          {(() => {
            const firstRoom = homestay.rooms?.[0];
            const displayPrice = firstRoom
              ? formatRoomPrice(firstRoom.priceAmount, firstRoom.priceUnit)
              : "Chưa cập nhật giá";
            const hasPrice = displayPrice !== "Chưa cập nhật giá";

            return hasPrice ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, flexShrink: 1 }}>
                <AttachMoneyIcon sx={{ color: "primary.main", fontSize: 18, flexShrink: 0 }} />
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    color: "primary.main",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {displayPrice}
                </Typography>
              </Box>
            ) : (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.8rem",
                  color: "text.secondary",
                  fontStyle: "italic",
                }}
              >
                Chưa cập nhật giá
              </Typography>
            );
          })()}

          <Button
            component="span"
            tabIndex={-1}
            size="small"
            endIcon={
              <ArrowForwardIcon
                className="view-button"
                sx={{ transition: "transform 0.2s" }}
              />
            }
            sx={{
              color: "text.primary",
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
