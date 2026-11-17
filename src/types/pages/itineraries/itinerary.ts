export type ItineraryActivityType =
  | "Ăn uống"
  | "Tham quan"
  | "Thiên nhiên"
  | "Cà phê"
  | "Mua sắm"
  | "Nghỉ ngơi";

export interface IItineraryActivity {
  id: string;
  time: string;
  title: string;
  type?: ItineraryActivityType;
  duration: string;
  location: string;
  mapUrl?: string;
  description: string;
  image: string;
  notes?: string;
}

export interface IItineraryDay {
  id?: string;
  dayNumber: number;
  title: string;
  subtitle?: string;
  date?: string;
  summary?: string;
  description?: string;
  coverImage?: string;
  activities: IItineraryActivity[];
  dayTips?: string[];
  dayTipsText?: string;
}

export interface IItineraryGalleryImage {
  id: string;
  title: string;
  url: string;
  caption?: string;
}

export interface IItineraryListItem {
  id: string;
  locationId?: number | null;
  title: string;
  destination?: string;
  duration: string;
  daysCount: number;
  activityCount: number;
  updatedAt: string;
  description: string;
  coverImage: string;
  hasDetailPreview?: boolean;
}

export interface ITravelItinerary {
  id: string;
  locationId?: number | null;
  title: string;
  destination?: string;
  duration: string;
  durationDays?: number;
  durationNights?: number;
  description: string;
  coverImage: string;
  suitableFor?: string;
  themes: string[];
  days: IItineraryDay[];
  featuredImages: IItineraryGalleryImage[];
  travelTips: string[];
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
