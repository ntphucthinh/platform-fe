import React from "react";
import { Box, Container, Typography, Grid, Link, Divider } from "@mui/material";
import CottageIcon from "@mui/icons-material/Cottage";

export const PublicFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0F172A",
        color: "#94A3B8",
        pt: 7,
        pb: 5,
        mt: "auto",
        borderTop: "1px solid #1E293B",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                }}
              >
                <CottageIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                HavenStays
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.7, maxWidth: 320 }}>
              Trải nghiệm homestay nghỉ dưỡng hàng đầu trên khắp Việt Nam. Những căn villa sang trọng, chalet núi yên bình và biệt thự biển đẳng cấp dành riêng cho chuyến đi của bạn.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: "#F8FAFC", fontWeight: 700, mb: 2 }}>
              Điểm Đến Nổi Bật
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/?location=Da+Lat" underline="hover" color="inherit" variant="body2">
                Villa Đồi Thông Đà Lạt
              </Link>
              <Link href="/?location=Da+Nang" underline="hover" color="inherit" variant="body2">
                Biệt Thự Biển Đà Nẵng
              </Link>
              <Link href="/?location=Sapa" underline="hover" color="inherit" variant="body2">
                Chalet Mây Núi Sapa
              </Link>
              <Link href="/" underline="hover" color="inherit" variant="body2">
                Nhà Cổ Đèn Lồng Hội An
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: "#F8FAFC", fontWeight: 700, mb: 2 }}>
              Hệ Thống
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/" underline="hover" color="inherit" variant="body2">
                Tất Cả Homestay
              </Link>
              <Link href="/admin/login" underline="hover" color="inherit" variant="body2">
                Đăng Nhập Quản Trị
              </Link>
              <Link href="/admin/homestay" underline="hover" color="inherit" variant="body2">
                Trang Quản Lý Homestay
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#F8FAFC", fontWeight: 700, mb: 2 }}>
              Liên Hệ & Hỗ Trợ
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              Hỗ trợ 24/7: support@havenstays.example.com
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Hotline: +84 (0) 1800 8888
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "#1E293B" }} />

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            © 2026 HavenStays Platform. Bảo lưu mọi quyền.
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Chế độ giao diện trải nghiệm dữ liệu mẫu
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
