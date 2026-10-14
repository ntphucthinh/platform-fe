import React, { useState, useEffect } from 'react'
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
import { useNavigate, useParams } from 'react-router-dom'
import { HeaderTitle } from '@/components/ui/header/headerTitle'
import { getItineraryById, subscribeItineraries } from '@/services/itineraryService'
import type { IItineraryDay } from '@/types/pages/itineraries/itinerary'
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
import { ItineraryNotFound } from '@/components/pages/itineraries/itineraryNotFound'

export const ItineraryPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [itinerary, setItinerary] = useState(() =>
    id ? getItineraryById(id) : undefined,
  )

  useEffect(() => {
    const unsub = subscribeItineraries(() => {
      setItinerary(id ? getItineraryById(id) : undefined)
    })
    return unsub
  }, [id])

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

  // Calculate total activities dynamically from record data
  const totalActivities = itinerary
    ? itinerary.days.reduce(
        (acc: number, day: IItineraryDay) =>
          acc + (day.activities?.length || 0),
        0,
      )
    : 0

  // Get active day object if a day tab is selected
  const activeDay = (() => {
    if (!itinerary || activeTab === 'overview') return null
    const match = activeTab.match(/day-(\d+)/)
    if (!match) return null
    const dayNumber = parseInt(match[1], 10)
    return itinerary.days.find((d: IItineraryDay) => d.dayNumber === dayNumber) || null
  })()

  if (!itinerary) {
    return (
      <ItineraryNotFound
        message={`Không tìm thấy lịch trình du lịch cho mã "${id || ''}".`}
      />
    )
  }

  const handleBack = () => {
    navigate('/admin/itineraries')
  }

  const handleEditClick = () => {
    navigate(`/admin/itineraries/${itinerary.id}/edit`)
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

  const durationLabel =
    itinerary.duration ||
    `${itinerary.durationDays || itinerary.days.length} ngày ${
      itinerary.durationNights ??
      Math.max(0, (itinerary.durationDays || itinerary.days.length) - 1)
    } đêm`

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
      <HeaderTitle>{`Xem trước: ${itinerary.title}`}</HeaderTitle>

      {/* Admin Preview Toolbar */}
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
          <Tooltip title="Quay lại danh sách">
            <IconButton
              onClick={handleBack}
              aria-label="Quay lại danh sách"
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
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
                {itinerary.title}
              </Typography>

              <Chip
                icon={
                  <FiberManualRecordIcon
                    sx={{
                      fontSize: '10px !important',
                      color:
                        itinerary.status === 'Đã hoàn thiện'
                          ? '#059669 !important'
                          : '#D97706 !important',
                    }}
                  />
                }
                label={
                  itinerary.status === 'Đã hoàn thiện'
                    ? 'Đã hoàn thiện'
                    : 'Bản xem trước · Chưa xuất bản'
                }
                size="small"
                sx={{
                  bgcolor:
                    itinerary.status === 'Đã hoàn thiện' ? '#ECFDF5' : '#FEF3C7',
                  color:
                    itinerary.status === 'Đã hoàn thiện' ? '#065F46' : '#92400E',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  borderRadius: '6px',
                  border:
                    itinerary.status === 'Đã hoàn thiện'
                      ? '1px solid #A7F3D0'
                      : '1px solid #FDE68A',
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: '#64748B', fontSize: '0.86rem', mt: 0.25 }}
            >
              Kiểm tra nội dung và thứ tự hoạt động của lịch trình du lịch.
            </Typography>
          </Box>
        </Box>

        {/* Right Toolbar Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
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
          duration={durationLabel}
          description={itinerary.description}
        />

        <ItineraryInfoPanel
          duration={durationLabel}
          destination={itinerary.destination}
          suitableFor={itinerary.suitableFor || 'Cặp đôi, nhóm bạn, gia đình'}
          totalActivities={totalActivities}
          themes={itinerary.themes}
        />
      </Box>

      {/* Day Navigation Tabs */}
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
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Overview or Timeline based on Active Tab */}
        <Box sx={{ minWidth: 0, width: '100%' }}>
          {activeTab === 'overview' ? (
            <ItineraryOverview
              itinerary={itinerary}
              onSelectDay={(tabKey) => setActiveTab(tabKey)}
            />
          ) : activeDay ? (
            <ItineraryTimeline day={activeDay} />
          ) : (
            <Typography sx={{ color: 'text.secondary', py: 4 }}>
              Không tìm thấy thông tin cho ngày đã chọn.
            </Typography>
          )}
        </Box>

        {/* Right Column: Featured Images & Travel Tips */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
          }}
        >
          <ItineraryImageGallery images={itinerary.featuredImages || []} />
          <ItineraryTravelTips tips={itinerary.travelTips || []} />
        </Box>
      </Box>

      {/* Global Snackbar Toast Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ItineraryPreviewPage
