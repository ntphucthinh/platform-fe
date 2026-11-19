import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Tooltip,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CottageIcon from "@mui/icons-material/Cottage";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import { useLocation, Link } from "react-router-dom";
import { APP_NAME } from "@/constants/common";

const SIDEBAR_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

interface SidebarProps {
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
}

interface SubMenuItem {
  title: string;
  path: string;
}

interface MenuItem {
  title: string;
  path?: string;
  icon: React.ReactNode;
  disabled?: boolean;
  children?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { title: "Homestays", path: "/admin/homestay", icon: <CottageIcon /> },
  {
    title: "Lịch trình du lịch",
    icon: <MapOutlinedIcon />,
    children: [
      { title: "Danh sách lịch trình", path: "/admin/itineraries" },
      { title: "Thêm lịch trình", path: "/admin/itineraries/create" },
    ],
  },
  {
    title: "Kỷ niệm chuyến đi",
    icon: <CollectionsBookmarkOutlinedIcon />,
    children: [
      { title: "Danh sách chuyến đi", path: "/admin/travel-memories" },
      { title: "Thêm chuyến đi", path: "/admin/travel-memories/create" },
    ],
  },
  {
    title: "Bản đồ hành trình",
    path: "/admin/travel-map",
    icon: <ExploreOutlinedIcon />,
  },
  {
    title: "Users",
    icon: <PeopleIcon />,
    children: [
      { title: "Users List", path: "/users/list" },
      { title: "Users Create", path: "/users/create" },
      { title: "Users Setting", path: "/users/setting" },
    ],
  },
];

interface SidebarBottomDecorationProps {
  compact?: boolean;
}

const SidebarBottomDecoration: React.FC<SidebarBottomDecorationProps> = ({
  compact = false,
}) => {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: "100%",
        height: compact ? 72 : { xs: 105, sm: 138 },
        mt: "auto",
        flexShrink: 0,
        pointerEvents: "none",
        userSelect: "none",
        overflow: "hidden",
        position: "relative",
        zIndex: 0,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 260 140"
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
          {/* Distant Mountain Layer Gradient */}
          <linearGradient
            id="sidebarMtnBack"
            x1="130"
            y1="18"
            x2="130"
            y2="135"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#58AAF8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#E5F0FD" stopOpacity="0.06" />
          </linearGradient>

          {/* Midground Mountain Ridge Gradient */}
          <linearGradient
            id="sidebarMtnMid"
            x1="180"
            y1="32"
            x2="160"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#58AAF8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#E5F0FD" stopOpacity="0.12" />
          </linearGradient>

          {/* Left Foreground Wave Hill Gradient */}
          <linearGradient
            id="sidebarWaveLeft"
            x1="80"
            y1="72"
            x2="90"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#58AAF8" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#2589F2" stopOpacity="0.24" />
          </linearGradient>

          {/* Right Foreground Wave Hill Gradient */}
          <linearGradient
            id="sidebarWaveRight"
            x1="180"
            y1="78"
            x2="180"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2589F2" stopOpacity="0.52" />
            <stop offset="100%" stopColor="#58AAF8" stopOpacity="0.3" />
          </linearGradient>

          {/* Pine Tree Silhouette Gradient */}
          <linearGradient
            id="sidebarPineGrad"
            x1="0"
            y1="45"
            x2="0"
            y2="105"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2589F2" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#58AAF8" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* Layer 1: Distant Left & Right Mountain Peaks */}
        <path
          d="M 0 54 Q 44 14, 92 42 T 184 38 Q 222 16, 260 44 L 260 140 L 0 140 Z"
          fill="url(#sidebarMtnBack)"
        />

        {/* Layer 2: Soft Rolling Midground Ridge */}
        <path
          d="M 0 84 Q 58 68, 114 78 T 218 52 Q 242 46, 260 56 L 260 140 L 0 140 Z"
          fill="url(#sidebarMtnMid)"
        />

        {/* Minimalist Evergreen Pine Trees on Left Slope (Hidden when sidebar is collapsed) */}
        {!compact && (
          <g>
            {/* Small Left Pine */}
            <path
              d="M 27 68 L 19 81 L 23 81 L 17 91 L 37 91 L 31 81 L 35 81 Z"
              fill="url(#sidebarPineGrad)"
              opacity="0.75"
            />
            {/* Tall Center Pine */}
            <path
              d="M 52 44 L 40 62 L 45 62 L 37 76 L 43 76 L 35 89 L 69 89 L 61 76 L 67 76 L 59 62 L 64 62 Z"
              fill="url(#sidebarPineGrad)"
            />
            {/* Medium Right Pine */}
            <path
              d="M 78 57 L 68 72 L 72 72 L 66 84 L 70 84 L 65 93 L 91 93 L 86 84 L 90 84 L 84 72 L 88 72 Z"
              fill="url(#sidebarPineGrad)"
              opacity="0.85"
            />
          </g>
        )}

        {/* Layer 3: Foreground Left Sweeping Wave Hill */}
        <path
          d="M 0 88 Q 68 74, 154 108 T 260 124 L 260 140 L 0 140 Z"
          fill="url(#sidebarWaveLeft)"
        />

        {/* Layer 4: Foreground Bottom-Right Layered Wave */}
        <path
          d="M 42 140 Q 138 92, 224 98 Q 244 100, 260 105 L 260 140 Z"
          fill="url(#sidebarWaveRight)"
        />
      </Box>
    </Box>
  );
};

