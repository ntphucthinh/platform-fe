import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { PublicHeader } from "@/components/pages/homestay/publicHeader";
import { PublicFooter } from "@/components/pages/homestay/publicFooter";
import { HomestayCard } from "@/components/pages/homestay/homestayCard";

import type { IHomestayItem } from "@/types/pages/homestay/homestay";
import { getHomestays } from "@/services/homestayService";
import { useSearchParams } from "react-router-dom";

export const HomestayListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLocation = searchParams.get("location") || "";

  const [dbHomestays, setDbHomestays] = useState<IHomestayItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortOrder, setSortOrder] = useState<"featured" | "priceLow" | "priceHigh" | "rating">("featured");

  useEffect(() => {
    let isMounted = true;
    getHomestays().then(({ data }) => {
      if (isMounted && data && data.length > 0) {
        setDbHomestays(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const homestayList = dbHomestays;

  const locations = useMemo(() => {
    const locSet = new Set(
      homestayList.map((h) => (h.address || h.location || "").split(",")[0].trim()).filter(Boolean)
    );
    return Array.from(locSet);
  }, [homestayList]);

  const filteredHomestays = useMemo(() => {
    return homestayList.filter((h) => {
      const locStr = h.address || h.location || "";
      const matchesSearch =
        (h.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        locStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.shortDescription && h.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation =
        !selectedLocation ||
        locStr.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesLocation;
    }).sort((a, b) => {
      const priceA = a.pricePerNight ?? 0;
      const priceB = b.pricePerNight ?? 0;
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;

      if (sortOrder === "priceLow") return priceA - priceB;
      if (sortOrder === "priceHigh") return priceB - priceA;
      if (sortOrder === "rating") return ratingB - ratingA;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [homestayList, searchTerm, selectedLocation, sortOrder]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSortOrder("featured");
    setSearchParams({});
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <PublicHeader />

      {/* Hero Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          color: "#FFFFFF",
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "center" }}>
            <Chip
              label="Chào mừng bạn đến với HavenStays ✨"
              size="small"
              sx={{
                bgcolor: "rgba(37, 99, 235, 0.2)",
                color: "#60A5FA",
                fontWeight: 700,
                fontSize: "0.85rem",
                mb: 2,
                px: 1,
                py: 0.5,
                border: "1px solid rgba(96, 165, 250, 0.3)",
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              Hãy tìm homestay bạn thích 🏡
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#94A3B8",
                fontSize: { xs: "1rem", sm: "1.125rem" },
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Khám phá những căn homestay xinh xắn, villa nghỉ dưỡng siêu chill và không gian ấm cúng tuyệt vời cho kỳ nghỉ trọn vẹn của bạn!
            </Typography>

            {/* Filter Box Overlay */}
            <Paper
              elevation={4}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: "16px",
                bgcolor: "#FFFFFF",
                color: "#0F172A",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "center",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
              }}
            >
              <TextField
                fullWidth
                placeholder="Tìm theo tên, địa điểm hoặc từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#64748B" }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#F8FAFC",
                  },
                }}
              />

              <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
                <InputLabel id="location-filter-label">Điểm Đến</InputLabel>
                <Select
                  labelId="location-filter-label"
                  value={selectedLocation}
                  label="Điểm Đến"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
                >
                  <MenuItem value="">Tất cả điểm đến</MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
                <InputLabel id="sort-order-label">Sắp Xếp</InputLabel>
                <Select
                  labelId="sort-order-label"
                  value={sortOrder}
                  label="Sắp Xếp"
                  onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                  sx={{ borderRadius: "10px", bgcolor: "#F8FAFC" }}
                >
                  <MenuItem value="featured">Nổi Bật Nhất</MenuItem>
                  <MenuItem value="priceLow">Giá: Thấp đến Cao</MenuItem>
                  <MenuItem value="priceHigh">Giá: Cao đến Thấp</MenuItem>
                  <MenuItem value="rating">Đánh Giá Cao Nhất</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ py: 6, flex: 1 }}>
        {/* Results Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
              Danh Sách Homestay
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Hiển thị {filteredHomestays.length} trên tổng số {homestayList.length} homestay
            </Typography>
          </Box>

          {(searchTerm || selectedLocation || sortOrder !== "featured") && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<RestartAltIcon />}
              onClick={handleResetFilters}
              sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
            >
              Xóa Bộ Lọc
            </Button>
          )}
        </Box>

        {/* Grid List */}
        {filteredHomestays.length > 0 ? (
          <Grid container spacing={3.5}>
            {filteredHomestays.map((homestay: IHomestayItem) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={homestay.id}>
                <HomestayCard homestay={homestay} />
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Empty / No Results State */
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: "16px",
              bgcolor: "#FFFFFF",
              border: "1px dashed #CBD5E1",
              maxWidth: 540,
              mx: "auto",
              my: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#EFF6FF",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <FilterListIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033", mb: 1 }}>
              Không Tìm Thấy Homestay Phù Hợp
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
              Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc địa điểm để xem tất cả homestay.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetFilters}
              sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 600 }}
            >
              Xem Tất Cả Homestay
            </Button>
          </Paper>
        )}
      </Container>

      <PublicFooter />
    </Box>
  );
};

export default HomestayListingPage;
