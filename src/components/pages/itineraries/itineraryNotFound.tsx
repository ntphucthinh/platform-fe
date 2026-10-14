import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import { useNavigate } from 'react-router-dom'
import { HeaderTitle } from '@/components/ui/header/headerTitle'

interface ItineraryNotFoundProps {
  message?: string
}

export const ItineraryNotFound: React.FC<ItineraryNotFoundProps> = ({
  message = 'Lịch trình du lịch không tồn tại hoặc đã bị xóa.',
}) => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <HeaderTitle>Không tìm thấy lịch trình</HeaderTitle>

      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: '#F1F5F9',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
        }}
      >
        <MapOutlinedIcon sx={{ fontSize: 36 }} />
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#0F172A',
          mb: 1,
        }}
      >
        Không tìm thấy lịch trình
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#64748B',
          mb: 3.5,
          maxWidth: 440,
          lineHeight: 1.6,
        }}
      >
        {message}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/itineraries')}
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          px: 3,
          py: 1,
          boxShadow: 'none',
        }}
      >
        Quay lại danh sách lịch trình
      </Button>
    </Box>
  )
}
