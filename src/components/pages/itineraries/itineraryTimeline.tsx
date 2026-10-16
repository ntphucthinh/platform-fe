import React from 'react'
import { Box, Typography } from '@mui/material'
import type { IItineraryDay } from '@/types/pages/itineraries/itinerary'
import { ItineraryActivityCard } from '@/components/pages/itineraries/itineraryActivityCard'

interface ItineraryTimelineProps {
  day: IItineraryDay
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ day }) => {
  // Ensure activities are sorted chronologically by time
  const sortedActivities = [...day.activities].sort((a, b) =>
    a.time.localeCompare(b.time),
  )

  return (
    <Box
      sx={{
        width: '100%',
        pt: { xs: 0.5, sm: 1 },
        scrollMarginTop: { xs: '120px', sm: '140px' },
      }}
    >
      {/* Day Header Banner */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: { xs: 2, sm: 3 },
          pb: 1.5,
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
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
              fontSize: '1.1rem',
              flexShrink: 0,
            }}
          >
            {day.dayNumber}
          </Box>

          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                color: '#0F172A',
                fontSize: { xs: '1.05rem', sm: '1.15rem' },
                lineHeight: 1.3,
              }}
            >
              {day.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#64748B', fontSize: '0.85rem', mt: 0.25 }}
            >
              {day.subtitle}
            </Typography>
          </Box>
        </Box>

        {day.date && (
          <Typography
            variant="caption"
            sx={{
              color: '#64748B',
              fontWeight: 600,
              bgcolor: '#F8FAFC',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
            }}
          >
            {day.date}
          </Typography>
        )}
      </Box>

      {/* Timeline Activities List */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {sortedActivities.map((activity, index) => (
          <ItineraryActivityCard
            key={activity.id}
            activity={activity}
            isLast={index === sortedActivities.length - 1}
          />
        ))}
      </Box>
    </Box>
  )
}
