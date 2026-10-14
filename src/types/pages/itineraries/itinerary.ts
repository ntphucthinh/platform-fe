export type ItineraryActivityType =
  | 'Ăn uống'
  | 'Tham quan'
  | 'Thiên nhiên'
  | 'Cà phê'
  | 'Mua sắm'
  | 'Nghỉ ngơi'

export interface IItineraryActivity {
  id: string
  time: string
  title: string
  type: ItineraryActivityType
  duration: string
  location: string
  description: string
  image: string
  notes?: string
}

export interface IItineraryDay {
  dayNumber: number
  title: string
  subtitle: string
  date?: string
  summary?: string
  coverImage?: string
  activities: IItineraryActivity[]
}

export interface IItineraryHighlight {
  id: string
  title: string
  subtitle: string
  icon: 'nature' | 'coffee' | 'food' | 'photo'
}

export interface IItineraryGalleryImage {
  id: string
  title: string
  url: string
  caption?: string
}

export type ItineraryStatus = 'Bản nháp' | 'Đã hoàn thiện'

export interface IItineraryListItem {
  id: string
  title: string
  destination: string
  duration: string
  daysCount: number
  activityCount: number
  status: ItineraryStatus
  updatedAt: string
  description: string
  coverImage: string
  hasDetailPreview?: boolean
}

export interface ITravelItinerary {
  id: string
  title: string
  destination: string
  duration: string
  description: string
  coverImage: string
  status: string
  suitableFor: string
  themes: string[]
  highlights: IItineraryHighlight[]
  days: IItineraryDay[]
  featuredImages: IItineraryGalleryImage[]
  travelTips: string[]
}

