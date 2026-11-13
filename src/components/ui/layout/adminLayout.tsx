import { useState, ReactNode } from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Header } from '@/components/ui/header/header'
import { Sidebar } from '@/components/ui/layout/sidebar'

interface AdminLayoutProps {
  children?: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev)
    } else {
      setIsCollapsed((prev) => !prev)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: { xs: '100dvh', md: '100vh' }, width: '100%', bgcolor: 'background.default' }}>
      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        isCollapsed={isCollapsed}
      />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header onToggleSidebar={handleToggleSidebar} />
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            p: { xs: 1.5, sm: 2.5, md: 3 },
            pb: {
              xs: 'calc(16px + env(safe-area-inset-bottom, 0px))',
              sm: 2.5,
              md: 3,
            },
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  )
}