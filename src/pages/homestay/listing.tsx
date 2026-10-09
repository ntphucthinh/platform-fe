import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
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

export const HomestayListingPage: React.FC = () => {
  const [dbHomestays, setDbHomestays] = useState<IHomestayItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredHomestays = useMemo(() => {
    return homestayList.filter((h) => {
      const locStr = h.address || h.location || "";
      return (
        (h.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        locStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.shortDescription && h.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [homestayList, searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm("");
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
              label="Chào mừng bạn đến với HomeStays ✨"
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

          {searchTerm && (
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
