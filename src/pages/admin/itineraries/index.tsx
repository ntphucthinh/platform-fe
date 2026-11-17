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
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useNavigate } from "react-router-dom";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { tableSx } from "@/components/ui/table/tableStyles";
import { useItineraryList } from "@/hooks/itineraries/useItineraries";
import { useTravelLocationSelection } from "@/hooks/selections/useTravelLocationSelection";
import type { IItineraryListItem } from "@/types/pages/itineraries/itinerary";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";
import { DEFAULT_NO_IMAGE } from "@/constants/homestay";
import { ItineraryCard } from "@/components/pages/itineraries/itineraryCard";

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
  const { travelLocationsSelections } = useTravelLocationSelection();
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("ALL");

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

  // Filtered dataset
  const filteredItineraries = useMemo(() => {
    const selectedLoc = travelLocationsSelections.find(
      (opt) => String(opt.value) === destinationFilter,
    );

    return itineraries.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        (item.destination && item.destination.toLowerCase().includes(term)) ||
        item.description.toLowerCase().includes(term);

      const matchesDestination =
        destinationFilter === "ALL" ||
        (item.locationId !== undefined &&
          item.locationId !== null &&
          String(item.locationId) === destinationFilter) ||
        (Boolean(item.destination) &&
          Boolean(selectedLoc) &&
          (item.destination
            ?.toLowerCase()
            .includes(selectedLoc?.label.toLowerCase() || "") ||
            selectedLoc?.label
              .toLowerCase()
              .includes(item.destination?.toLowerCase() || "")));

      return matchesSearch && matchesDestination;
    });
  }, [itineraries, searchTerm, destinationFilter, travelLocationsSelections]);

  // Mobile card view pagination (10 items / page, 2 cols x 5 rows)
  const [mobilePage, setMobilePage] = useState(1);
  const mobilePerPage = 10;
  const totalMobileItems = filteredItineraries.length;
  const totalMobilePages = Math.max(1, Math.ceil(totalMobileItems / mobilePerPage));

  // Reset mobile page to 1 when search or filters change
  const filterKey = `${searchTerm}_${destinationFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setMobilePage(1);
  }

  const safeMobilePage = Math.min(mobilePage, totalMobilePages);
  const startMobileItem =
    totalMobileItems === 0 ? 0 : (safeMobilePage - 1) * mobilePerPage + 1;
  const endMobileItem = Math.min(safeMobilePage * mobilePerPage, totalMobileItems);

  const visibleMobileItineraries = useMemo(() => {
    return filteredItineraries.slice(
      (safeMobilePage - 1) * mobilePerPage,
      safeMobilePage * mobilePerPage,
    );
  }, [filteredItineraries, safeMobilePage, mobilePerPage]);

  const isFiltered =
    searchTerm !== "" ||
    destinationFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchTerm("");
    setDestinationFilter("ALL");
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
          {(value as string) || "—"}
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
          {(value as string) || "—"}
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
          <Tooltip title="Chi tiết lịch trình">
            <Button
              variant="outlined"
              color="primary"
              aria-label="Chi tiết lịch trình"
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 } }}>
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
              minWidth: { xs: "100%", sm: 180 },
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
              {travelLocationsSelections.map((loc) => (
                <MenuItem key={loc.value} value={String(loc.value)}>
                  {loc.label}
                </MenuItem>
              ))}
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

        {/* Right: Create Action */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexShrink: 0,
            width: { xs: "100%", md: "auto" },
            justifyContent: "flex-end",
          }}
        >
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

      {/* 5.4 DataGrid (Desktop sm+) */}
      <Card
        elevation={0}
        sx={{
          display: { xs: "none", sm: "block" },
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

      {/* 5.5 Mobile Card Grid & Pagination (xs only) */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
        }}
      >
        {totalMobileItems === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: "12px",
              border: "1px dashed #CBD5E1",
              bgcolor: "#F8FAFC",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Không tìm thấy lịch trình nào
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Chưa có dữ liệu phù hợp với từ khóa hoặc bộ lọc đã chọn.
            </Typography>
          </Card>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 1.25,
                width: "100%",
              }}
            >
              {visibleMobileItineraries.map((item) => (
                <ItineraryCard
                  key={item.id}
                  item={item}
                  onView={handlePreview}
                  onEdit={handleEdit}
                  onDelete={(it) => setItemToDelete(it)}
                />
              ))}
            </Box>

            {/* Mobile Pagination */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.25,
                pt: 2,
                mt: 1,
                borderTop: "1px solid #E2E8F0",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                Đang xem {startMobileItem}–{endMobileItem} trong {totalMobileItems} lịch trình
              </Typography>

              {totalMobilePages > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ChevronLeftRoundedIcon />}
                    disabled={safeMobilePage <= 1}
                    onClick={() => setMobilePage((p) => Math.max(1, p - 1))}
                    aria-label="Trang trước"
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.825rem",
                      borderColor: "#CBD5E1",
                      color: "text.primary",
                      minHeight: 40,
                      minWidth: 80,
                      px: 1.5,
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "#F8FAFC",
                      },
                      "&.Mui-disabled": {
                        borderColor: "#E2E8F0",
                        bgcolor: "#F8FAFC",
                      },
                    }}
                  >
                    Trước
                  </Button>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      px: 1.25,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    Trang {safeMobilePage} / {totalMobilePages}
                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<ChevronRightRoundedIcon />}
                    disabled={safeMobilePage >= totalMobilePages}
                    onClick={() =>
                      setMobilePage((p) => Math.min(totalMobilePages, p + 1))
                    }
                    aria-label="Trang sau"
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.825rem",
                      borderColor: "#CBD5E1",
                      color: "text.primary",
                      minHeight: 40,
                      minWidth: 80,
                      px: 1.5,
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "#F8FAFC",
                      },
                      "&.Mui-disabled": {
                        borderColor: "#E2E8F0",
                        bgcolor: "#F8FAFC",
                      },
                    }}
                  >
                    Sau
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>

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
