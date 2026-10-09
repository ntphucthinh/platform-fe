import React, { useEffect, useState, useCallback } from "react";
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
import * as homestayService from "@/services/homestayService";
import { DEFAULT_NO_IMAGE } from "@/constants/homestayConstant";

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
        Chưa có dữ liệu homestay trong cơ sở dữ liệu Supabase hoặc từ khóa tìm
        kiếm không khớp.
      </Typography>
    </Box>
  );
}

export const AdminHomestayPage: React.FC = () => {
  const [homestays, setHomestays] = useState<IHomestayItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
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

  // Fetch homestays list from Supabase
  const loadHomestays = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    const { data, error } = await homestayService.getHomestays();

    if (error) {
      setFetchError(error);
      handleShowSnackbar(error, "error");
    } else {
      setHomestays(data);
    }
    setIsLoading(false);
  }, [handleShowSnackbar]);

  useEffect(() => {
    let active = true;
    homestayService.getHomestays().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setFetchError(error);
        handleShowSnackbar(error, "error");
      } else {
        setHomestays(data);
      }
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [handleShowSnackbar]);

  // Client-side search filtering
  const filteredHomestays = homestays.filter((h) => {
    const term = searchTerm.toLowerCase();
    return (
      (h.name ?? "").toLowerCase().includes(term) ||
      (h.address ?? h.location ?? "").toLowerCase().includes(term) ||
      (h.description ?? "").toLowerCase().includes(term)
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

  // Confirm Delete Operation with Supabase
  const handleConfirmDelete = async () => {
    if (!homestayToDelete) return;
    setIsDeleting(true);
    try {
      const { success, error } = await homestayService.deleteHomestay(
        homestayToDelete.id,
      );

      if (success) {
        handleShowSnackbar(
          `Đã xóa homestay "${homestayToDelete.name}" thành công`,
          "success",
        );
        setHomestayToDelete(null);
        await loadHomestays();
      } else {
        handleShowSnackbar(
          error || `Không thể xóa homestay "${homestayToDelete.name}".`,
          "error",
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Form Submit (Create or Update with Supabase Storage)
  const handleFormSubmit = async (formData: IHomestayFormData) => {
    if (selectedHomestay) {
      // Edit mode
      const { data, error } = await homestayService.updateHomestay(
        selectedHomestay.id,
        formData,
        selectedHomestay.imageRecords || [],
      );

      if (error) {
        handleShowSnackbar(error, "error");
        return;
      }

      handleShowSnackbar(
        `Đã cập nhật homestay "${data?.name ?? formData.name}" thành công`,
        "success",
      );
    } else {
      // Create mode
      const { data, error } = await homestayService.createHomestay(formData);

      if (error) {
        handleShowSnackbar(error, "error");
        return;
      }

      handleShowSnackbar(
        `Đã tạo homestay "${data?.name ?? formData.name}" thành công`,
        "success",
      );
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
          row.images && row.images.length > 0 && row.images[0]
            ? row.images[0]
            : DEFAULT_NO_IMAGE;
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
          <Typography
            sx={{ color: "#CBD5E1", fontSize: "12px", fontStyle: "italic" }}
          >
            Chưa có giá
          </Typography>
        ),
    },
    {
      field: "googleMapsUrl",
      headerName: "Google Map",
      width: 130,
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
          {(value as string) || "—"}
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
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: "100%", sm: 360 } }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
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
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredHomestays}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
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
