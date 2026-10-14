import React, { useState, useMemo, useSyncExternalStore } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Snackbar,
  Alert,
  Avatar,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { tableSx } from "@/components/ui/table/tableStyles";
import {
  getItineraryListItems,
  subscribeItineraries,
  deleteItinerary,
} from "@/services/itineraryService";
import type { IItineraryListItem } from "@/types/pages/itineraries/itinerary";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
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
        py: 4,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#334155" }}>
        Không tìm thấy lịch trình nào
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
        Chưa có dữ liệu phù hợp với từ khóa hoặc bộ lọc đã chọn.
      </Typography>
    </Box>
  );
}

export const ItineraryListPage: React.FC = () => {
  const navigate = useNavigate();
  const itineraries = useSyncExternalStore(
    subscribeItineraries,
    getItineraryListItems,
    getItineraryListItems,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("ALL");
  const [durationFilter, setDurationFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<IItineraryListItem | null>(
    null,
  );

  // Toast notification state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Summary counts
  const totalCount = itineraries.length;
  const completedCount = useMemo(
    () => itineraries.filter((item) => item.status === "Đã hoàn thiện").length,
    [itineraries],
  );
  const draftCount = useMemo(
    () => itineraries.filter((item) => item.status === "Bản nháp").length,
    [itineraries],
  );

  // Unique destinations for filter dropdown
  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    itineraries.forEach((item) => {
      set.add(item.destination);
    });
    return Array.from(set);
  }, [itineraries]);

  // Filtered dataset
  const filteredItineraries = useMemo(() => {
    return itineraries.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.destination.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);

      const matchesDestination =
        destinationFilter === "ALL" || item.destination === destinationFilter;

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      let matchesDuration = true;
      if (durationFilter === "1") {
        matchesDuration = item.daysCount === 1;
      } else if (durationFilter === "2") {
        matchesDuration = item.daysCount === 2;
      } else if (durationFilter === "3") {
        matchesDuration = item.daysCount === 3;
      } else if (durationFilter === "4+") {
        matchesDuration = item.daysCount >= 4;
      }

      return (
        matchesSearch && matchesDestination && matchesStatus && matchesDuration
      );
    });
  }, [
    itineraries,
    searchTerm,
    destinationFilter,
    statusFilter,
    durationFilter,
  ]);

  const isFiltered =
    searchTerm !== "" ||
    destinationFilter !== "ALL" ||
    durationFilter !== "ALL" ||
    statusFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchTerm("");
    setDestinationFilter("ALL");
    setDurationFilter("ALL");
    setStatusFilter("ALL");
  };

  const handleCreate = () => {
    navigate("/admin/itineraries/create");
  };

  const handleEdit = (item: IItineraryListItem) => {
    navigate(`/admin/itineraries/${item.id}/edit`);
  };

  const handlePreview = (item: IItineraryListItem) => {
    navigate(`/admin/itineraries/${item.id}/preview`);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const success = deleteItinerary(itemToDelete.id);
    if (success) {
      setSnackbar({
        open: true,
        message: `Đã xóa lịch trình "${itemToDelete.title}" (mô phỏng UI).`,
        severity: "success",
      });
    }
    setItemToDelete(null);
  };

  const columns: GridColDef<IItineraryListItem>[] = [
    {
      field: "coverImage",
      headerName: "Lịch trình",
      flex: 2,
      minWidth: 260,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <Avatar
            variant="rounded"
            src={row.coverImage || DEFAULT_NO_IMAGE}
            alt={row.title}
            slotProps={{
              img: {
                onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = DEFAULT_NO_IMAGE;
                },
              },
            }}
            sx={{
              width: 48,
              height: 44,
              borderRadius: "8px",
              bgcolor: "#F1F5F9",
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 600,
                color: "#172033",
                fontSize: "13.5px",
                lineHeight: 1.3,
              }}
            >
              {row.title}
            </Typography>
            <Typography
              noWrap
              sx={{
                color: "#64748B",
                fontSize: "12px",
                mt: 0.25,
              }}
            >
              {row.description}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "destination",
      headerName: "Địa điểm",
      flex: 1.2,
      minWidth: 150,
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
      field: "duration",
      headerName: "Thời lượng",
      width: 130,
      renderCell: ({ value }) => (
        <Typography
          noWrap
          sx={{
            color: "#1E293B",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {value as string}
        </Typography>
      ),
    },
    {
      field: "activityCount",
      headerName: "Hoạt động",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <Chip
          label={`${value} hoạt động`}
          size="small"
          sx={{
            bgcolor: "#F1F5F9",
            color: "#334155",
            fontWeight: 700,
            fontSize: "0.75rem",
            borderRadius: "6px",
          }}
        />
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => {
        const isCompleted = value === "Đã hoàn thiện";
        return (
          <Chip
            label={value as string}
            size="small"
            sx={{
              bgcolor: isCompleted ? "#ECFDF5" : "#FFFBEB",
              color: isCompleted ? "#059669" : "#D97706",
              border: isCompleted ? "1px solid #A7F3D0" : "1px solid #FDE68A",
              fontWeight: 700,
              fontSize: "0.75rem",
              borderRadius: "6px",
            }}
          />
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Cập nhật",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (
        <Typography sx={{ color: "#64748B", fontSize: "12.5px" }}>
          {value as string}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Tooltip title="Xem trước lịch trình">
            <Button
              variant="outlined"
              color="primary"
              aria-label="Xem trước lịch trình"
              onClick={() => handlePreview(row)}
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

          <Tooltip title="Chỉnh sửa lịch trình">
            <Button
              variant="contained"
              color="primary"
              aria-label="Chỉnh sửa lịch trình"
              onClick={() => handleEdit(row)}
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: "8px",
                boxShadow: "none",
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 17 }} />
            </Button>
          </Tooltip>

          <Tooltip title="Xóa lịch trình">
            <Button
              variant="contained"
              color="error"
              aria-label="Xóa lịch trình"
              onClick={() => setItemToDelete(row)}
              sx={{
                minWidth: 0,
                width: 32,
                height: 32,
                p: 0,
                borderRadius: "8px",
                boxShadow: "none",
              }}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 17 }} />
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <HeaderTitle>Lịch trình du lịch</HeaderTitle>

      {/* 5.1 Page Header & Action */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            Lịch trình du lịch
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Quản lý các lịch trình khám phá và hoạt động theo từng ngày.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            alignSelf: { xs: "stretch", sm: "auto" },
          }}
        >
          Tạo lịch trình
        </Button>
      </Box>

      {/* 5.2 Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2.5,
        }}
      >
        <Box>
          <Card
            elevation={1}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  Tổng lịch trình
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "8px",
                    bgcolor: "#EFF6FF",
                    color: "primary.main",
                  }}
                >
                  <MapOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {totalCount}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Đang quản lý trên hệ thống
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card
            elevation={1}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  Đã hoàn thiện
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "8px",
                    bgcolor: "#ECFDF5",
                    color: "#059669",
                  }}
                >
                  <CheckCircleOutlinedIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {completedCount}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#059669", fontWeight: 600 }}
              >
                Sẵn sàng phục vụ khách
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card
            elevation={1}
            sx={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", fontWeight: 600 }}
                >
                  Bản nháp
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "8px",
                    bgcolor: "#FFFBEB",
                    color: "#D97706",
                  }}
                >
                  <EditNoteIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "text.primary" }}
              >
                {draftCount}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#D97706", fontWeight: 600 }}
              >
                Đang biên tập nội dung
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* 5.3 Search & Filters Bar */}
      <Card
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
        }}
      >
        <TextField
          placeholder="Tìm theo tên lịch trình hoặc địa điểm..."
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
          sx={{ flex: { xs: "1 1 100%", md: "1 1 260px" }, minWidth: 220 }}
        />

        {/* Destination Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
          <InputLabel id="destination-filter-label">Địa điểm</InputLabel>
          <Select
            labelId="destination-filter-label"
            value={destinationFilter}
            label="Địa điểm"
            onChange={(e) => setDestinationFilter(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả địa điểm</MenuItem>
            {uniqueDestinations.map((dest) => (
              <MenuItem key={dest} value={dest}>
                {dest}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Duration Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
          <InputLabel id="duration-filter-label">Thời lượng</InputLabel>
          <Select
            labelId="duration-filter-label"
            value={durationFilter}
            label="Thời lượng"
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả thời lượng</MenuItem>
            <MenuItem value="1">1 ngày</MenuItem>
            <MenuItem value="2">2 ngày</MenuItem>
            <MenuItem value="3">3 ngày</MenuItem>
            <MenuItem value="4+">4 ngày trở lên</MenuItem>
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
          <InputLabel id="status-filter-label">Trạng thái</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
            <MenuItem value="Đã hoàn thiện">Đã hoàn thiện</MenuItem>
            <MenuItem value="Bản nháp">Bản nháp</MenuItem>
          </Select>
        </FormControl>

        {/* Reset button */}
        {isFiltered && (
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<FilterAltOffIcon />}
            onClick={handleResetFilters}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              borderColor: "#CBD5E1",
              color: "#475569",
              height: 40,
            }}
          >
            Đặt lại bộ lọc
          </Button>
        )}
      </Card>

      {/* 5.4 DataGrid */}
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
          rows={filteredItineraries}
          columns={columns}
          getRowId={(row) => row.id}
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
          }}
          sx={tableSx}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={Boolean(itemToDelete)}
        title="Xóa Lịch Trình"
        itemName={itemToDelete?.title}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default ItineraryListPage;