export function Sidebar({
  isMobile,
  mobileOpen,
  onMobileClose,
  isCollapsed,
}: SidebarProps) {
  const location = useLocation();

  const isUsersRoute = location.pathname.startsWith("/users");
  const isTravelMemoriesRoute = location.pathname.startsWith(
    "/admin/travel-memories",
  );
  const isItinerariesRoute = location.pathname.startsWith("/admin/itineraries");
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Users: isUsersRoute,
    "Kỷ niệm chuyến đi": isTravelMemoriesRoute,
    "Lịch trình du lịch": isItinerariesRoute,
  });

  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (isUsersRoute) {
      setOpenMenus((prev) => ({ ...prev, Users: true }));
    }
    if (isTravelMemoriesRoute) {
      setOpenMenus((prev) => ({ ...prev, "Kỷ niệm chuyến đi": true }));
    }
    if (isItinerariesRoute) {
      setOpenMenus((prev) => ({ ...prev, "Lịch trình du lịch": true }));
    }
  }

  const handleParentToggle = (item: MenuItem) => {
    if (item.disabled) return;
    if (item.children) {
      setOpenMenus((prev) => ({ ...prev, [item.title]: !prev[item.title] }));
    }
  };

  const isCompactDesktop = isCollapsed && !isMobile;

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 68%, #F7F9FC 100%)",
      }}
    >
      {/* Sidebar Brand Header */}
      <Box
        component={Link}
        to="/admin/dashboard"
        sx={{
          textDecoration: "none",
          color: "inherit",
          height: { xs: 50, sm: 56 },
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          px: isCompactDesktop ? 2 : 2.5,
          justifyContent: isCompactDesktop ? "center" : "flex-start",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          component="img"
          src="/logo.svg"
          alt={APP_NAME}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            flexShrink: 0,
            objectFit: "contain",
            boxShadow: "0 2px 6px rgba(25, 118, 210, 0.22)",
          }}
        />
        {!isCompactDesktop && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "text.primary",
            }}
          >
            {APP_NAME}
          </Typography>
        )}
      </Box>

      {/* Navigation Menu List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1.5,
          px: isCompactDesktop ? 1 : 1.75,
          zIndex: 1,
        }}
      >
        <List
          component="nav"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            p: 0,
          }}
        >
          {menuItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = Boolean(openMenus[item.title]);
            const isParentSelected = item.path
              ? location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path + "/"))
              : hasChildren &&
                ((item.title === "Users" && isUsersRoute) ||
                  (item.title === "Kỷ niệm chuyến đi" &&
                    isTravelMemoriesRoute) ||
                  (item.title === "Lịch trình du lịch" && isItinerariesRoute) ||
                  Boolean(
                    item.children?.some(
                      (child) => location.pathname === child.path,
                    ),
                  ));

            const isLink = Boolean(item.path && !hasChildren);
            const isActivePill = Boolean(isParentSelected && !hasChildren);

            const parentButtonContent = (
              <ListItemButton
                {...(isLink ? { component: Link, to: item.path } : {})}
                selected={isActivePill}
                disabled={item.disabled}
                onClick={() => {
                  if (hasChildren) {
                    handleParentToggle(item);
                  } else if (isMobile) {
                    onMobileClose();
                  }
                }}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  textDecoration: "none",
                  minHeight: 44,
                  borderRadius: "12px",
                  justifyContent: isCompactDesktop ? "center" : "flex-start",
                  px: isCompactDesktop ? 1.5 : 2,
                  color: isParentSelected ? "primary.main" : "text.primary",
                  bgcolor: isActivePill ? "action.selected" : "transparent",
                  transition: "background-color 0.18s ease, color 0.18s ease",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "18%",
                    bottom: "18%",
                    width: "3.5px",
                    borderRadius: "4px",
                    bgcolor: "primary.main",
                    opacity: isParentSelected ? 1 : 0,
                    transform: isParentSelected ? "scaleY(1)" : "scaleY(0.4)",
                    transition: "opacity 0.18s ease, transform 0.18s ease",
                  },
                  "& .MuiListItemIcon-root": {
                    minWidth: isCompactDesktop ? 0 : 34,
                    mr: isCompactDesktop ? 0 : 0.75,
                    justifyContent: "center",
                    color: isParentSelected ? "primary.main" : "text.secondary",
                    transition: "color 0.18s ease",
                    "& .MuiSvgIcon-root": {
                      fontSize: 21,
                    },
                  },
                  "&:hover": {
                    bgcolor: isActivePill ? "action.selected" : "action.hover",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                    "&:hover": {
                      bgcolor: "action.selected",
                    },
                  },
                  opacity: item.disabled ? 0.45 : 1,
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {!isCompactDesktop && (
                  <>
                    <ListItemText
                      primary={item.title}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: "0.925rem",
                            fontWeight: isParentSelected ? 600 : 500,
                            lineHeight: 1.35,
                          },
                        },
                      }}
                    />
                    {hasChildren &&
                      (isOpen ? (
                        <KeyboardArrowUpRoundedIcon
                          sx={{
                            fontSize: 20,
                            color: isParentSelected
                              ? "primary.main"
                              : "text.secondary",
                          }}
                        />
                      ) : (
                        <KeyboardArrowDownRoundedIcon
                          sx={{
                            fontSize: 20,
                            color: isParentSelected
                              ? "primary.main"
                              : "text.secondary",
                          }}
                        />
                      ))}
                  </>
                )}
              </ListItemButton>
            );

            if (isCompactDesktop) {
              return (
                <Tooltip key={item.title} title={item.title} placement="right">
                  <Box>{parentButtonContent}</Box>
                </Tooltip>
              );
            }

            return (
              <Box key={item.title}>
                {parentButtonContent}
                {hasChildren && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List
                      component="div"
                      disablePadding
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.35,
                        mt: 0.4,
                      }}
                    >
                      {item.children?.map((subItem) => {
                        const isSubSelected =
                          location.pathname === subItem.path;
                        return (
                          <ListItemButton
                            key={subItem.path}
                            component={Link}
                            to={subItem.path}
                            selected={isSubSelected}
                            onClick={() => {
                              if (isMobile) {
                                onMobileClose();
                              }
                            }}
                            sx={{
                              position: "relative",
                              overflow: "hidden",
                              textDecoration: "none",
                              minHeight: { xs: 42, sm: 38 },
                              pl: 6.25,
                              pr: 2,
                              borderRadius: "12px",
                              color: isSubSelected
                                ? "primary.main"
                                : "text.secondary",
                              bgcolor: isSubSelected
                                ? "action.selected"
                                : "transparent",
                              transition:
                                "background-color 0.18s ease, color 0.18s ease",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: "20%",
                                bottom: "20%",
                                width: "3px",
                                borderRadius: "4px",
                                bgcolor: "primary.main",
                                opacity: isSubSelected ? 1 : 0,
                                transition: "opacity 0.18s ease",
                              },
                              "&:hover": {
                                bgcolor: isSubSelected
                                  ? "action.selected"
                                  : "action.hover",
                                color: "primary.main",
                              },
                              "&.Mui-selected": {
                                bgcolor: "action.selected",
                                color: "primary.main",
                                "&:hover": {
                                  bgcolor: "action.selected",
                                },
                              },
                            }}
                          >
                            <ListItemText
                              primary={subItem.title}
                              slotProps={{
                                primary: {
                                  sx: {
                                    fontSize: "0.85rem",
                                    fontWeight: isSubSelected ? 600 : 500,
                                  },
                                },
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Bottom Mountain & Layered Wave Vector Decoration */}
      <SidebarBottomDecoration compact={isCompactDesktop} />
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: 260, sm: SIDEBAR_WIDTH },
            maxWidth: "85vw",
            bgcolor: "background.paper",
            borderRight: "1px solid #E7ECF2",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        flexShrink: 0,
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        "& .MuiDrawer-paper": {
          width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          boxSizing: "border-box",
          overflowX: "hidden",
          bgcolor: "background.paper",
          borderRight: "1px solid #E7ECF2",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export { SIDEBAR_WIDTH, COLLAPSED_WIDTH };
