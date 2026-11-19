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
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLogout } from "@refinedev/core";
import { HeaderTitleContext } from "@/components/ui/header/headerTitleContext";
import { getStoredAdminUser } from "@/utils/auth";

export interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { mutate: logout } = useLogout();
  const context = useContext(HeaderTitleContext);
  const headerTitle = context?.headerTitle;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const storedUser = getStoredAdminUser();
  const displayName = storedUser?.fullName || storedUser?.username || "Admin";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    handleCloseUserMenu();
    logout({
      redirectPath: "/admin/login",
    });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: (theme) => theme.palette.layout.headerGradient,
        color: "#FFFFFF",
        position: "sticky",
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        overflow: "hidden",
      }}
    >
      {/* Layered Wave Decorative SVG Background (Right Half) */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: { xs: "56%", sm: "64%", md: "62%" },
          height: "100%",
          pointerEvents: "none",
          userSelect: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 640 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        >
          <defs>
            {/* Layer 1: Soft ambient outer wave gradient */}
            <linearGradient
              id="headerWaveLayer1"
              x1="40"
              y1="32"
              x2="640"
              y2="16"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="28%" stopColor="#E5F0FD" stopOpacity="0.11" />
              <stop offset="72%" stopColor="#FFFFFF" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#E5F0FD" stopOpacity="0.1" />
            </linearGradient>

            {/* Layer 2: Central silky crest wave gradient */}
            <linearGradient
              id="headerWaveLayer2"
              x1="320"
              y1="8"
              x2="320"
              y2="64"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="55%" stopColor="#E5F0FD" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#58AAF8" stopOpacity="0.03" />
            </linearGradient>

            {/* Layer 3: Foreground sweeping ribbon wave gradient */}
            <linearGradient
              id="headerWaveLayer3"
              x1="220"
              y1="14"
              x2="640"
              y2="56"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="75%" stopColor="#E5F0FD" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
            </linearGradient>

            {/* Subtle luminous ridge stroke gradients */}
            <linearGradient
              id="headerWaveStroke1"
              x1="40"
              y1="30"
              x2="620"
              y2="4"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="78%" stopColor="#FFFFFF" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient
              id="headerWaveStroke2"
              x1="170"
              y1="40"
              x2="640"
              y2="10"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.26" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.06" />
            </linearGradient>
          </defs>

          {/* Wave Layer 1 (Back undulating wave - hidden on small mobile to reduce visual complexity) */}
          <Box
            component="g"
            sx={{ display: { xs: "none", sm: "inline" } }}
          >
            <path
              d="M 15 64 C 105 62, 165 25, 270 28 C 365 31, 430 6, 535 0 L 640 0 L 640 64 Z"
              fill="url(#headerWaveLayer1)"
            />
            <path
              d="M 15 64 C 105 62, 165 25, 270 28 C 365 31, 430 6, 535 0"
              stroke="url(#headerWaveStroke1)"
              strokeWidth="1.1"
              fill="none"
            />
          </Box>

          {/* Wave Layer 2 (Middle S-curve wave cresting and sweeping to top-right) */}
          <path
            d="M 160 64 C 225 42, 275 34, 355 41 C 425 47, 485 11, 575 0 L 640 0 L 640 64 Z"
            fill="url(#headerWaveLayer2)"
          />
          <path
            d="M 160 64 C 225 42, 275 34, 355 41 C 425 47, 485 11, 575 0"
            stroke="url(#headerWaveStroke2)"
            strokeWidth="1.25"
            fill="none"
          />

          {/* Wave Layer 3 (Foreground gentle intersecting wave ribbon) */}
          <path
            d="M 245 64 C 335 58, 415 21, 520 15 C 575 12, 612 18, 640 24 L 640 64 Z"
            fill="url(#headerWaveLayer3)"
          />
          <path
            d="M 245 64 C 335 58, 415 21, 520 15 C 575 12, 612 18, 640 24"
            stroke="url(#headerWaveStroke1)"
            strokeWidth="1"
            fill="none"
          />
        </Box>
      </Box>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 1.5, sm: 2.5 },
          minHeight: { xs: 50, sm: 56 },
          zIndex: 1,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, mr: 1 }}>
          <IconButton
            aria-label="toggle sidebar"
            onClick={onToggleSidebar}
            edge="start"
            sx={{
              color: "#FFFFFF",
              flexShrink: 0,
              width: 40,
              height: 40,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            noWrap
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {headerTitle}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Tài khoản">
              <IconButton
                aria-label="Mở menu tài khoản"
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
                onClick={handleOpenUserMenu}
                sx={{
                  p: 0.5,
                  pr: 0.75,
                  gap: 0.5,
                  borderRadius: "24px",
                  color: "#FFFFFF",
                  minWidth: 40,
                  minHeight: 40,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.14)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#FFFFFF",
                    color: "primary.main",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  {initials || "AD"}
                </Avatar>
                <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
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
                  {displayName}
                </Typography>
                {storedUser?.email && (
                  <Typography variant="caption" noWrap sx={{ color: "text.secondary" }}>
                    {storedUser.email}
                  </Typography>
                )}
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                <Typography color="error">Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
