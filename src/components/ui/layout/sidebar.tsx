import React, { useState } from 'react'
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
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import CottageIcon from '@mui/icons-material/Cottage'
import InventoryIcon from '@mui/icons-material/Inventory'
import AssessmentIcon from '@mui/icons-material/Assessment'
import SettingsIcon from '@mui/icons-material/Settings'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useLocation, useNavigate } from 'react-router-dom'

const SIDEBAR_WIDTH = 260
const COLLAPSED_WIDTH = 72

interface SidebarProps {
  isMobile: boolean
  mobileOpen: boolean
  onMobileClose: () => void
  isCollapsed: boolean
}

interface SubMenuItem {
  title: string
  path: string
}

interface MenuItem {
  title: string
  path?: string
  icon: React.ReactNode
  disabled?: boolean
  children?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  { title: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { title: 'Homestays', path: '/admin/homestay', icon: <CottageIcon /> },
  {
    title: 'Users',
    icon: <PeopleIcon />,
    children: [
      { title: 'Users List', path: '/users/list' },
      { title: 'Users Create', path: '/users/create' },
      { title: 'Users Setting', path: '/users/setting' },
    ],
  },
  { title: 'Products', path: '/products', icon: <InventoryIcon />, disabled: true },
  { title: 'Reports', path: '/reports', icon: <AssessmentIcon />, disabled: true },
  { title: 'Settings', path: '/settings', icon: <SettingsIcon />, disabled: true },
]

export function Sidebar({ isMobile, mobileOpen, onMobileClose, isCollapsed }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const isUsersRoute = location.pathname.startsWith('/users')
  const [prevPath, setPrevPath] = useState(location.pathname)
  const [usersOpen, setUsersOpen] = useState(isUsersRoute)

  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    if (isUsersRoute) {
      setUsersOpen(true)
    }
  }

  const handleParentClick = (item: MenuItem) => {
    if (item.disabled) return

    if (item.children) {
      setUsersOpen((prev) => !prev)
    } else if (item.path) {
      navigate(item.path)
      if (isMobile) {
        onMobileClose()
      }
    }
  }

  const handleSubItemClick = (path: string) => {
    navigate(path)
    if (isMobile) {
      onMobileClose()
    }
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#FFFFFF' }}>
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          px: isCollapsed && !isMobile ? 2 : 3,
          justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: '#E7ECF2',
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            bgcolor: '#2F80ED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          P
        </Box>
        {(!isCollapsed || isMobile) && (
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em', color: '#172033' }}>
            Platform
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1, py: 2, px: isCollapsed && !isMobile ? 1 : 1.5 }}>
        <List component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {menuItems.map((item) => {
            const hasChildren = Boolean(item.children?.length)
            const isParentSelected = item.path
              ? location.pathname === item.path
              : hasChildren && isUsersRoute

            const parentButtonContent = (
              <ListItemButton
                selected={isParentSelected && !hasChildren}
                disabled={item.disabled}
                onClick={() => handleParentClick(item)}
                sx={{
                  minHeight: 44,
                  borderRadius: '10px',
                  justifyContent: isCollapsed && !isMobile ? 'center' : 'flex-start',
                  px: isCollapsed && !isMobile ? 1.5 : 2,
                  color: isParentSelected ? '#1976D2' : '#64748B',
                  bgcolor: isParentSelected && !hasChildren ? '#E5F0FD' : 'transparent',
                  transition: 'all 0.15s ease-in-out',
                  '& .MuiListItemIcon-root': {
                    minWidth: isCollapsed && !isMobile ? 0 : 36,
                    mr: isCollapsed && !isMobile ? 0 : 1,
                    justifyContent: 'center',
                    color: isParentSelected ? '#1976D2' : '#64748B',
                    transition: 'color 0.15s ease-in-out',
                  },
                  '&:hover': {
                    bgcolor: '#F3F7FC',
                    color: '#1976D2',
                    '& .MuiListItemIcon-root': { color: '#1976D2' },
                  },
                  '&.Mui-selected': {
                    bgcolor: '#E5F0FD',
                    color: '#1976D2',
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': { color: '#1976D2' },
                    '&:hover': { bgcolor: '#E5F0FD' },
                  },
                  opacity: item.disabled ? 0.45 : 1,
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {(!isCollapsed || isMobile) && (
                  <>
                    <ListItemText
                      primary={item.title}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '0.9rem',
                            fontWeight: isParentSelected ? 600 : 500,
                          },
                        },
                      }}
                    />
                    {hasChildren && (usersOpen ? <ArrowDropUpIcon sx={{ fontSize: 20, color: '#64748B' }} /> : <ArrowDropDownIcon sx={{ fontSize: 20, color: '#64748B' }} />)}
                  </>
                )}
              </ListItemButton>
            )

            if (isCollapsed && !isMobile) {
              return (
                <Tooltip key={item.title} title={item.title} placement="right">
                  <Box>{parentButtonContent}</Box>
                </Tooltip>
              )
            }

            return (
              <Box key={item.title}>
                {parentButtonContent}
                {hasChildren && (
                  <Collapse in={usersOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, mt: 0.25 }}>
                      {item.children?.map((subItem) => {
                        const isSubSelected = location.pathname === subItem.path
                        return (
                          <ListItemButton
                            key={subItem.path}
                            selected={isSubSelected}
                            onClick={() => handleSubItemClick(subItem.path)}
                            sx={{
                              minHeight: 38,
                              pl: 6.5,
                              pr: 2,
                              borderRadius: '8px',
                              color: isSubSelected ? '#1976D2' : '#64748B',
                              bgcolor: isSubSelected ? '#E5F0FD' : 'transparent',
                              transition: 'all 0.15s ease-in-out',
                              '&:hover': {
                                bgcolor: '#F3F7FC',
                                color: '#1976D2',
                              },
                              '&.Mui-selected': {
                                bgcolor: '#E5F0FD',
                                color: '#1976D2',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#E5F0FD' },
                              },
                            }}
                          >
                            <ListItemText
                              primary={subItem.title}
                              slotProps={{
                                primary: {
                                  sx: {
                                    fontSize: '0.83rem',
                                    fontWeight: isSubSelected ? 600 : 400,
                                  },
                                },
                              }}
                            />
                          </ListItemButton>
                        )
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            )
          })}
        </List>
      </Box>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH, bgcolor: '#FFFFFF', borderRight: '1px solid #E7ECF2' } }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
        '& .MuiDrawer-paper': {
          width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          bgcolor: '#FFFFFF',
          borderRight: '1px solid #E7ECF2',
          transition: (theme) => theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export { SIDEBAR_WIDTH, COLLAPSED_WIDTH }