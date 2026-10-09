import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { IHomestayItem } from "@/types/pages/homestay/homestay";
import { HomestayGallery } from "./homestayGallery";

export interface HomestayDetailDialogProps {
  open: boolean;
  homestay: IHomestayItem | null;
  onClose: () => void;
}

export const HomestayDetailDialog: React.FC<HomestayDetailDialogProps> = ({
  open,
  homestay,
  onClose,
}) => {
  if (!homestay) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: "16px", p: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
          {homestay.name}
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="close dialog">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        <Grid container spacing={3}>
          {/* Gallery Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <HomestayGallery
              mainImage={homestay.images[0] || ""}
              images={homestay.images}
              title={homestay.name}
            />
          </Grid>

          {/* Details Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Location */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationOnIcon sx={{ color: "#2563EB", fontSize: 20 }} />
                <Typography variant="body1" sx={{ color: "#334155", fontWeight: 600 }}>
                  {homestay.location}
                </Typography>
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "#172033" }}>
                  Mô Tả Chi Tiết
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {homestay.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng Xem Trước
        </Button>
      </DialogActions>
    </Dialog>
  );
};
