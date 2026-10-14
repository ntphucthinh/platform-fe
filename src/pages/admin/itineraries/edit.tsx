import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ItineraryForm } from '@/components/pages/itineraries/itineraryForm'
import { ItineraryNotFound } from '@/components/pages/itineraries/itineraryNotFound'
import {
  getItineraryById,
  updateItinerary,
} from '@/services/itineraryService'
import type { ICreateItineraryInput } from '@/types/pages/itineraries/itinerary'

export const ItineraryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const itinerary = id ? getItineraryById(id) : undefined

  if (!itinerary || !id) {
    return (
      <ItineraryNotFound
        message={`Không tìm thấy lịch trình du lịch cho mã "${id || ''}" để chỉnh sửa.`}
      />
    )
  }

  const handleSubmit = (formData: ICreateItineraryInput) => {
    updateItinerary(itinerary.id, formData)
    navigate(`/admin/itineraries/${itinerary.id}/preview`)
  }

  const handleCancel = () => {
    navigate(`/admin/itineraries/${itinerary.id}/preview`)
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
