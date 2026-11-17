import React from 'react'
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Chip,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { ITravelItinerary } from '@/types/pages/itineraries/itinerary'
import type { ItineraryTabKey } from '@/components/pages/itineraries/itineraryDayTabs'
import { DEFAULT_NO_IMAGE } from '@/constants/homestay'

interface ItineraryOverviewProps {
  itinerary: ITravelItinerary
  onSelectDay: (tabKey: ItineraryTabKey) => void
}

export const ItineraryOverview: React.FC<ItineraryOverviewProps> = ({
  itinerary,
  onSelectDay,
}) => {
  const totalActivities = (itinerary.days || []).reduce(
    (acc, day) => acc + (day.activities?.length || 0),
    0
  )

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2.5, sm: 3 },
        pt: { xs: 0.5, sm: 1 },
        scrollMarginTop: { xs: '120px', sm: '140px' },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          pb: 0.5,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              color: '#0F172A',
              fontSize: { xs: '1.2rem', sm: '1.35rem' },
              letterSpacing: '-0.01em',
            }}
          >
            Lịch trình tóm tắt theo từng ngày
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: '0.88rem',
              mt: 0.5,
            }}
          >
            Hành trình {itinerary.days?.length || 0} ngày khám phá trọn vẹn {itinerary.destination}
          </Typography>
        </Box>

        <Chip
          label={`${itinerary.days?.length || 0} Ngày • ${totalActivities} Hoạt động`}
          size="small"
          sx={{
            bgcolor: '#EFF6FF',
            color: '#1D4ED8',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '20px',
            border: '1px solid #BFDBFE',
            py: 0.5,
            px: 0.5,
          }}
        />
      </Box>

      {/* Day-summary cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(itinerary.days || []).map((day) => {
          const dayKey = `day-${day.dayNumber}` as ItineraryTabKey
          const displayTitle = day.title.replace(/^Ngày\s*\d+\s*[–-]\s*/i, '')

          return (
            <Card
              key={day.dayNumber}
              elevation={0}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectDay(dayKey)
                }
              }}
              onClick={() => onSelectDay(dayKey)}
              sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: '14px',
                bgcolor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.08)',
                  transform: 'translateY(-1px)',
                },
                '&:focus-visible': {
                  outline: '2px solid #1976D2',
                  outlineOffset: 2,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', sm: 'row' },
                  gap: { xs: 2, sm: 2.5 },
                  alignItems: 'center',
                }}
              >
                {/* Cover thumbnail: Synchronized 4:3 aspect ratio matching Tab Ngày */}
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 100, sm: 140 },
                    height: { xs: 75, sm: 105 },
                    aspectRatio: '4 / 3',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid #E2E8F0',
                    flexShrink: 0,
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                    bgcolor: '#F1F5F9',
                  }}
                >
                  <Avatar
                    variant="rounded"
                    src={day.coverImage}
                    alt={day.title}
                    slotProps={{
                      img: {
                        onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = DEFAULT_NO_IMAGE
                        },
                      },
                    }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: '#F1F5F9',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 5,
                      right: 5,
                      bgcolor: 'rgba(15, 23, 42, 0.8)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      px: 0.75,
                      py: 0.15,
                      borderRadius: '4px',
                      backdropFilter: 'blur(2px)',
                      lineHeight: 1.2,
                      pointerEvents: 'none',
                    }}
                  >
                    {day.activities?.length || 0} HĐ
                  </Box>
                </Box>

                {/* Day Info */}
                <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      mb: 0.75,
                    }}
                  >
                    <Chip
                      label={`Ngày ${day.dayNumber}`}
                      size="small"
                      sx={{
                        bgcolor: '#EFF6FF',
                        color: '#1D4ED8',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #BFDBFE',
                        height: 24,
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: '#0F172A',
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      }}
                    >
                      {displayTitle}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748B',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      mb: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {day.summary || day.subtitle}
                  </Typography>

                  <Button
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      p: 0,
                      fontWeight: 700,
                      color: 'primary.main',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: 'primary.dark',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Xem chi tiết ngày {day.dayNumber} &rarr;
                  </Button>
                </Box>
              </Box>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}
