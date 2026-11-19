import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { ItineraryForm } from '@/components/pages/itineraries/itineraryForm'
import { ItineraryNotFound } from '@/components/pages/itineraries/preview/itineraryNotFound'
import { useItineraryDetail } from '@/hooks/itineraries/useItineraryDetail'
import type { ICreateItineraryInput } from '@/types/pages/itineraries/itinerary'

export const ItineraryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: itinerary, isLoading, updateItinerary } = useItineraryDetail(id)

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 320,
        }}
      >
        <CircularProgress size={36} color="primary" />
      </Box>
    )
  }

  if (!itinerary || !id) {
    return (
      <ItineraryNotFound
        message={`Không tìm thấy lịch trình du lịch cho mã "${id || ''}" để chỉnh sửa.`}
      />
    )
  }

  const handleSubmit = (formData: ICreateItineraryInput) => {
    updateItinerary(itinerary.id, formData)
    navigate(`/admin/itineraries/${itinerary.id}/detail`)
  }

  const handleCancel = () => {
    navigate(`/admin/itineraries/${itinerary.id}/detail`)
  }

  return (
    <ItineraryForm
      key={itinerary.id}
      initialData={itinerary}
      isEdit
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default ItineraryEditPage
