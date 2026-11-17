import React from 'react'
import {
  Card,
  Box,
  Typography,
  Button,
} from '@mui/material'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import type { IItineraryDay } from '@/types/pages/itineraries/itinerary'

interface ItineraryDayRouteProps {
  day: IItineraryDay
}

export const ItineraryDayRoute: React.FC<ItineraryDayRouteProps> = ({ day }) => {
  const activities = day.activities || []

  // Sắp xếp các hoạt động theo mốc thời gian
  const sortedActivities = [...activities].sort((a, b) =>
    (a.time || '').localeCompare(b.time || '')
  )

  // Lọc các trạm có thông tin địa điểm hoặc link để tạo URL Google Maps
  const stopsWithLocation = sortedActivities.filter(
    (act) => Boolean(act.location && act.location.trim())
  )

  // Tạo URL Google Maps Directions nối liên hoàn các điểm
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

  // Danh sách lưu ý của ngày (nếu rỗng hoặc không có -> hiển thị Empty State)
  const dayTips = day.dayTips || []
  const hasTips = dayTips.length > 0

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
      {/* Header: Icon Clipboard + Tiêu đề "Lưu ý trong ngày" */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '9px',
            bgcolor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(37, 99, 235, 0.08)',
          }}
        >
          <AssignmentOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 700,
            color: '#0F172A',
            fontSize: '1.02rem',
            letterSpacing: '-0.01em',
          }}
        >
          Lưu ý trong ngày
        </Typography>
      </Box>

      {/* Body: Danh sách lưu ý HOẶC Empty State (Chưa có lưu ý trong ngày) */}
      {hasTips ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {dayTips.map((tip, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.1,
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#1E293B',
                  fontSize: '0.88rem',
                  lineHeight: 1.55,
                  fontWeight: 500,
                  pt: 0.25,
                }}
              >
                {tip}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        /* Empty State: Minh họa Clipboard checklist + Tiêu đề & Mô tả */
        <Box
          sx={{
            py: 2,
            px: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Illustration: Checklist Clipboard with soft cloud, leaf & sparkles */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
              position: 'relative',
              width: 96,
              height: 96,
            }}
          >
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              {/* Soft cloud behind */}
              <ellipse cx="62" cy="52" rx="22" ry="14" fill="#F0F7FF" />
              <ellipse cx="72" cy="50" rx="14" ry="12" fill="#E0F2FE" />

              {/* Green leaf on bottom left */}
              <path
                d="M34 54C34 54 24 55 21 50C18 45 23 39 27 40C31 41 34 47 34 54Z"
                fill="#D1FAE5"
              />
              <path
                d="M22 50C27 47 31 46 34 54"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Sparkles / rays on top right */}
              <path
                d="M74 24L78 20"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M78 28L84 28"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Clipboard body */}
              <rect
                x="32"
                y="22"
                width="38"
                height="48"
                rx="8"
                fill="#FFFFFF"
                stroke="#3B82F6"
                strokeWidth="2.5"
              />

              {/* Clip handle on top */}
              <path
                d="M44 23V19C44 17.3431 45.3431 16 47 16H51C52.6569 16 54 17.3431 54 19V23"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <rect
                x="42"
                y="19"
                width="18"
                height="7"
                rx="2"
                fill="#EFF6FF"
                stroke="#3B82F6"
                strokeWidth="2"
              />

              {/* Checkmark 1 + line */}
              <path
                d="M39 34L42 37L47 32"
                stroke="#60A5FA"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M51 34H62"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Checkmark 2 + line */}
              <path
                d="M39 44L42 47L47 42"
                stroke="#60A5FA"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M51 44H62"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Checkmark 3 + line */}
              <path
                d="M39 54L42 57L47 52"
                stroke="#60A5FA"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M51 54H60"
                stroke="#CBD5E1"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#0F172A',
              fontSize: '1rem',
              mb: 0.75,
              lineHeight: 1.3,
            }}
          >
            Chưa có lưu ý trong ngày
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: '0.85rem',
              lineHeight: 1.55,
              maxWidth: 300,
              mx: 'auto',
            }}
          >
            Hiện chưa có thông tin lưu ý đặc biệt cho ngày này. Bạn có thể tận hưởng hành trình theo lịch trình đã chuẩn bị.
          </Typography>
        </Box>
      )}

      {/* Nút "Mở toàn bộ cung đường trên Google Maps" nằm ngay phía dưới phần lưu ý */}
      <Box sx={{ pt: 1, borderTop: '1px solid #F1F5F9', mt: 0.5 }}>
        <Button
          component="a"
          href={googleMapsRouteUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          disabled={!googleMapsRouteUrl}
          startIcon={<MapOutlinedIcon sx={{ fontSize: 20 }} />}
          endIcon={<LaunchOutlinedIcon sx={{ fontSize: 16 }} />}
          sx={{
            width: '100%',
            py: 1.35,
            px: 2,
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.86rem',
            textTransform: 'none',
            bgcolor: '#1976D2',
            boxShadow: '0 2px 8px -1px rgba(25, 118, 210, 0.25)',
            '&:hover': {
              bgcolor: '#1565C0',
              boxShadow: '0 4px 14px rgba(25, 118, 210, 0.35)',
            },
            '&.Mui-disabled': {
              bgcolor: '#E2E8F0',
              color: '#94A3B8',
            },
          }}
        >
          Mở toàn bộ cung đường trên Google Maps
        </Button>

        {stopsWithLocation.length > 0 && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: '#64748B',
              fontSize: '0.74rem',
              mt: 1,
              fontWeight: 500,
            }}
          >
            ✓ Tự động kết nối {stopsWithLocation.length} trạm dừng vào Google Maps Directions
          </Typography>
        )}
      </Box>
    </Card>
  )
}
