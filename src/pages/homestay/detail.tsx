import React, { useState, useEffect, useMemo } from "react";
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
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { useParams, useNavigate } from "react-router-dom";
import { PublicHeader } from "@/components/pages/homestay/publicHeader";
import { PublicFooter } from "@/components/pages/homestay/publicFooter";
import { HomestayGallery } from "@/components/pages/homestay/homestayGallery";
import type { IHomestayItem, HomestayRoom } from "@/types/pages/homestay/homestay";
import { getHomestayById } from "@/services/homestayService";
import { DEFAULT_NO_IMAGE, formatRoomPrice } from "@/constants/homestayConstant";

export const HomestayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [homestay, setHomestay] = useState<IHomestayItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const numericId = Number(id);

    if (!isNaN(numericId) && numericId > 0) {
      getHomestayById(numericId).then(({ data }) => {
        if (!isMounted) return;
        setHomestay(data);
        if (data && data.rooms && data.rooms.length > 0) {
          // Select first room by default
          setSelectedRoomId(data.rooms[0].id);
        }
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

  // Order rooms deterministically by sort_order, then id
  const rooms: HomestayRoom[] = useMemo(() => {
    if (!homestay || !homestay.rooms) return [];
    return [...homestay.rooms].sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id;
    });
  }, [homestay]);

  // Derive current selected room
  const activeRoom: HomestayRoom | null = useMemo(() => {
    if (rooms.length === 0) return null;
    const found = rooms.find((r) => r.id === selectedRoomId);
    return found || rooms[0];
  }, [rooms, selectedRoomId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
        }}
      >
        <PublicHeader />
        <Container
          maxWidth="md"
          sx={{
            py: 12,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={40} />
        </Container>
        <PublicFooter />
      </Box>
    );
  }

  if (!homestay) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#F8FAFC",
        }}
      >
        <PublicHeader />
        <Container
          maxWidth="md"
          sx={{
            py: 10,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}
            >
              Không Tìm Thấy Homestay
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
              Không tìm thấy homestay với mã &quot;{id}&quot;. Homestay này có
              thể đã bị xóa hoặc liên kết không hợp lệ.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 700,
              }}
            >
              Quay Lại Danh Sách Homestay
            </Button>
          </Paper>
        </Container>
        <PublicFooter />
      </Box>
    );
  }

  const mapUrl =
    (homestay.googleMapsUrl || homestay.googleMapLink || "").trim() || null;
  const addressStr = homestay.address || homestay.location;

  // Selected room details (or fallback to homestay level if no rooms)
  const roomName = activeRoom ? activeRoom.name : homestay.name;

  const roomPriceText = activeRoom
    ? formatRoomPrice(activeRoom.priceAmount, activeRoom.priceUnit)
    : (homestay.rooms?.[0]
        ? formatRoomPrice(homestay.rooms[0].priceAmount, homestay.rooms[0].priceUnit)
        : "Chưa cập nhật giá");

  const roomDescription = activeRoom
    ? activeRoom.description
    : homestay.description;

  // Selected room gallery images
  const roomCoverImage = activeRoom?.imageRecords?.find((img) => img.isCover);
  const hasRoomImages = Boolean(activeRoom && activeRoom.images && activeRoom.images.length > 0);
  const roomImages = hasRoomImages ? activeRoom!.images : [DEFAULT_NO_IMAGE];

  const mainGalleryImage = hasRoomImages
    ? (roomCoverImage?.url || roomImages[0])
    : DEFAULT_NO_IMAGE;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      <PublicHeader />

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        {/* Navigation Breadcrumbs & Back Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <MuiLink
              underline="hover"
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
            >
              Homestay
            </MuiLink>
            <Typography
              color="text.primary"
              sx={{ fontSize: "0.875rem", fontWeight: 600 }}
            >
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

        {/* Top Shared Information: Homestay Name, Address, Google Maps */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              mb: 1,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.02em",
              }}
            >
              {homestay.name}
            </Typography>
            {homestay.featured && (
              <Chip
                label="Homestay Nổi Bật"
                color="primary"
                size="small"
                sx={{ fontWeight: 700, borderRadius: "6px" }}
              />
            )}
          </Box>

          {/* Address & Google Maps link */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {addressStr && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationOnIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", fontWeight: 600 }}
                >
                  {addressStr}
                </Typography>
              </Box>
            )}

            {mapUrl && (
              <Button
                size="small"
                variant="text"
                startIcon={<MapIcon sx={{ fontSize: 17 }} />}
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#2563EB",
                  p: 0,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Xem vị trí trên Google Map
              </Button>
            )}
          </Box>

          {/* Room Selector: Immediately below address */}
          {rooms.length > 1 && (
            <Box sx={{ mt: 2.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748B",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                  mb: 1,
                }}
              >
                Chọn loại phòng:
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {rooms.map((room) => {
                  const isSelected = activeRoom?.id === room.id;
                  return (
                    <Button
                      key={room.id}
                      variant={isSelected ? "contained" : "outlined"}
                      onClick={() => setSelectedRoomId(room.id)}
                      startIcon={<MeetingRoomOutlinedIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        px: 2,
                        py: 0.9,
                        borderColor: isSelected ? "#2563EB" : "#CBD5E1",
                        bgcolor: isSelected ? "#2563EB" : "#FFFFFF",
                        color: isSelected ? "#FFFFFF" : "#334155",
                        boxShadow: isSelected
                          ? "0 4px 12px rgba(37, 99, 235, 0.25)"
                          : "none",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: isSelected ? "#1D4ED8" : "#F1F5F9",
                          borderColor: isSelected ? "#1D4ED8" : "#94A3B8",
                        },
                      }}
                    >
                      {room.name}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Single Room Indicator */}
          {rooms.length === 1 && (
            <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                icon={<MeetingRoomOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                label={`Loại phòng: ${rooms[0].name}`}
                size="small"
                sx={{
                  bgcolor: "#EFF6FF",
                  color: "#1D4ED8",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  borderRadius: "8px",
                  px: 0.5,
                }}
              />
            </Box>
          )}
        </Box>

        {/* Main Layout: Gallery (Left) + Information Panel (Right) */}
        <Grid container spacing={4} sx={{ alignItems: "flex-start" }}>
          {/* Left Column: Image Gallery belonging to selected room */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <HomestayGallery
              key={activeRoom?.id ? `room-${activeRoom.id}` : "homestay-gallery"}
              mainImage={mainGalleryImage}
              images={roomImages}
              title={`${homestay.name} - ${roomName}`}
            />
          </Grid>

          {/* Right Column: Selected Room Information Panel */}
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
              {/* Active Room Title Banner */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748B",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    display: "block",
                    mb: 0.5,
                  }}
                >
                  Thông tin phòng đang chọn
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 800, color: "#0F172A" }}
                >
                  {roomName}
                </Typography>
              </Box>

              {/* 1. Room Rental Price */}
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
                    Giá thuê phòng
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: "#1D4ED8",
                      lineHeight: 1.2,
                    }}
                  >
                    {roomPriceText}
                  </Typography>
                </Box>
              </Box>

              {/* 2. Room Description */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, color: "#0F172A" }}
                >
                  Mô tả loại phòng
                </Typography>
                {roomDescription && roomDescription.trim() !== "" ? (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#334155",
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                      fontSize: "0.9375rem",
                    }}
                  >
                    {roomDescription}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: "#94A3B8", fontStyle: "italic" }}
                  >
                    Chưa có thông tin mô tả chi tiết cho loại phòng này.
                  </Typography>
                )}
              </Box>

              {/* General Homestay Description (if provided and differs from room description) */}
              {homestay.description &&
                homestay.description.trim() !== "" &&
                homestay.description !== roomDescription && (
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#F8FAFC",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        textTransform: "uppercase",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Tổng quan về {homestay.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748B",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                        fontSize: "0.85rem",
                      }}
                    >
                      {homestay.description}
                    </Typography>
                  </Box>
                )}

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
