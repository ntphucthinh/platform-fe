import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ItineraryForm } from '@/components/pages/itineraries/itineraryForm'
import { useItineraryDetail } from '@/hooks/itineraries/useItineraryDetail'
import type { ICreateItineraryInput } from '@/types/pages/itineraries/itinerary'

export const ItineraryCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const { createItinerary } = useItineraryDetail()

  const handleSubmit = (formData: ICreateItineraryInput) => {
    const created = createItinerary(formData)
    navigate(`/admin/itineraries/${created.id}/detail`)
  }

  const handleCancel = () => {
    navigate('/admin/itineraries')
  }

  return <ItineraryForm onSubmit={handleSubmit} onCancel={handleCancel} />
}

export default ItineraryCreatePage
