import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export interface ItineraryDeleteDayDialogProps {
  dayToDelete: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ItineraryDeleteDayDialog: React.FC<
  ItineraryDeleteDayDialogProps
> = ({ dayToDelete, onClose, onConfirm }) => {
  return (
    <Dialog
      open={dayToDelete !== null}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", sm: "center" },
          px: { xs: 1.5, sm: 2 },
          py: {
            xs: "calc(12px + env(safe-area-inset-top, 0px))",
            sm: 2,
          },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "14px",
            overflow: "hidden",
            width: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "100%", sm: "xs" },
            m: 0,
            maxHeight: {
              xs: "calc(100dvh - 24px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
              sm: "calc(100dvh - 48px)",
            },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          color: "#0F172A",
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: { xs: 2, sm: 3 },
        }}
      >
        <WarningAmberOutlinedIcon color="error" />
        Xóa ngày lịch trình?
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="body2" sx={{ color: "#475569" }}>
          Bạn có chắc chắn muốn xóa Ngày {(dayToDelete ?? 0) + 1}? Tất cả các
          hoạt động bên trong ngày này sẽ bị xóa bỏ.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2, sm: 2.5 },
          pb: 2,
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            textTransform: "none",
            color: "#64748B",
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          fullWidth
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            width: { xs: "100%", sm: "auto" },
            minHeight: 42,
          }}
        >
          Xóa ngày
        </Button>
      </DialogActions>
    </Dialog>
  );
};
