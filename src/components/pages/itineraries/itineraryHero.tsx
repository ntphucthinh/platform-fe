import React, { useState } from 'react'
import { Box, Typography, Chip } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { DEFAULT_NO_IMAGE } from '@/constants/homestayConstant'

interface ItineraryHeroProps {
  coverImage: string
  destination: string
  title: string
  duration: string
  description: string
}

export const ItineraryHero: React.FC<ItineraryHeroProps> = ({
  coverImage,
  destination,
  title,
  duration,
  description,
}) => {
  const [imgSrc, setImgSrc] = useState(coverImage)

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 260, sm: 300, md: 340 },
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.12)',
        bgcolor: '#1E293B',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: { xs: 2.5, sm: 3.5, md: 4 },
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={imgSrc}
        alt={title}
        onError={() => setImgSrc(DEFAULT_NO_IMAGE)}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Dark gradient overlay for optimal readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.85) 100%)',
          zIndex: 1,
        }}
      />

      {/* Top Location Badge */}
      <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center' }}>
        <Chip
          icon={<LocationOnIcon sx={{ fontSize: 18, color: '#1E293B !important' }} />}
          label={destination}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            color: '#0F172A',
            fontWeight: 700,
            fontSize: '0.82rem',
            px: 0.5,
            py: 0.25,
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        />
      </Box>

      {/* Bottom Content Area */}
      <Box sx={{ position: 'relative', zIndex: 2, mt: { xs: 4, sm: 6 } }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            color: '#FFFFFF',
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h6"
          component="div"
          sx={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            mt: 0.5,
            mb: 1.5,
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          {duration}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.88)',
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            lineHeight: 1.6,
            maxWidth: '620px',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}
