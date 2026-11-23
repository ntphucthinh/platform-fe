import React from "react";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

export interface TravelMemoryDetailHeaderProps {
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TravelMemoryDetailHeader: React.FC<
  TravelMemoryDetailHeaderProps
> = ({ onBack, onEdit, onDelete }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          borderColor: "divider",
          color: "text.secondary",
          width: { xs: "100%", sm: "auto" },
          minHeight: 40,
          "&:focus-visible": {
            outline: "2px solid #1976D2",
            outlineOffset: 2,
          },
        }}
      >
        Quay lại danh sách
      </Button>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlinedIcon />}
          onClick={onDelete}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            flex: { xs: 1, sm: "initial" },
            minHeight: 40,
            "&:focus-visible": {
              outline: "2px solid #DC2626",
              outlineOffset: 2,
            },
          }}
        >
          Xóa chuyến đi
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditOutlinedIcon />}
          onClick={onEdit}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            flex: { xs: 1, sm: "initial" },
            minHeight: 40,
            "&:focus-visible": {
              outline: "2px solid #1976D2",
              outlineOffset: 2,
            },
          }}
        >
          Chỉnh sửa chuyến đi
        </Button>
      </Box>
    </Box>
  );
};
