import React from 'react'
import { Box, Typography, Card } from '@mui/material'
import type { IItineraryDay } from '@/types/pages/itineraries/itinerary'
import { ItineraryActivityCard } from '@/components/pages/itineraries/preview/itineraryActivityCard'
import { DEFAULT_NO_IMAGE } from '@/constants/homestay'

interface ItineraryTimelineProps {
  day: IItineraryDay
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ day }) => {
  // Ensure activities are sorted chronologically by time with safe fallbacks
  const sortedActivities = [...(day.activities || [])].sort((a, b) =>
    (a.time || '').localeCompare(b.time || ''),
  )

  const hasCoverImage = Boolean(
    day.coverImage &&
      day.coverImage.trim() !== '' &&
      day.coverImage !== DEFAULT_NO_IMAGE,
  )

  return (
    <Box
      sx={{
        width: '100%',
        pt: { xs: 0.5, sm: 1 },
        scrollMarginTop: { xs: '120px', sm: '140px' },
      }}
    >
      {/* Day Header Banner Card */}
      <Card
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: '12px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: { xs: 2.5, sm: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, minWidth: 0, flex: 1 }}>
          {/* Day number circle badge */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              bgcolor: '#DBEAFE',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            {day.dayNumber}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#0F172A',
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                lineHeight: 1.3,
              }}
            >
              {day.title}
            </Typography>
            {(day.subtitle || day.summary) && (
              <Typography
                variant="body2"
                sx={{ color: '#64748B', fontSize: '0.8rem', mt: 0.25 }}
              >
                {day.subtitle || day.summary}
              </Typography>
            )}
          </Box>
        </Box>

        {hasCoverImage && (
          <Box
            component="img"
            src={day.coverImage}
            alt={day.title}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.style.display = 'none'
            }}
            sx={{
              width: { xs: 70, sm: 100 },
              height: { xs: 50, sm: 65 },
              borderRadius: '8px',
              objectFit: 'cover',
              border: '1px solid #E2E8F0',
              flexShrink: 0,
            }}
          />
        )}
      </Card>

      {/* Timeline Activities List */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {sortedActivities.length === 0 ? (
          <Box
            sx={{
              py: 5,
              px: 3,
              textAlign: 'center',
              bgcolor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px dashed #CBD5E1',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
              Chưa có hoạt động nào được thêm cho ngày này.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              ml: { xs: 0.5, sm: 1 },
            }}
          >
            {/* The Continuous Vertical Timeline Line */}
            <Box
              sx={{
                position: 'absolute',
                left: 7,
                top: 0,
                bottom: 0,
                width: '2px',
                bgcolor: '#93C5FD',
                zIndex: 0,
              }}
            />

            {/* Activities List */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                width: '100%',
              }}
            >
              {sortedActivities.map((activity, index) => (
                <ItineraryActivityCard
                  key={activity.id}
                  activity={activity}
                  isLast={index === sortedActivities.length - 1}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

