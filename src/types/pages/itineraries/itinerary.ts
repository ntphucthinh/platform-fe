export type ItineraryActivityType =
  | "Ăn uống"
  | "Tham quan"
  | "Thiên nhiên"
  | "Cà phê"
  | "Mua sắm"
  | "Nghỉ ngơi"
  | "Khác";

export interface IItineraryTheme {
  id: number;
  name: string;
}

export interface IItineraryActivity {
  id: number;
  time: string;
  startTime?: string;
  title: string;
  type?: ItineraryActivityType;
  category?: string;
  activityCategory?: string | null;
  duration: string;
  durationMinutes?: number;
  location: string;
  mapUrl?: string;
  googleMapsUrl?: string | null;
  description: string;
  image: string;
  imagePath?: string | null;
  notes?: string;
}

export interface IItineraryDay {
  id?: number;
  dayNumber: number;
  title: string;
  subtitle?: string;
  date?: string;
  summary?: string;
  description?: string;
  imagePath?: string | null;
  coverImage?: string;
  activities: IItineraryActivity[];
  dayTips?: string[];
  dayTipsText?: string;
}

export interface IItineraryGalleryImage {
  id: number;
  title?: string;
  url: string;
  imagePath?: string;
  caption?: string;
}

export interface IItineraryListItem {
  id: number;
  locationId?: number | null;
  locationName?: string | null;
  itineraryName?: string;
  title: string;
  destination?: string;
  duration: string;
  durationDays?: number;
  durationNights?: number;
  daysCount: number;
  activityCount: number;
  updatedAt?: string;
  description: string;
  coverImagePath?: string | null;
  coverImage: string;
  hasDetailPreview?: boolean;
}

export interface ITravelItinerary {
  id: number;
  locationId?: number | null;
  locationName?: string | null;
  itineraryName?: string;
  title: string;
  destination?: string;
  duration: string;
  durationDays?: number;
  durationNights?: number;
  description: string;
  coverImagePath?: string | null;
  coverImage: string;
  suitableFor?: string;
  themes: string[];
  themeObjects?: IItineraryTheme[];
  days: IItineraryDay[];
  featuredImages: IItineraryGalleryImage[];
  travelTips: string[];
  activityCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateItineraryInput {
  title: string;
  destination?: string;
  locationId?: number | null;
  durationDays?: number;
  durationNights?: number;
  duration?: string;
  description: string;
  coverImage: string;
  coverImagePath?: string | null;
  suitableFor?: string;
  themes: string[];
  days: IItineraryDay[];
  featuredImages?: IItineraryGalleryImage[];
  travelTips?: string[];
}

export interface IUpdateItineraryInput extends Partial<ICreateItineraryInput> {
  title?: string;
  destination?: string;
  locationId?: number | null;
  description?: string;
  coverImage?: string;
  coverImagePath?: string | null;
}

export interface IItineraryFormData {
  title: string;
  destination?: string | null;
  locationId?: number | null;
  durationDays: number;
  durationNights: number;
  suitableFor?: string;
  description?: string;
  coverImage: string;
}
