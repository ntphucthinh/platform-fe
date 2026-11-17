import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import type { IItineraryActivity } from '@/types/pages/itineraries/itinerary'
import { ITINERARY_CATEGORY_COLORS } from '@/constants/itinerary'
import { DEFAULT_NO_IMAGE } from '@/constants/homestay'

interface ItineraryActivityCardProps {
  activity: IItineraryActivity
  isLast?: boolean
}

export const ItineraryActivityCard: React.FC<ItineraryActivityCardProps> = ({
  activity,
}) => {
  const colors = (activity.type && ITINERARY_CATEGORY_COLORS[activity.type]) || {
    bg: '#F1F5F9',
    text: '#475569',
    border: '#E2E8F0',
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        pl: { xs: 3.25, sm: 3.75 },
      }}
    >
      {/* Concentric Node Circle: perfectly centered on the 8px timeline line axis */}
      <Box
        sx={{
          position: 'absolute',
          left: 8,
          transform: 'translateX(-50%)',
          top: { xs: 13, sm: 15 },
          width: 14,
          height: 14,
          borderRadius: '50%',
          bgcolor: '#2563EB',
          border: '2px solid #FFFFFF',
          boxShadow: '0 0 0 2px #3B82F6',
          zIndex: 1,
          flexShrink: 0,
        }}
      />

      {/* Activity Card */}
      <Box
        sx={{
          p: { xs: 1.75, sm: 2 },
          borderRadius: '12px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: '#CBD5E1',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
          },
        }}
      >
          {/* Header Row: Time + Duration + Badge (Left), Location (Right) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              mb: 1,
            }}
          >
            {/* Left: Time, Duration, Category Badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: 'monospace, inherit',
                  fontWeight: 700,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  color: '#0F172A',
                }}
              >
                {activity.time}
              </Typography>

              {activity.duration && (
                <Typography
                  sx={{
                    color: '#64748B',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}
                >
                  ({activity.duration})
                </Typography>
              )}

              {activity.type && (
                <Box
                  component="span"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    bgcolor: colors.bg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    lineHeight: 1.3,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {activity.type}
                </Box>
              )}
            </Box>

            {/* Right: Location */}
            {activity.location &&
              (activity.mapUrl ? (
                <Tooltip
                  title="Mở địa điểm trên Google Maps (tab mới)"
                  arrow
                  placement="top"
                >
                  <Box
                    component="a"
                    href={activity.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: { xs: 1, sm: 1.25 },
                      py: 0.35,
                      borderRadius: '6px',
                      bgcolor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: '#1D4ED8',
                      textDecoration: 'none',
                      fontSize: { xs: '0.76rem', sm: '0.8rem' },
                      fontWeight: 600,
                      minHeight: 28,
                      transition: 'all 0.15s ease-in-out',
                      cursor: 'pointer',
                      maxWidth: '100%',
                      '&:hover': {
                        bgcolor: '#EFF6FF',
                        borderColor: '#BFDBFE',
                        color: '#1E40AF',
                        boxShadow: '0 1px 3px rgba(37, 99, 235, 0.08)',
                      },
                      '&:active': {
                        bgcolor: '#DBEAFE',
                        transform: 'scale(0.98)',
                      },
                    }}
                  >
                    <PlaceOutlinedIcon
                      sx={{ fontSize: 14, color: '#2563EB', flexShrink: 0 }}
                    />
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        color: 'inherit',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {activity.location}
                    </Typography>
                    <LaunchOutlinedIcon
                      sx={{
                        fontSize: 12,
                        color: '#3B82F6',
                        flexShrink: 0,
                        ml: 0.25,
                      }}
                    />
                  </Box>
                </Tooltip>
              ) : (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: '#64748B',
                    fontSize: { xs: '0.76rem', sm: '0.8rem' },
                    fontWeight: 500,
                    py: 0.35,
                  }}
                >
                  <PlaceOutlinedIcon
                    sx={{ fontSize: 14, color: '#94A3B8', flexShrink: 0 }}
                  />
                  <Typography
                    component="span"
                    sx={{
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      color: 'inherit',
                    }}
                  >
                    {activity.location}
                  </Typography>
                </Box>
              ))}
          </Box>

          {/* Main Body: Image on the Left (vertically centered with content), Title + Notes on the Right */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              mt: 1,
            }}
          >
            {/* Image container on the left: Synchronized 4:3 landscape ratio matching Tab Tổng quan */}
            {activity.image && (
              <Box
                sx={{
                  width: { xs: 100, sm: 140 },
                  height: { xs: 75, sm: 105 },
                  aspectRatio: '4 / 3',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                  position: 'relative',
                  bgcolor: '#F1F5F9',
                }}
              >
                <Box
                  component="img"
                  src={activity.image}
                  alt={activity.title}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.onerror = null
                    target.src = DEFAULT_NO_IMAGE
                  }}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    transition: 'transform 0.25s ease',
                    '&:hover': {
                      transform: 'scale(1.04)',
                    },
                  }}
                />
              </Box>
            )}

            {/* Content: Title, Description, Notes (to the right of image, or full width if no image) */}
            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              {/* Activity Title */}
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  fontSize: { xs: '0.92rem', sm: '0.98rem' },
                  lineHeight: 1.4,
                  mb:
                    activity.notes ||
                    (activity.description && activity.description !== activity.title)
                      ? 0.75
                      : 0,
                }}
              >
                {activity.title}
              </Typography>

              {/* Optional Activity Description (if distinct from title) */}
              {activity.description && activity.description !== activity.title && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748B',
                    fontSize: '0.84rem',
                    lineHeight: 1.5,
                    mb: activity.notes ? 1 : 0,
                  }}
                >
                  {activity.description}
                </Typography>
              )}

              {/* Suggestion Callout Box */}
              {activity.notes && (
                <Box
                  sx={{
                    bgcolor: '#F8FAFC',
                    border: '1px solid #F1F5F9',
                    borderRadius: '8px',
                    p: { xs: 1.25, sm: 1.5 },
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: '0.9rem', lineHeight: 1.2, flexShrink: 0 }}
                  >
                    💡
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#334155',
                      fontSize: '0.82rem',
                      lineHeight: 1.5,
                    }}
                  >
                    <Box component="strong" sx={{ fontWeight: 700, color: '#0F172A' }}>
                      Gợi ý:
                    </Box>{' '}
                    {activity.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }


