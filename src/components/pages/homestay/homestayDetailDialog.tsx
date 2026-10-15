import React, { useState, useMemo } from "react";
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
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import type { IHomestayItem, HomestayRoom } from "@/types/pages/homestay/homestay";
import { HomestayGallery } from "./homestayGallery";
import { DEFAULT_NO_IMAGE, formatRoomPrice } from "@/constants/homestayConstant";

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
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const rooms: HomestayRoom[] = useMemo(() => {
    if (!homestay || !homestay.rooms) return [];
    return [...homestay.rooms].sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id;
    });
  }, [homestay]);

  const activeRoom = useMemo(() => {
    if (rooms.length === 0) return null;
    const found = rooms.find((r) => r.id === selectedRoomId);
    return found || rooms[0];
  }, [rooms, selectedRoomId]);

  if (!homestay) return null;

  const roomCover = activeRoom?.imageRecords?.find((img) => img.isCover);
  const hasRoomImages = Boolean(activeRoom && activeRoom.images && activeRoom.images.length > 0);
  const roomImages = hasRoomImages ? activeRoom!.images : [DEFAULT_NO_IMAGE];

  const mainImage = hasRoomImages
    ? (roomCover?.url || roomImages[0])
    : DEFAULT_NO_IMAGE;

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#172033" }}>
            {homestay.name}
          </Typography>
          <Chip
            label={`${rooms.length} loại phòng`}
            size="small"
            sx={{ bgcolor: "#EFF6FF", color: "#1D4ED8", fontWeight: 700 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close dialog">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5 }}>
        {/* Room Selector if multiple rooms */}
        {rooms.length > 1 && (
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", display: "block", mb: 1 }}
            >
              Chọn loại phòng:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {rooms.map((room) => {
                const isSelected = activeRoom?.id === room.id;
                return (
                  <Button
                    key={room.id}
                    size="small"
                    variant={isSelected ? "contained" : "outlined"}
                    onClick={() => setSelectedRoomId(room.id)}
                    startIcon={<MeetingRoomOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      bgcolor: isSelected ? "#2563EB" : "#FFF",
                      color: isSelected ? "#FFF" : "#334155",
                      borderColor: isSelected ? "#2563EB" : "#CBD5E1",
                    }}
                  >
                    {room.name}
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Gallery Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <HomestayGallery
              key={activeRoom?.id ? `dialog-room-${activeRoom.id}` : "dialog-gallery"}
              mainImage={mainImage}
              images={roomImages}
              title={`${homestay.name} - ${activeRoom?.name || ""}`}
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

              {/* Price */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1.5,
                  bgcolor: "#EFF6FF",
                  borderRadius: "10px",
                  border: "1px solid #DBEAFE",
                }}
              >
                <AttachMoneyIcon sx={{ color: "#2563EB", fontSize: 22 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, display: "block" }}>
                    Giá thuê ({activeRoom?.name || "Homestay"})
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: "#1D4ED8", fontSize: "1.05rem" }}>
                    {formatRoomPrice(activeRoom?.priceAmount, activeRoom?.priceUnit)}
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: "#172033" }}>
                  Mô Tả Loại Phòng {activeRoom ? `(${activeRoom.name})` : ""}
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                  {activeRoom?.description || homestay.description || "Chưa có thông tin mô tả chi tiết."}
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
