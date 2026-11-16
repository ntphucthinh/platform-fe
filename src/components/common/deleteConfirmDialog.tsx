import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export interface DeleteConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  title = "Xác nhận xóa",
  message,
  loading: externalLoading,
  onClose,
  onConfirm,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading ?? internalLoading;

  const handleConfirm = async () => {
    if (isLoading) return;
    try {
      setInternalLoading(true);
      await onConfirm();
    } catch {
      // If delete fails, keep dialog open so user can retry
    } finally {
      setInternalLoading(false);
    }
  };

  const handleClose = (
    _event: object,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (isLoading) return;
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      onClose();
    }
  };

  const defaultMessage =
    "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-container": {
          alignItems: "center",
          justifyContent: "center",
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
            p: 1,
            m: 0,
            width: { xs: "100%", sm: "auto" },
            maxWidth: { xs: "100%", sm: "xs" },
            maxHeight: {
              xs: "calc(100dvh - 24px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
              sm: "calc(100dvh - 48px)",
            },
          },
        },
      }}
    >
      <DialogTitle component="div" sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#FEF2F2",
              color: "error.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <WarningAmberIcon fontSize="small" />
          </Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, fontSize: { xs: "1.05rem", sm: "1.25rem" } }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 2, px: { xs: 2, sm: 3 } }}>
        <DialogContentText
          component="div"
          sx={{ color: "text.secondary", fontSize: "0.95rem" }}
        >
          {message || defaultMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: 2,
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={isLoading}
          fullWidth
          sx={{
            borderColor: "divider",
            color: "text.primary",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "8px",
            minHeight: 42,
            width: { xs: "100%", sm: "auto" },
            px: 2,
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={isLoading}
          fullWidth
          startIcon={
            isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            borderRadius: "8px",
            minHeight: 42,
            width: { xs: "100%", sm: "auto" },
            px: 2,
            "&:hover": {
              boxShadow: "none",
            },
            "&:focus-visible": {
              outline: "2px solid #DC2626",
              outlineOffset: 2,
            },
          }}
        >
          {isLoading ? "Đang xóa..." : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
