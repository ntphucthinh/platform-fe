import React from 'react'
import { Card, Box, Typography, Chip, Divider } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined'
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'

interface ItineraryInfoPanelProps {
  duration: string
  destination: string
  suitableFor: string
  totalActivities: number
  themes: string[]
}

export const ItineraryInfoPanel: React.FC<ItineraryInfoPanelProps> = ({
  duration,
  destination,
  suitableFor,
  totalActivities,
  themes,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px -2px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        {/* Duration */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              bgcolor: '#EFF6FF',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarTodayOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block' }}>
              Thời lượng
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>
              {duration}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#F1F5F9' }} />

        {/* Destination */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              bgcolor: '#EFF6FF',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block' }}>
              Địa điểm
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>
              {destination}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#F1F5F9' }} />

        {/* Suitable For */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              bgcolor: '#EFF6FF',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PeopleOutlineOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block' }}>
              Phù hợp với
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>
              {suitableFor}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#F1F5F9' }} />

        {/* Total Activities */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              bgcolor: '#EFF6FF',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <StarOutlineRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block' }}>
              Số hoạt động
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem' }}>
              {totalActivities} hoạt động
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#F1F5F9' }} />

        {/* Themes */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.75 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              bgcolor: '#EFF6FF',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocalOfferOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block', mb: 0.75 }}>
              Chủ đề
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {themes.map((theme) => (
                <Chip
                  key={theme}
                  label={theme}
                  size="small"
                  sx={{
                    bgcolor: '#F1F5F9',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
