import React from 'react'
import { Card, Box, Typography } from '@mui/material'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'

interface ItineraryTravelTipsProps {
  tips: string[]
}

export const ItineraryTravelTips: React.FC<ItineraryTravelTipsProps> = ({ tips }) => {
  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px -2px rgba(15, 23, 42, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2 }}>
        <Box
          sx={{
            p: 0.75,
            borderRadius: '8px',
            bgcolor: '#EFF6FF',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LightbulbOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            color: '#0F172A',
            fontSize: '1rem',
          }}
        >
          Lưu ý cho chuyến đi
        </Typography>
      </Box>

      <Box
        component="ul"
        sx={{
          m: 0,
          pl: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
        }}
      >
        {tips.map((tip, idx) => (
          <Box
            component="li"
            key={idx}
            sx={{
              color: '#334155',
              fontSize: '0.86rem',
              lineHeight: 1.55,
              '&::marker': {
                color: 'primary.main',
              },
            }}
          >
            {tip}
          </Box>
        ))}
      </Box>
    </Card>
  )
}
