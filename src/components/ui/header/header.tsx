import { MouseEvent, useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import { HeaderTitleContext } from "@/components/ui/header/headerTitleContext";

import { setAdminAuthenticated } from "@/utils/auth";

export interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const context = useContext(HeaderTitleContext);
  const headerTitle = context?.headerTitle;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    handleCloseUserMenu();
    setAdminAuthenticated(false);
    navigate("/admin/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          "linear-gradient(90deg, #4FA3F8 0%, #3B8AF5 50%, #257CE6 100%)",
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: { xs: "70%", md: "55%" },
          height: "100%",
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 500 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
          preserveAspectRatio="none"
        >
          <path
            d="M 0 64 C 180 64, 340 25, 500 5 L 500 64 Z"
            fill="#FFFFFF"
            fillOpacity="0.10"
          />
          <path
            d="M 80 64 C 260 55, 390 12, 500 0 L 500 64 Z"
            fill="#FFFFFF"
            fillOpacity="0.16"
          />
          <path
            d="M 170 64 C 310 42, 420 8, 500 0 L 500 28 C 410 32, 290 48, 170 64 Z"
            fill="#FFFFFF"
            fillOpacity="0.22"
          />
        </svg>
      </Box>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          zIndex: 1,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            aria-label="toggle sidebar"
            onClick={onToggleSidebar}
            edge="start"
            sx={{ color: "#FFFFFF" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF" }}
          >
            {headerTitle}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Account settings">
              <IconButton
                aria-label="user profile menu"
                onClick={handleOpenUserMenu}
                sx={{ p: 0.25 }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#FFFFFF",
                    color: "#257CE6",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  AD
                </Avatar>
              </IconButton>
            </Tooltip>
            <IconButton
              aria-label="user menu dropdown"
              onClick={handleOpenUserMenu}
              sx={{ p: 0.25, color: "#FFFFFF" }}
            >
              <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: { minWidth: 160, mt: 1, borderRadius: 2 },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  noWrap
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  Admin User
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography color="error">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
