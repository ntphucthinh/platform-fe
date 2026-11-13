import React, { useState, useMemo } from "react";
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
import { useNavigate } from "react-router-dom";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { tableSx } from "@/components/ui/table/tableStyles";
import { useItineraryList } from "@/hooks/itineraries/useItineraries";
import type { IItineraryListItem } from "@/types/pages/itineraries/itinerary";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";

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
      <Typography variant="body1" sx={{ fontWeight: 600, color: "text.primary" }}>
        Không tìm thấy lịch trình nào
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
        Chưa có dữ liệu phù hợp với từ khóa hoặc bộ lọc đã chọn.
      </Typography>
    </Box>
  );
}

export const ItineraryListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: itineraries, deleteItinerary } = useItineraryList();
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("ALL");
  const [durationFilter, setDurationFilter] = useState("ALL");

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
  const totalActivitiesCount = useMemo(
    () => itineraries.reduce((sum, item) => sum + (item.activityCount || 0), 0),
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

      return matchesSearch && matchesDestination && matchesDuration;
    });
  }, [
    itineraries,
    searchTerm,
    destinationFilter,
    durationFilter,
  ]);

  const isFiltered =
    searchTerm !== "" ||
    destinationFilter !== "ALL" ||
    durationFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchTerm("");
    setDestinationFilter("ALL");
    setDurationFilter("ALL");
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
        message: "Đã xóa lịch trình thành công (mô phỏng UI).",
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

          <Tooltip title="Chỉnh sửa lịch trình">
            <Button
              variant="contained"
              color="primary"
              aria-label="Chỉnh sửa lịch trình"
              onClick={() => handleEdit(row)}
              sx={{
                minWidth: 0,
                width: { xs: 36, sm: 34 },
                height: { xs: 36, sm: 34 },
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
                width: { xs: 36, sm: 34 },
                height: { xs: 36, sm: 34 },
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

      {/* 5.1 Unified Distilled Control Bar */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Left Filters */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            flexWrap: "wrap",
            flex: 1,
            minWidth: 0,
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
            sx={{
              minWidth: 220,
              flex: { xs: "1 1 100%", sm: "0 1 280px" },
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                fontSize: "0.875rem",
              },
            }}
          />

          {/* Destination Filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 160 },
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                fontSize: "0.875rem",
              },
            }}
          >
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
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "8px",
                bgcolor: "#F8FAFC",
                fontSize: "0.875rem",
              },
            }}
          >
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

          {/* Reset button */}
          {isFiltered && (
            <Button
              variant="text"
              size="small"
              startIcon={<FilterAltOffIcon sx={{ fontSize: 17 }} />}
              onClick={handleResetFilters}
              sx={{
                height: 40,
                borderRadius: "8px",
                textTransform: "none",
                color: "#64748B",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 1.25,
                "&:hover": { color: "#0F172A", bgcolor: "#F1F5F9" },
              }}
            >
              Xóa lọc
            </Button>
          )}
        </Box>

        {/* Right: Quick Stat & Create Action */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
            width: { xs: "100%", md: "auto" },
            justifyContent: { xs: "space-between", md: "flex-end" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.85rem",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {totalCount} lịch trình ({totalActivitiesCount} hoạt động)
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              height: 40,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 2.25,
              boxShadow: "none",
              whiteSpace: "nowrap",
              flex: { xs: 1, sm: "initial" },
            }}
          >
            Tạo lịch trình
          </Button>
        </Box>
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
        message="Bạn có chắc chắn muốn xóa lịch trình này? Thao tác này không thể hoàn tác."
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification */}
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

export default ItineraryListPage;
