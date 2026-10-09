import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  Avatar,
  Link,
  Chip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { tableSx } from "@/components/ui/table/tableStyles";
import { MOCK_HOMESTAYS } from "@/constants/homestayConstant";
import type { IHomestayFormData, IHomestayItem } from "@/types/pages/homestay/homestay";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { HomestayFormDialog } from "@/components/pages/homestay/homestayFormDialog";
import { HomestayDetailDialog } from "@/components/pages/homestay/homestayDetailDialog";

function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 220,
        py: 6,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#334155" }}>
        Không tìm thấy homestay nào
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
        Thử tìm kiếm với từ khóa khác.
      </Typography>
    </Box>
  );
}

export const AdminHomestayPage: React.FC = () => {
  const [homestays, setHomestays] = useState<IHomestayItem[]>(MOCK_HOMESTAYS);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState<IHomestayItem | null>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [homestayToView, setHomestayToView] = useState<IHomestayItem | null>(null);

  const [homestayToDelete, setHomestayToDelete] = useState<IHomestayItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleShowSnackbar = (
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredHomestays = homestays.filter((h) => {
    return (
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Open Create Dialog
  const handleOpenCreate = () => {
    setSelectedHomestay(null);
    setFormDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (item: IHomestayItem) => {
    setSelectedHomestay(item);
    setFormDialogOpen(true);
  };

  // Open View Dialog
  const handleOpenView = (item: IHomestayItem) => {
    setHomestayToView(item);
    setDetailDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!homestayToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setHomestays((prev) => prev.filter((item) => item.id !== homestayToDelete.id));
      handleShowSnackbar(`Đã xóa homestay "${homestayToDelete.name}" thành công`, "success");
      setHomestayToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = (data: IHomestayFormData) => {
    if (selectedHomestay) {
      // Edit mode
      setHomestays((prev) =>
        prev.map((item) =>
          item.id === selectedHomestay.id
            ? {
                ...item,
                name: data.name,
                location: data.location,
                description: data.description,
                images: data.images,
                price: data.price,
                googleMapLink: data.googleMapLink ?? null,
              }
            : item
        )
      );
      handleShowSnackbar(`Đã cập nhật homestay "${data.name}" thành công`, "success");
    } else {
      // Create mode
      const newItem: IHomestayItem = {
        id: `hs-${Date.now()}`,
        name: data.name,
        location: data.location,
        description: data.description,
        images: data.images,
        price: data.price,
        googleMapLink: data.googleMapLink ?? null,
      };
      setHomestays((prev) => [newItem, ...prev]);
      handleShowSnackbar(`Đã tạo homestay "${data.name}" thành công`, "success");
    }
    setFormDialogOpen(false);
  };

  const columns: GridColDef<IHomestayItem>[] = [
    {
      field: "image",
      headerName: "Hình Ảnh",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        const firstImage = row.images && row.images.length > 0 ? row.images[0] : null;
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            {firstImage ? (
              <Avatar
                variant="rounded"
                src={firstImage}
                alt={row.name}
                sx={{
                  width: 48,
                  height: 44,
                  borderRadius: "8px",
                  bgcolor: "#E2E8F0",
                }}
              />
            ) : (
              <Avatar
                variant="rounded"
                sx={{
                  width: 48,
                  height: 44,
                  borderRadius: "8px",
                  bgcolor: "#F1F5F9",
                  color: "#94A3B8",
                }}
              >
                <PhotoSizeSelectActualIcon fontSize="small" />
              </Avatar>
            )}
          </Box>
        );
      },
    },
    {
      field: "name",
      headerName: "Tên Homestay",
      flex: 1.5,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Typography
          noWrap
          sx={{
            fontWeight: 600,
            color: "#172033",
            fontSize: "13.5px",
          }}
        >
          {value as string}
        </Typography>
      ),
    },
    {
      field: "location",
      headerName: "Địa Điểm",
      flex: 1.2,
      minWidth: 160,
      renderCell: ({ value }) => (
        <Typography
          noWrap
          sx={{
            color: "#475569",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {value as string}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Giá Thuê",
      flex: 1.2,
      minWidth: 180,
      renderCell: ({ value }) =>
        value ? (
          <Typography
            noWrap
            sx={{ color: "#2563EB", fontSize: "13px", fontWeight: 700 }}
          >
            {value as string}
          </Typography>
        ) : (
          <Typography sx={{ color: "#CBD5E1", fontSize: "12px", fontStyle: "italic" }}>
            Chưa có giá
          </Typography>
        ),
    },
    {
      field: "googleMapLink",
      headerName: "Google Map",
      width: 130,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) =>
        value ? (
          <Tooltip title={value as string}>
            <Link
              href={value as string}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              onClick={(e) => e.stopPropagation()}
            >
              <Chip
                label="Xem Map"
                size="small"
                sx={{
                  bgcolor: "#ECFDF5",
                  color: "#059669",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  borderRadius: "6px",
                  "&:hover": { bgcolor: "#D1FAE5" },
                }}
              />
            </Link>
          </Tooltip>
        ) : (
          <Typography sx={{ color: "#CBD5E1", fontSize: "12px" }}>—</Typography>
        ),
    },
    {
      field: "description",
      headerName: "Mô Tả",
      flex: 2,
      minWidth: 220,
      renderCell: ({ value }) => (
        <Typography
          noWrap
          sx={{
            color: "#64748B",
            fontSize: "12.5px",
          }}
        >
          {value as string}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Tooltip title="Xem chi tiết homestay">
            <Button
              variant="outlined"
              color="primary"
              aria-label="Xem chi tiết homestay"
              onClick={() => handleOpenView(row)}
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: "8px",
                borderColor: "#BFDBFE",
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
            </Button>
          </Tooltip>

          <Tooltip title="Chỉnh sửa homestay">
            <Button
              variant="contained"
              color="info"
              aria-label="Chỉnh sửa homestay"
              onClick={() => handleOpenEdit(row)}
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: "8px",
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 17, color: "inherit" }} />
            </Button>
          </Tooltip>

          <Tooltip title="Xóa homestay">
            <Button
              variant="contained"
              color="error"
              aria-label="Xóa homestay"
              onClick={() => setHomestayToDelete(row)}
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: "8px",
              }}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 17, color: "inherit" }} />
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <HeaderTitle>Quản Lý Homestay</HeaderTitle>

      {/* Control Bar Card (Search & Create Button) */}
      <Card
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          borderRadius: "12px",
        }}
      >
        <TextField
          placeholder="Tìm kiếm homestay theo tên, địa điểm, mô tả..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: "100%", sm: 360 } }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
        >
          Thêm Homestay Mới
        </Button>
      </Card>

      {/* DataGrid */}
      <Card
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredHomestays}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          rowHeight={64}
          columnHeaderHeight={48}
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={tableSx}
        />
      </Card>

      {/* Modals & Dialogs */}
      <HomestayFormDialog
        key={formDialogOpen ? (selectedHomestay?.id || "create") : "closed"}
        open={formDialogOpen}
        initialData={selectedHomestay}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <HomestayDetailDialog
        open={detailDialogOpen}
        homestay={homestayToView}
        onClose={() => setDetailDialogOpen(false)}
      />

      <DeleteConfirmDialog
        open={Boolean(homestayToDelete)}
        title="Xóa Homestay"
        itemName={homestayToDelete?.name}
        loading={isDeleting}
        onClose={() => setHomestayToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: "8px", fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminHomestayPage;
