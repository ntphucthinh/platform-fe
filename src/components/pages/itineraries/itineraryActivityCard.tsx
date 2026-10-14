import React, { useState } from 'react'
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Avatar,
} from '@mui/material'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import type { IItineraryActivity } from '@/types/pages/itineraries/itinerary'
import { ITINERARY_CATEGORY_COLORS } from '@/constants/itineraryConstant'
import { DEFAULT_NO_IMAGE } from '@/constants/homestayConstant'

interface ItineraryActivityCardProps {
  activity: IItineraryActivity
  isLast?: boolean
}

export const ItineraryActivityCard: React.FC<ItineraryActivityCardProps> = ({
  activity,
  isLast = false,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [imgSrc, setImgSrc] = useState(activity.image)

  const colors = ITINERARY_CATEGORY_COLORS[activity.type] || {
    bg: '#F1F5F9',
    text: '#475569',
    border: '#E2E8F0',
  }

  return (
    <Box sx={{ display: 'flex', position: 'relative', width: '100%' }}>
      {/* Time column on the left */}
      <Box
        sx={{
          width: { xs: 54, sm: 64 },
          flexShrink: 0,
          pt: 0.25,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: '#1E293B',
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
          }}
        >
          {activity.time}
        </Typography>
      </Box>

      {/* Timeline track and dot */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 24,
          flexShrink: 0,
          mr: { xs: 1.5, sm: 2 },
          position: 'relative',
        }}
      >
        {/* Dot */}
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            border: '2px solid #FFFFFF',
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
            mt: 0.75,
            zIndex: 1,
            flexShrink: 0,
          }}
        />

        {/* Vertical connector line */}
        {!isLast && (
          <Box
            sx={{
              position: 'absolute',
              top: 18,
              bottom: -16,
              width: '2px',
              bgcolor: '#CBD5E1',
              zIndex: 0,
            }}
          />
        )}
      </Box>

      {/* Activity Card */}
      <Box
        sx={{
          flex: 1,
          mb: 3,
          p: { xs: 1.75, sm: 2 },
          borderRadius: '12px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            borderColor: '#CBD5E1',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {/* Thumbnail */}
          <Avatar
            variant="rounded"
            src={imgSrc}
            alt={activity.title}
            slotProps={{
              img: {
                onError: () => setImgSrc(DEFAULT_NO_IMAGE),
              },
            }}
            sx={{
              width: { xs: '100%', sm: 100 },
              height: { xs: 140, sm: 76 },
              borderRadius: '8px',
              bgcolor: '#F1F5F9',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />

          {/* Activity Information */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                }}
              >
                {activity.title}
              </Typography>

              <Chip
                label={activity.type}
                size="small"
                sx={{
                  bgcolor: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  height: 22,
                  borderRadius: '6px',
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: '#64748B',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                mb: 1,
              }}
            >
              {activity.description}
            </Typography>

            {/* Metadata tags */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: { xs: 1.5, sm: 2.5 },
                color: '#475569',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
                  {activity.duration}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 16, color: '#64748B' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
                  {activity.location}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Expand Details Arrow Button */}
          {activity.notes && (
            <IconButton
              size="small"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? 'Thu gọn chi tiết' : 'Xem thêm ghi chú'}
              sx={{
                alignSelf: { xs: 'flex-end', sm: 'center' },
                color: '#64748B',
                bgcolor: '#F8FAFC',
                '&:hover': { bgcolor: '#F1F5F9' },
                mt: { xs: -1, sm: 0 },
              }}
            >
              {expanded ? (
                <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
              ) : (
                <ChevronRightIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          )}
        </Box>

        {/* Collapsible Details / Notes */}
        {activity.notes && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box
              sx={{
                mt: 1.75,
                pt: 1.5,
                borderTop: '1px dashed #E2E8F0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
              }}
            >
              <InfoOutlinedIcon sx={{ fontSize: 16, color: 'primary.main', mt: 0.25 }} />
              <Typography variant="caption" sx={{ color: '#334155', fontStyle: 'italic', lineHeight: 1.5 }}>
                <strong>Gợi ý:</strong> {activity.notes}
              </Typography>
            </Box>
          </Collapse>
        )}
      </Box>
    </Box>
  )
}
