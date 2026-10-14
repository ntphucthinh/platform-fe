import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PhotoCameraBackOutlinedIcon from "@mui/icons-material/PhotoCameraBackOutlined";
import type { IRemovedDatePhotoSummary } from "@/types/pages/travel-memories/travelMemory";

export interface TravelMemoryDateConfirmDialogProps {
  open: boolean;
  removedDates: IRemovedDatePhotoSummary[];
  onCancel: () => void;
  onConfirm: () => void;
}

export const TravelMemoryDateConfirmDialog: React.FC<
  TravelMemoryDateConfirmDialogProps
> = ({ open, removedDates, onCancel, onConfirm }) => {
  const totalPhotos = removedDates.reduce(
    (sum, item) => sum + item.photoCount,
    0,
  );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              bgcolor: "#FEF2F2",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B" }}>
              Xác nhận thay đổi khoảng thời gian
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B" }}>
              Một số ngày đã chọn trước đó có chứa hình ảnh
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5, pb: 2 }}>
        <DialogContentText
          component="div"
          sx={{ color: "#334155", fontSize: "0.95rem", mb: 2 }}
        >
          Khoảng thời gian mới không bao gồm{" "}
          <strong>{removedDates.length} ngày</strong> có hình ảnh đã chọn. Nếu tiếp
          tục, <strong>{totalPhotos} hình ảnh</strong> thuộc các ngày này sẽ bị hủy
          bỏ. Các ngày vẫn nằm trong khoảng thời gian mới sẽ được giữ nguyên ảnh.
        </DialogContentText>

        <Box
          sx={{
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "10px",
            p: 1.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "block",
              mb: 1,
            }}
          >
            Các ngày và số lượng ảnh bị ảnh hưởng:
          </Typography>

          <List dense disablePadding>
            {removedDates.map((item) => (
              <ListItem
                key={item.date}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "6px",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #F1F5F9",
                  mb: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#1E293B" }}
                    >
                      {item.formattedDate}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Mã ngày: {item.date}
                    </Typography>
                  }
                />
                <Chip
                  icon={
                    <PhotoCameraBackOutlinedIcon
                      sx={{ fontSize: "14px !important" }}
                    />
                  }
                  label={`${item.photoCount} ảnh`}
                  size="small"
                  sx={{
                    bgcolor: "#FEE2E2",
                    color: "#B91C1C",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          sx={{
            borderColor: "#CBD5E1",
            color: "#475569",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
          }}
        >
          Hủy & giữ ngày cũ
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
          }}
        >
          Xác nhận loại bỏ ảnh & đổi ngày
        </Button>
      </DialogActions>
    </Dialog>
  );
};
