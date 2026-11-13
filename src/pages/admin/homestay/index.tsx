import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { tableSx } from "@/components/ui/table/tableStyles";
import type {
  IHomestayFormData,
  IHomestayItem,
} from "@/types/pages/homestay/homestay";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { HomestayFormDialog } from "@/components/pages/homestay/homestayFormDialog";
import { HomestayDetailDialog } from "@/components/pages/homestay/homestayDetailDialog";
import { useHomestayList } from "@/hooks/homestays/useHomestayList";
import { useCreateHomestay } from "@/hooks/homestays/useCreateHomestay";
import { useUpdateHomestay } from "@/hooks/homestays/useUpdateHomestay";
import { useDeleteHomestay } from "@/hooks/homestays/useDeleteHomestay";
import { DEFAULT_NO_IMAGE, formatRoomPrice } from "@/constants/homestay";

function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        py: 3,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#334155" }}>
        Không tìm thấy homestay nào
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
        Chưa có dữ liệu homestay trong cơ sở dữ liệu hoặc từ khóa tìm kiếm không
        khớp.
      </Typography>
    </Box>
  );
}

export const AdminHomestayPage: React.FC = () => {
  const {
    data: homestays,
    total,
    paginationModel,
    setPaginationModel,
    isLoading,
    error: fetchError,
    refetch: loadHomestays,
  } = useHomestayList();
  const { createHomestay } = useCreateHomestay();
  const { updateHomestay } = useUpdateHomestay();
  const { deleteHomestay } = useDeleteHomestay();

  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const initialOpenCreate = Boolean(
    (location.state as { openCreate?: boolean } | null)?.openCreate,
  );

  // Modal dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(initialOpenCreate);
  const [selectedHomestay, setSelectedHomestay] =
    useState<IHomestayItem | null>(null);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [homestayToView, setHomestayToView] = useState<IHomestayItem | null>(
    null,
  );

  const [homestayToDelete, setHomestayToDelete] =
    useState<IHomestayItem | null>(null);
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

  const handleShowSnackbar = useCallback(
    (
      message: string,
      severity: "success" | "info" | "warning" | "error" = "success",
    ) => {
      setSnackbar({ open: true, message, severity });
    },
    [],
  );

  // Client-side search filtering
  const filteredHomestays = homestays.filter((h) => {
    const term = searchTerm.toLowerCase();
    const matchesRoom = (h.rooms || []).some((r) => {
      const formatted = formatRoomPrice(
        r.priceAmount,
        r.priceUnit,
      ).toLowerCase();
      return (
        r.name.toLowerCase().includes(term) ||
        (r.description ?? "").toLowerCase().includes(term) ||
        (r.priceAmount ? String(r.priceAmount).includes(term) : false) ||
        formatted.includes(term)
      );
    });

    return (
      (h.name ?? "").toLowerCase().includes(term) ||
      (h.address ?? h.location ?? "").toLowerCase().includes(term) ||
      (h.description ?? "").toLowerCase().includes(term) ||
      matchesRoom
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

  // Confirm Delete Operation via API
  const handleConfirmDelete = async () => {
    if (!homestayToDelete) return;
    setIsDeleting(true);
    try {
      const { success, error } = await deleteHomestay(homestayToDelete.id);

      if (success) {
        handleShowSnackbar(`Đã xóa homestay thành công`, "success");
        setHomestayToDelete(null);
        await loadHomestays();
      } else {
        handleShowSnackbar(error || `Không thể xóa homestay.`, "error");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Form Submit (Create or Update via API)
  const handleFormSubmit = async (
    formData: IHomestayFormData,
    onProgress?: (completed: number, total: number) => void,
  ) => {
    if (selectedHomestay) {
      // Edit mode
      const { error } = await updateHomestay(
        selectedHomestay.id,
        formData,
        selectedHomestay,
        onProgress,
      );

      if (error) {
        handleShowSnackbar(error, "error");
        return;
      }

      handleShowSnackbar(`Cập nhật homestay thành công`, "success");
    } else {
      // Create mode
      const { error } = await createHomestay(formData, onProgress);

      if (error) {
        handleShowSnackbar(error, "error");
        return;
      }

      handleShowSnackbar(`Tạo homestay thành công`, "success");
    }

    setFormDialogOpen(false);
    await loadHomestays();
  };

  const columns: GridColDef<IHomestayItem>[] = [
    {
      field: "image",
      headerName: "Hình Ảnh",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        const firstImage =
          row.mainImage ||
          (row.images && row.images.length > 0 && row.images[0]
            ? row.images[0]
            : DEFAULT_NO_IMAGE);
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
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
              slotProps={{
                img: {
                  onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = DEFAULT_NO_IMAGE;
                    e.currentTarget.style.objectFit = "contain";
                  },
                },
              }}
            />
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
      field: "address",
      headerName: "Địa Điểm",
      flex: 1.2,
      minWidth: 160,
      valueGetter: (_value, row) => row.address || row.location || "",
      renderCell: ({ value }) => (
        <Typography
          noWrap
          sx={{
            color: "#475569",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {(value as string) || "—"}
        </Typography>
      ),
    },
    {
      field: "rooms",
      headerName: "Loại Phòng",
      width: 160,
      sortable: false,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Chip
            label={`${(row.rooms || []).length} loại phòng`}
            size="small"
            sx={{
              bgcolor: "#F1F5F9",
              color: "#334155",
              fontWeight: 700,
              fontSize: "0.75rem",
              borderRadius: "6px",
            }}
          />
        </Box>
      ),
    },
    {
      field: "googleMapsUrl",
      headerName: "Google Map",
      width: 150,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value, row) =>
        row.googleMapsUrl || row.googleMapLink || null,
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
          <Typography sx={{ color: "text.secondary", fontSize: "12px" }}>—</Typography>
        ),
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 160,
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
                width: { xs: 36, sm: 34 },
                height: { xs: 36, sm: 34 },
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
                width: { xs: 36, sm: 34 },
                height: { xs: 36, sm: 34 },
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
                width: { xs: 36, sm: 34 },
                height: { xs: 36, sm: 34 },
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
      <HeaderTitle>Quản Lý Homestay</HeaderTitle>

      {/* Error Banner if fetch failed */}
      {fetchError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadHomestays}>
              Thử lại
            </Button>
          }
          sx={{ borderRadius: "10px" }}
        >
          {fetchError}
        </Alert>
      )}

      {/* Control Bar Card (Search & Create Button & Refresh) */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
        }}
      >
        <TextField
          placeholder="Tìm kiếm homestay theo tên, địa điểm, mô tả..."
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPaginationModel((prev) =>
              prev.page === 0 ? prev : { ...prev, page: 0 },
            );
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: "100%", sm: 360 },
            "& .MuiOutlinedInput-root": {
              height: 40,
              borderRadius: "8px",
              bgcolor: "#F8FAFC",
              fontSize: "0.875rem",
            },
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <Tooltip title="Tải lại dữ liệu">
            <Button
              variant="outlined"
              color="inherit"
              onClick={loadHomestays}
              disabled={isLoading}
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                p: 0,
                borderRadius: "8px",
              }}
            >
              <RefreshIcon fontSize="small" />
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              flex: { xs: 1, sm: "initial" },
              minHeight: 40,
            }}
          >
            Thêm Homestay Mới
          </Button>
        </Box>
      </Card>

      {/* DataGrid */}
      <Card
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: "#FFFFFF",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredHomestays}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading}
          paginationMode="server"
          rowCount={searchTerm ? filteredHomestays.length : total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          rowHeight={64}
          columnHeaderHeight={48}
          autoHeight
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 200,
                }}
              >
                <CircularProgress size={32} />
              </Box>
            ),
          }}
          sx={tableSx}
        />
      </Card>

      {/* Modals & Dialogs */}
      {formDialogOpen && (
        <HomestayFormDialog
          key={
            selectedHomestay?.id ? `edit-${selectedHomestay.id}` : "create-new"
          }
          open={formDialogOpen}
          initialData={selectedHomestay}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      <HomestayDetailDialog
        open={detailDialogOpen}
        homestay={homestayToView}
        onClose={() => setDetailDialogOpen(false)}
      />

      <DeleteConfirmDialog
        open={Boolean(homestayToDelete)}
        title="Xóa Homestay"
        message="Bạn có chắc chắn muốn xóa homestay này? Hành động này không thể hoàn tác."
        loading={isDeleting}
        onClose={() => setHomestayToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
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
