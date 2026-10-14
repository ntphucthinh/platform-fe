import React from 'react'
import {
  Box,
  Typography,
  Card,
  Button,
  Avatar,
  Chip,
} from '@mui/material'
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined'
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import type { ITravelItinerary, IItineraryHighlight } from '@/types/pages/itineraries/itinerary'
import type { ItineraryTabKey } from '@/components/pages/itineraries/itineraryDayTabs'
import { DEFAULT_NO_IMAGE } from '@/constants/homestayConstant'

interface ItineraryOverviewProps {
  itinerary: ITravelItinerary
  onSelectDay: (tabKey: ItineraryTabKey) => void
}

const renderHighlightIcon = (type: IItineraryHighlight['icon']) => {
  const iconProps = { sx: { fontSize: 22, color: 'primary.main' } }
  switch (type) {
    case 'nature':
      return <ForestOutlinedIcon {...iconProps} />
    case 'coffee':
      return <LocalCafeOutlinedIcon {...iconProps} />
    case 'food':
      return <RestaurantOutlinedIcon {...iconProps} />
    case 'photo':
      return <CameraAltOutlinedIcon {...iconProps} />
    default:
      return <ForestOutlinedIcon {...iconProps} />
  }
}

export const ItineraryOverview: React.FC<ItineraryOverviewProps> = ({
  itinerary,
  onSelectDay,
}) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3.5, pt: 1 }}>
      {/* Intro section */}
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            color: '#0F172A',
            fontSize: { xs: '1.25rem', sm: '1.4rem' },
            letterSpacing: '-0.01em',
            mb: 1,
          }}
        >
          Tổng quan hành trình
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#475569',
            fontSize: '0.95rem',
            lineHeight: 1.6,
          }}
        >
          Hành trình 3 ngày 2 đêm tại Đà Lạt sẽ đưa bạn khám phá những địa điểm nổi tiếng,
          thưởng thức đặc sản địa phương và trải nghiệm nhịp sống chậm đặc trưng của
          thành phố ngàn hoa.
        </Typography>
      </Box>

      {/* 4 Feature highlights */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {itinerary.highlights.map((hl) => (
          <Card
            key={hl.id}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: '#F8FAF9',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                borderColor: '#CBD5E1',
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.25,
              }}
            >
              {renderHighlightIcon(hl.icon)}
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem', mb: 0.5 }}
            >
              {hl.title}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', lineHeight: 1.4 }}>
              {hl.subtitle}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* 3 Day-summary cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            color: '#1E293B',
            fontSize: '1.1rem',
          }}
        >
          Lịch trình tóm tắt theo từng ngày
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {itinerary.days.map((day) => {
            const dayKey = `day-${day.dayNumber}` as ItineraryTabKey
            return (
              <Card
                key={day.dayNumber}
                elevation={0}
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
                }}
                onClick={() => onSelectDay(dayKey)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2.5,
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  {/* Cover thumbnail */}
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
                      width: { xs: '100%', sm: 120 },
                      height: { xs: 140, sm: 84 },
                      borderRadius: '10px',
                      bgcolor: '#F1F5F9',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />

                  {/* Day Info */}
                  <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            bgcolor: '#DBEAFE',
                            color: '#1D4ED8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                          }}
                        >
                          {day.dayNumber}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: '#0F172A',
                            fontSize: { xs: '0.95rem', sm: '1.05rem' },
                          }}
                        >
                          {day.title}
                        </Typography>
                      </Box>

                      <Chip
                        icon={<AccessTimeOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                        label={`${day.activities.length} hoạt động`}
                        size="small"
                        sx={{
                          bgcolor: '#EFF6FF',
                          color: '#1D4ED8',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #BFDBFE',
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748B',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        mb: 1.5,
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
                      Xem chi tiết ngày {day.dayNumber}
                    </Button>
                  </Box>
                </Box>
              </Card>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
