import React from 'react'
import {
  Card,
  Box,
  Typography,
  Button,
  Chip,
  Tooltip,
} from '@mui/material'
import AltRouteOutlinedIcon from '@mui/icons-material/AltRouteOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined'
import type { IItineraryDay } from '@/types/pages/itineraries/itinerary'
import { ITINERARY_CATEGORY_COLORS } from '@/constants/itinerary'

interface ItineraryDayRouteProps {
  day: IItineraryDay
}

export const ItineraryDayRoute: React.FC<ItineraryDayRouteProps> = ({ day }) => {
  const activities = day.activities || []

  // Sắp xếp các hoạt động theo mốc thời gian
  const sortedActivities = [...activities].sort((a, b) =>
    (a.time || '').localeCompare(b.time || '')
  )

  // Lọc các trạm có thông tin địa điểm hoặc link để vẽ lộ trình Google Maps
  const stopsWithLocation = sortedActivities.filter(
    (act) => Boolean(act.location && act.location.trim())
  )

  // Tạo URL Google Maps Directions nối các điểm
  let googleMapsRouteUrl: string | null = null
  if (stopsWithLocation.length >= 2) {
    const origin = encodeURIComponent(stopsWithLocation[0].location.trim())
    const destination = encodeURIComponent(
      stopsWithLocation[stopsWithLocation.length - 1].location.trim()
    )
    const waypoints = stopsWithLocation
      .slice(1, -1)
      .map((s) => encodeURIComponent(s.location.trim()))
      .join('|')

    googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${
      waypoints ? `&waypoints=${waypoints}` : ''
    }`
  } else if (stopsWithLocation.length === 1) {
    googleMapsRouteUrl =
      stopsWithLocation[0].mapUrl ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        stopsWithLocation[0].location.trim()
      )}`
  }

  // Thống kê phân bổ danh mục trong ngày
  const categoryCounts = sortedActivities.reduce((acc, act) => {
    if (act.type) {
      acc[act.type] = (acc[act.type] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const categories = Object.entries(categoryCounts)

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 2.75 },
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px -2px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Header Widget */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AltRouteOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 700,
                color: '#0F172A',
                fontSize: '0.95rem',
                lineHeight: 1.3,
              }}
            >
              Cung đường Ngày {day.dayNumber}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 500 }}
            >
              Lộ trình trạm dừng liên tiếp
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`${sortedActivities.length} trạm`}
          size="small"
          sx={{
            height: 24,
            fontSize: '0.72rem',
            fontWeight: 700,
            bgcolor: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE',
          }}
        />
      </Box>

      {/* Danh sách các trạm dừng tuần tự */}
      {sortedActivities.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ color: '#64748B', fontStyle: 'italic', fontSize: '0.84rem', py: 1 }}
        >
          Chưa có hoạt động nào trong ngày này.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            bgcolor: '#F8FAFC',
            p: 1.5,
            borderRadius: '10px',
            border: '1px solid #F1F5F9',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              mb: 0.5,
            }}
          >
            Thứ tự các trạm dừng:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {sortedActivities.map((act, idx) => {
              const hasMapUrl = Boolean(act.mapUrl && act.mapUrl.trim())
              const hasLocationText = Boolean(act.location && act.location.trim())
              const catColors = (act.type && ITINERARY_CATEGORY_COLORS[act.type]) || {
                bg: '#F1F5F9',
                text: '#475569',
                border: '#E2E8F0',
              }

              return (
                <Box
                  key={act.id || idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    fontSize: '0.8rem',
                  }}
                >
                  {/* Left: Number + Location/Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </Box>

                    {/* Tên trạm dừng */}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#1E293B',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block',
                        }}
                        title={act.location || act.title}
                      >
                        {act.location || act.title}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Right: Time, Category, and Map Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'monospace, inherit',
                        fontSize: '0.75rem',
                        color: '#64748B',
                        fontWeight: 500,
                      }}
                    >
                      {act.time}
                    </Typography>

                    {act.type && (
                      <Box
                        component="span"
                        sx={{
                          px: 0.75,
                          py: 0.15,
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          bgcolor: catColors.bg,
                          color: catColors.text,
                          border: `1px solid ${catColors.border}`,
                          lineHeight: 1.2,
                        }}
                      >
                        {act.type}
                      </Box>
                    )}

                    {/* Xử lý hiển thị trạng thái Google Map của trạm */}
                    {hasMapUrl ? (
                      <Tooltip title="Mở vị trí trạm này trên Google Maps" arrow placement="top">
                        <Box
                          component="a"
                          href={act.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#2563EB',
                            textDecoration: 'none',
                            p: 0.25,
                            borderRadius: '4px',
                            '&:hover': {
                              bgcolor: '#EFF6FF',
                              color: '#1D4ED8',
                            },
                          }}
                        >
                          <LaunchOutlinedIcon sx={{ fontSize: 13 }} />
                        </Box>
                      </Tooltip>
                    ) : hasLocationText ? (
                      <Tooltip title="Đã có tên địa điểm, có thể nối đường trên bản đồ" arrow placement="top">
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', color: '#94A3B8' }}>
                          <PlaceOutlinedIcon sx={{ fontSize: 14 }} />
                        </Box>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Chưa có thông tin vị trí cho trạm này" arrow placement="top">
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            color: '#CBD5E1',
                          }}
                        >
                          <LocationOffOutlinedIcon sx={{ fontSize: 13 }} />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Box>
      )}

      {/* Phân bổ các loại hình hoạt động */}
      {categories.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75, pt: 0.25 }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 500, mr: 0.5 }}>
            Phân bổ:
          </Typography>
          {categories.map(([label, count]) => {
            const catColors = ITINERARY_CATEGORY_COLORS[label as keyof typeof ITINERARY_CATEGORY_COLORS] || {
              bg: '#F1F5F9',
              text: '#475569',
              border: '#E2E8F0',
            }
            return (
              <Chip
                key={label}
                label={`${count} ${label}`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: catColors.bg,
                  color: catColors.text,
                  border: `1px solid ${catColors.border}`,
                }}
              />
            )
          })}
        </Box>
      )}

      {/* Nút mở toàn bộ cung đường trên Google Maps */}
      <Box sx={{ pt: 0.5 }}>
        {googleMapsRouteUrl ? (
          <Button
            component="a"
            href={googleMapsRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            fullWidth
            endIcon={<LaunchOutlinedIcon sx={{ fontSize: '1rem !important' }} />}
            startIcon={<AltRouteOutlinedIcon sx={{ fontSize: '1.1rem !important' }} />}
            sx={{
              py: 1.1,
              px: 2,
              borderRadius: '10px',
              bgcolor: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.84rem',
              textTransform: 'none',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
              '&:hover': {
                bgcolor: '#1D4ED8',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              },
            }}
          >
            Mở toàn bộ cung đường trên Google Maps
          </Button>
        ) : (
          <Button
            disabled
            variant="outlined"
            fullWidth
            startIcon={<LocationOffOutlinedIcon sx={{ fontSize: '1.1rem !important' }} />}
            sx={{
              py: 1.1,
              px: 2,
              borderRadius: '10px',
              fontSize: '0.82rem',
              textTransform: 'none',
              color: '#94A3B8',
              borderColor: '#E2E8F0',
            }}
          >
            Chưa có vị trí để mở cung đường
          </Button>
        )}

        {/* Thông tin hỗ trợ về số trạm đã kết nối */}
        {sortedActivities.length > 0 && (
          <Typography
            sx={{
              display: 'block',
              textAlign: 'center',
              fontSize: '0.7rem',
              color: stopsWithLocation.length === sortedActivities.length ? '#64748B' : '#D97706',
              mt: 1,
            }}
          >
            {stopsWithLocation.length === sortedActivities.length
              ? `✓ Đã kết nối đầy đủ ${stopsWithLocation.length} trạm vào lộ trình`
              : `⚠️ Đã kết nối ${stopsWithLocation.length}/${sortedActivities.length} trạm (trạm chưa có vị trí được tự động bỏ qua)`}
          </Typography>
        )}
      </Box>
    </Card>
  )
}
