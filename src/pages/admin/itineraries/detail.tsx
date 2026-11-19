import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useNavigate, useParams } from 'react-router-dom'
import { HeaderTitle } from '@/components/ui/header/headerTitle'
import { useItineraryDetail } from '@/hooks/itineraries/useItineraryDetail'
import type { IItineraryDay } from '@/types/pages/itineraries/itinerary'
import { ItineraryHero } from '@/components/pages/itineraries/preview/itineraryHero'
import { ItineraryInfoPanel } from '@/components/pages/itineraries/preview/itineraryInfoPanel'
import {
  ItineraryDayTabs,
  type ItineraryTabKey,
} from '@/components/pages/itineraries/preview/itineraryDayTabs'
import { ItineraryOverview } from '@/components/pages/itineraries/preview/itineraryOverview'
import { ItineraryTimeline } from '@/components/pages/itineraries/preview/itineraryTimeline'
import { ItineraryImageGallery } from '@/components/pages/itineraries/preview/itineraryImageGallery'
import { ItineraryTravelTips } from '@/components/pages/itineraries/preview/itineraryTravelTips'
import { ItineraryDayRoute } from '@/components/pages/itineraries/preview/itineraryDayRoute'
import { ItineraryNotFound } from '@/components/pages/itineraries/preview/itineraryNotFound'

export const ItineraryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: itinerary, isLoading } = useItineraryDetail(id)

  const [activeTab, setActiveTab] = useState<ItineraryTabKey>('overview')
  const contentRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const prevTabRef = useRef<ItineraryTabKey>(activeTab)
  const isFirstRender = useRef(true)

  // Scroll to the beginning of the selected itinerary content when switching tabs
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (prevTabRef.current === activeTab) {
      return
    }
    prevTabRef.current = activeTab

    if (!contentRef.current) return

    const headerEl = document.querySelector('header.MuiAppBar-root')
    const headerHeight = headerEl
      ? headerEl.getBoundingClientRect().height
      : window.innerWidth < 600
        ? 50
        : 56

    const tabsHeight = tabsRef.current
      ? tabsRef.current.offsetHeight
      : window.innerWidth < 600
        ? 52
        : 58

    const contentRect = contentRef.current.getBoundingClientRect()
    const contentDocTop = window.scrollY + contentRect.top

    // Position the user at the beginning of the newly selected content, right below sticky tabs
    const targetY = Math.round(contentDocTop - headerHeight - tabsHeight)

    const isMobile = window.innerWidth < 600
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: isMobile || prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [activeTab])

  // Calculate total activities dynamically from record data
  const totalActivities = itinerary
    ? (itinerary.days || []).reduce(
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
    return (itinerary.days || []).find((d: IItineraryDay) => d.dayNumber === dayNumber) || null
  })()

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 360,
        }}
      >
        <CircularProgress size={36} color="primary" />
      </Box>
    )
  }

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

  const durationLabel =
    itinerary.duration ||
    `${itinerary.durationDays || (itinerary.days?.length ?? 1)} ngày ${
      itinerary.durationNights ??
      Math.max(0, (itinerary.durationDays || (itinerary.days?.length ?? 1)) - 1)
    } đêm`

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, sm: 2.5, md: 3 },
        width: '100%',
        pb: 6,
      }}
    >
      <HeaderTitle>{`Lịch trình: ${itinerary.title}`}</HeaderTitle>

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
            variant="contained"
            color="primary"
            startIcon={<EditOutlinedIcon />}
            onClick={handleEditClick}
            sx={{
              flex: { xs: 1, sm: 'none' },
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              px: 2.5,
              minHeight: 40,
              boxShadow: 'none',
            }}
          >
            Chỉnh sửa
          </Button>
        </Box>
      </Box>

      {/* Top Banner & Info Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px', xl: '1fr 360px' },
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
      <Box
        ref={tabsRef}
        sx={{
          position: 'sticky',
          top: { xs: 50, sm: 56 },
          zIndex: (theme) => theme.zIndex.appBar - 1,
          bgcolor: 'background.default',
          mx: { xs: -1.25, sm: -1.75, md: -2 },
          px: { xs: 1.25, sm: 1.75, md: 2 },
          pt: { xs: 0.75, sm: 1 },
          pb: { xs: 0.75, sm: 1.25 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03)',
        }}
      >
        <ItineraryDayTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          dayCount={itinerary.days?.length || 0}
        />
      </Box>

      {/* Main Content & Supporting Sidebar */}
      <Box
        ref={contentRef}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 340px', xl: '1fr 360px' },
          gap: 3,
          alignItems: 'start',
          mt: { xs: 0.5, sm: 0 },
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

        {/* Right Column: Contextual based on Active Tab - Sticky below tabs on Desktop */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
            position: { xs: 'static', lg: 'sticky' },
            top: { xs: 'auto', lg: 132 },
            alignSelf: 'start',
            zIndex: 10,
            maxHeight: { xs: 'none', lg: 'calc(100vh - 148px)' },
            overflowY: { xs: 'visible', lg: 'auto' },
            pr: { lg: 0.5 },
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E1 transparent',
            '&::-webkit-scrollbar': {
              width: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#CBD5E1',
              borderRadius: 2,
            },
          }}
        >
          {activeTab === 'overview' ? (
            <>
              <ItineraryImageGallery images={itinerary.featuredImages || []} />
              <ItineraryTravelTips tips={itinerary.travelTips || []} />
            </>
          ) : activeDay ? (
            <ItineraryDayRoute day={activeDay} />
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

export default ItineraryDetailPage
