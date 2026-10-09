import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MapIcon from "@mui/icons-material/Map";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { useParams, useNavigate } from "react-router-dom";
import { PublicHeader } from "@/components/pages/homestay/publicHeader";
import { PublicFooter } from "@/components/pages/homestay/publicFooter";
import { HomestayGallery } from "@/components/pages/homestay/homestayGallery";
import type { IHomestayItem } from "@/types/pages/homestay/homestay";
import { getHomestayById } from "@/services/homestayService";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

export const HomestayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [homestay, setHomestay] = useState<IHomestayItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const numericId = Number(id);

    if (!isNaN(numericId) && numericId > 0) {
      getHomestayById(numericId).then(({ data }) => {
        if (!isMounted) return;
        setHomestay(data);
        setLoading(false);
      });
    } else {
      Promise.resolve().then(() => {
        if (!isMounted) return;
        setHomestay(null);
        setLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
        <PublicHeader />
        <Container maxWidth="md" sx={{ py: 12, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={40} />
        </Container>
        <PublicFooter />
      </Box>
    );
  }

  if (!homestay) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
        <PublicHeader />
        <Container maxWidth="md" sx={{ py: 10, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "20px",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              maxWidth: 480,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#FEF2F2",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <ErrorOutlinedIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
              Không Tìm Thấy Homestay
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
              Không tìm thấy homestay với mã &quot;{id}&quot;. Homestay này có thể đã bị xóa hoặc liên kết không hợp lệ.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              sx={{ textTransform: "none", borderRadius: "10px", fontWeight: 700 }}
            >
              Quay Lại Danh Sách Homestay
            </Button>
          </Paper>
        </Container>
        <PublicFooter />
      </Box>
    );
  }

  const mapUrl = (homestay.googleMapsUrl || homestay.googleMapLink || "").trim() || null;
  const addressStr = homestay.address || homestay.location;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <PublicHeader />

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        {/* Navigation Breadcrumbs & Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <MuiLink
              underline="hover"
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
            >
              Homestay
            </MuiLink>
            <Typography color="text.primary" sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
              {homestay.name}
            </Typography>
          </Breadcrumbs>

          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              borderColor: "#CBD5E1",
              color: "#334155",
            }}
          >
            Quay Lại Danh Sách
          </Button>
        </Box>

        {/* Title Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              {homestay.name}
            </Typography>
            {homestay.featured && (
              <Chip label="Homestay Nổi Bật" color="primary" size="small" sx={{ fontWeight: 700, borderRadius: "6px" }} />
            )}
          </Box>

          {addressStr && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ color: "#2563EB", fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
                {addressStr}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Main Layout: Gallery (Left) + Information Panel (Right) */}
        <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
          {/* Left Column: Image Gallery */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <HomestayGallery
              mainImage={
                homestay.mainImage ||
                (homestay.images && homestay.images.length > 0
                  ? homestay.images[0]
                  : DEFAULT_NO_IMAGE)
              }
              images={
                homestay.images && homestay.images.length > 0
                  ? homestay.images
                  : [DEFAULT_NO_IMAGE]
              }
              title={homestay.name}
            />
          </Grid>

          {/* Right Column: Homestay Information */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: "20px",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                position: { lg: "sticky" },
                top: 96,
                boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* 1. Rental Price */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2.5,
                  bgcolor: "#EFF6FF",
                  borderRadius: "14px",
                  border: "1px solid #DBEAFE",
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    bgcolor: "#2563EB",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#64748B",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      display: "block",
                    }}
                  >
                    Giá thuê
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#1D4ED8", lineHeight: 1.2 }}>
                    {homestay.price && homestay.price.trim() !== ""
                      ? homestay.price
                      : "Liên hệ để biết giá"}
                  </Typography>
                </Box>
              </Box>

              {/* 2. Homestay Description (Immediately below Price) */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0F172A" }}>
                  Giới thiệu về homestay
                </Typography>
                {homestay.description && homestay.description.trim() !== "" ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#334155",
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                      fontSize: "0.9375rem",
                    }}
                  >
                    {homestay.description}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "#94A3B8", fontStyle: "italic" }}>
                    Chưa có thông tin mô tả chi tiết cho homestay này.
                  </Typography>
                )}
              </Box>

              {/* 3. Google Maps Button (below Description, if mapUrl is available) */}
              {mapUrl && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MapIcon />}
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textTransform: "none",
                    borderRadius: "12px",
                    fontWeight: 700,
                    py: 1.4,
                    fontSize: "0.9375rem",
                    borderColor: "#2563EB",
                    color: "#2563EB",
                    "&:hover": { bgcolor: "#EFF6FF", borderColor: "#1D4ED8" },
                  }}
                >
                  Xem trên Google Map
                </Button>
              )}

              {/* 4. Explore-more Homestays Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate("/")}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  fontWeight: 700,
                  py: 1.5,
                  fontSize: "0.9375rem",
                  bgcolor: "#2563EB",
                  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
                  "&:hover": { bgcolor: "#1D4ED8" },
                }}
              >
                Khám Phá Thêm Homestay
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <PublicFooter />
    </Box>
  );
};

export default HomestayDetailPage;
