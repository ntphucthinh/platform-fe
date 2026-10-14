import React, { useState, useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useNavigate } from 'react-router-dom'
import { HeaderTitle } from '@/components/ui/header/headerTitle'
import { MOCK_DALAT_ITINERARY } from '@/constants/itineraryConstant'
import { ItineraryHero } from '@/components/pages/itineraries/itineraryHero'
import { ItineraryInfoPanel } from '@/components/pages/itineraries/itineraryInfoPanel'
import {
  ItineraryDayTabs,
  type ItineraryTabKey,
} from '@/components/pages/itineraries/itineraryDayTabs'
import { ItineraryOverview } from '@/components/pages/itineraries/itineraryOverview'
import { ItineraryTimeline } from '@/components/pages/itineraries/itineraryTimeline'
import { ItineraryImageGallery } from '@/components/pages/itineraries/itineraryImageGallery'
import { ItineraryTravelTips } from '@/components/pages/itineraries/itineraryTravelTips'

export const ItineraryPreviewPage: React.FC = () => {
  const navigate = useNavigate()
  const itinerary = MOCK_DALAT_ITINERARY
  const [activeTab, setActiveTab] = useState<ItineraryTabKey>('overview')

  // Toast notification state
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'info' | 'warning' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'info',
  })

  // Calculate total activities dynamically from mock data
  const totalActivities = useMemo(() => {
    return itinerary.days.reduce((acc, day) => acc + day.activities.length, 0)
  }, [itinerary.days])

  // Get active day object if a day tab is selected
  const activeDay = useMemo(() => {
    if (activeTab === 'overview') return null
    const match = activeTab.match(/day-(\d+)/)
    if (!match) return null
    const dayNumber = parseInt(match[1], 10)
    return itinerary.days.find((d) => d.dayNumber === dayNumber) || null
  }, [activeTab, itinerary.days])

  const handleBack = () => {
    navigate('/admin/itineraries')
  }

  const handleEditClick = () => {
    setSnackbar({
      open: true,
      message: 'Tính năng chỉnh sửa lịch trình đang được hoàn thiện (Bản demo giao diện).',
      severity: 'info',
    })
  }

  const handleSaveDraft = () => {
    setSnackbar({
      open: true,
      message: 'Bản xem trước: Đã lưu bản nháp mô phỏng (UI demo - không lưu vào CSDL).',
      severity: 'success',
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 1400,
        mx: 'auto',
        width: '100%',
        pb: 6,
      }}
    >
      <HeaderTitle>Xem trước lịch trình</HeaderTitle>

      {/* 5.1 Admin Preview Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          pb: 1,
        }}
      >
        {/* Left Toolbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Quay lại">
            <IconButton
              onClick={handleBack}
              aria-label="Quay lại"
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#334155',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' },
              }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: { xs: '1.25rem', sm: '1.45rem' },
                  letterSpacing: '-0.01em',
                }}
              >
                Xem trước lịch trình
              </Typography>

              <Chip
                icon={
                  <FiberManualRecordIcon
                    sx={{ fontSize: '10px !important', color: '#D97706 !important' }}
                  />
                }
                label="Bản xem trước · Chưa xuất bản"
                size="small"
                sx={{
                  bgcolor: '#FEF3C7',
                  color: '#92400E',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  borderRadius: '6px',
                  border: '1px solid #FDE68A',
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: '#64748B', fontSize: '0.86rem', mt: 0.25 }}
            >
              Kiểm tra nội dung và thứ tự hoạt động trước khi lưu lịch trình.
            </Typography>
          </Box>
        </Box>

        {/* Right Toolbar Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, alignSelf: { xs: 'stretch', sm: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={handleEditClick}
            sx={{
              flex: { xs: 1, sm: 'none' },
              borderColor: '#CBD5E1',
              color: '#334155',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              px: 2,
              '&:hover': {
                borderColor: '#94A3B8',
                bgcolor: '#F8FAFC',
              },
            }}
          >
            Chỉnh sửa
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<BookmarkBorderIcon />}
            onClick={handleSaveDraft}
            sx={{
              flex: { xs: 1, sm: 'none' },
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              px: 2.5,
              boxShadow: 'none',
            }}
          >
            Lưu bản nháp
          </Button>
        </Box>
      </Box>

      {/* Top Banner & Info Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <ItineraryHero
          coverImage={itinerary.coverImage}
          destination={itinerary.destination}
          title={itinerary.title}
          duration={itinerary.duration}
          description={itinerary.description}
        />

        <ItineraryInfoPanel
          duration={itinerary.duration}
          destination={itinerary.destination}
          suitableFor={itinerary.suitableFor}
          totalActivities={totalActivities}
          themes={itinerary.themes}
        />
      </Box>

      {/* 5.4 Day Navigation Tabs */}
      <Box sx={{ pt: 1 }}>
        <ItineraryDayTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          dayCount={itinerary.days.length}
        />
      </Box>

      {/* Main Content & Supporting Sidebar */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' },
          gap: 3.5,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Overview or Timeline */}
        <Box sx={{ minWidth: 0 }}>
          {activeTab === 'overview' && (
            <ItineraryOverview
              itinerary={itinerary}
              onSelectDay={(tabKey) => setActiveTab(tabKey)}
            />
          )}

          {activeDay && <ItineraryTimeline day={activeDay} />}
        </Box>

        {/* Right Column: Featured Images & Travel Tips */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ItineraryImageGallery images={itinerary.featuredImages} />
          <ItineraryTravelTips tips={itinerary.travelTips} />
        </Box>
      </Box>

      {/* Snackbar feedback for actions */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            borderRadius: '10px',
            fontWeight: 500,
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ItineraryPreviewPage
