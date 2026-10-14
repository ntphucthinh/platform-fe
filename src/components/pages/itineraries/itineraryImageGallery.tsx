import React, { useState } from 'react'
import {
  Card,
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Button,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { IItineraryGalleryImage } from '@/types/pages/itineraries/itinerary'
import { DEFAULT_NO_IMAGE } from '@/constants/homestayConstant'

interface ItineraryImageGalleryProps {
  images: IItineraryGalleryImage[]
}

export const ItineraryImageGallery: React.FC<ItineraryImageGalleryProps> = ({
  images,
}) => {
  const [selectedImage, setSelectedImage] = useState<IItineraryGalleryImage | null>(null)

  return (
    <>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              color: '#0F172A',
              fontSize: '1rem',
            }}
          >
            Hình ảnh nổi bật
          </Typography>

          {images.length > 0 && (
            <Button
              size="small"
              onClick={() => setSelectedImage(images[0])}
              sx={{
                p: 0,
                fontSize: '0.8rem',
                color: '#64748B',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
              }}
            >
              Xem tất cả ({images.length})
            </Button>
          )}
        </Box>

        {/* 2x2 Image Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
          }}
        >
          {images.map((img) => (
            <Box
              key={img.id}
              onClick={() => setSelectedImage(img)}
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '75%', // 4:3 Aspect Ratio
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                bgcolor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                '&:hover img': {
                  transform: 'scale(1.06)',
                },
              }}
            >
              <Box
                component="img"
                src={img.url}
                alt={img.title}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = DEFAULT_NO_IMAGE
                }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Box>
          ))}
        </Box>
      </Card>

      {/* Lightbox Preview Modal */}
      {selectedImage && (
        <Dialog
          open={Boolean(selectedImage)}
          onClose={() => setSelectedImage(null)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: '16px',
                overflow: 'hidden',
                bgcolor: '#0F172A',
                color: '#FFFFFF',
              },
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, px: 1, color: '#FFFFFF' }}>
              {selectedImage.title}
            </Typography>
            <IconButton
              onClick={() => setSelectedImage(null)}
              aria-label="Đóng ảnh"
              sx={{ color: '#FFFFFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src={selectedImage.url}
              alt={selectedImage.title}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = DEFAULT_NO_IMAGE
              }}
              sx={{
                width: '100%',
                maxHeight: '65vh',
                objectFit: 'contain',
                bgcolor: '#000000',
              }}
            />
            {selectedImage.caption && (
              <Box sx={{ p: 2.5, width: '100%', bgcolor: '#1E293B' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {selectedImage.caption}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
