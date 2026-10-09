import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";
import { HeaderTitle } from "@/components/ui/header/headerTitle";
import { tableSx } from "@/components/ui/table/tableStyles";
import { MOCK_USERS } from "@/constants/userConstant";
import type { IUserItem } from "@/types/pages/users/user";
import { DeleteConfirmDialog } from "@/components/common/deleteConfirmDialog";

function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 200,
        py: 6,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600, color: "#334155" }}>
        No users found
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
        Try searching with a different keyword.
      </Typography>
    </Box>
  );
}

export function UsersList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<IUserItem[]>(MOCK_USERS);
  const [userToDelete, setUserToDelete] = useState<IUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteClick = (user: IUserItem) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusChip = (status: IUserItem["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Chip
            label="Active"
            size="small"
            sx={{
              bgcolor: "#DCFCE7",
              color: "#15803D",
              fontWeight: 600,
              fontSize: "12px",
              height: "24px",
              borderRadius: "12px",
              border: "none",
              px: 0.5,
            }}
          />
        );
      case "Inactive":
        return (
          <Chip
            label="Inactive"
            size="small"
            sx={{
              bgcolor: "#F1F5F9",
              color: "#64748B",
              fontWeight: 600,
              fontSize: "12px",
              height: "24px",
              borderRadius: "12px",
              border: "none",
              px: 0.5,
            }}
          />
        );
      case "Pending":
        return (
          <Chip
            label="Pending"
            size="small"
            sx={{
              bgcolor: "#FEF3C7",
              color: "#B45309",
              fontWeight: 600,
              fontSize: "12px",
              height: "24px",
              borderRadius: "12px",
              border: "none",
              px: 0.5,
            }}
          />
        );
    }
  };

  const getRoleChip = (role: IUserItem["role"]) => {
    switch (role) {
      case "Administrator":
        return (
          <Chip
            label="Administrator"
            size="small"
            variant="outlined"
            sx={{
              bgcolor: "#EFF6FF",
              color: "#1D4ED8",
              borderColor: "#BFDBFE",
              fontWeight: 600,
              fontSize: "12px",
              height: "26px",
              borderRadius: "13px",
              px: 0.5,
            }}
          />
        );
      case "Manager":
        return (
          <Chip
            label="Manager"
            size="small"
            variant="outlined"
            sx={{
              bgcolor: "#F5F3FF",
              color: "#6D28D9",
              borderColor: "#DDD6FE",
              fontWeight: 600,
              fontSize: "12px",
              height: "26px",
              borderRadius: "13px",
              px: 0.5,
            }}
          />
        );
      case "User":
        return (
          <Chip
            label="User"
            size="small"
            variant="outlined"
            sx={{
              bgcolor: "#F8FAFC",
              color: "#475569",
              borderColor: "#E2E8F0",
              fontWeight: 500,
              fontSize: "12px",
              height: "26px",
              borderRadius: "13px",
              px: 0.5,
            }}
          />
        );
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const columns: GridColDef<IUserItem>[] = [
    {
      field: "user",
      headerName: "User",
      flex: 2,
      minWidth: 220,
      sortable: false,
      valueGetter: (_value, row) => row.name,
      renderCell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "primary.main",
              fontSize: "0.8125rem",
              fontWeight: 600,
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            {getInitials(row.name)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 600,
                color: "#172033",
                fontSize: "13.5px",
                lineHeight: 1.4,
                display: "block",
              }}
            >
              {row.name}
            </Typography>
            <Typography
              noWrap
              sx={{
                color: "#64748B",
                fontSize: "12px",
                lineHeight: 1.35,
                display: "block",
                mt: "1px",
              }}
            >
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.95,
      minWidth: 130,
      renderCell: ({ value }) => getRoleChip(value as IUserItem["role"]),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 110,
      renderCell: ({ value }) => getStatusChip(value as IUserItem["status"]),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.85,
      minWidth: 120,
      renderCell: ({ value }) => (
        <Typography
          sx={{
            fontSize: "13px",
            color: "#475569",
            fontWeight: 400,
          }}
        >
          {value as string}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 104,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Edit user">
            <Button
              variant="contained"
              color="info"
              aria-label="Edit user"
              onClick={() => navigate(`/users/edit/${row.id}`)}
              sx={{
                minWidth: 0,
                width: 36,
                height: 36,
                p: 0,
                borderRadius: "8px",
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 18, color: "inherit" }} />
            </Button>
          </Tooltip>

          <Tooltip title="Delete user">
            <Button
              variant="contained"
              color="error"
              aria-label="Delete user"
              onClick={() => handleDeleteClick(row)}
              sx={{
                minWidth: 0,
                width: 36,
                height: 36,
                p: 0,
                borderRadius: "8px",
              }}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 18, color: "inherit" }} />
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <HeaderTitle>User List</HeaderTitle>

      <Card
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search users..."
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
          sx={{ width: { xs: "100%", sm: 320 } }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/users/create")}
        >
          Add User
        </Button>
      </Card>

      <Card
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: "#FFFFFF",
          borderRadius: "10px",
          border: "1px solid #E5E7EB",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredUsers}
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

      <DeleteConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete User"
        itemName={userToDelete?.name}
        loading={isDeleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}

export default UsersList;
