import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import type { ITravelItinerary } from "@/types/pages/itineraries/itinerary";

export type LocationStatus = "Visited" | "Wishlist";

export interface ApiTravelLocation {
  id: number;
  countryCode: string;
  countryName: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  imagePath?: string | null;
  status: "visited" | "wishlist";
  description?: string | null;
  notes?: string | null;
  googleMapsUrl?: string | null;
  visitCount?: number;
  itineraryCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILocation {
  id: number;
  countryCode?: string;
  countryName?: string;
  locationName: string;
  name?: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  coverImage: string;
  imagePath?: string;
  status: LocationStatus;
  description?: string;
  notes?: string;
  googleMapsUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTravelLocationPayload {
  countryCode: string;
  countryName: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  imagePath?: string;
  status: "visited" | "wishlist";
  description?: string;
  notes?: string;
  googleMapsUrl?: string;
}

export interface ILocationFormData {
  countryCode?: string;
  countryName?: string;
  locationName: string;
  latitude: number | "" | null;
  longitude: number | "" | null;
  coverImage: string;
  imageFile?: File | null;
  imagePath?: string;
  status: LocationStatus | null;
  description?: string;
  notes?: string;
  googleMapsUrl?: string;
}

export interface ILocationFilterState {
  search: string;
  status: "ALL" | LocationStatus;
  year: "ALL" | number;
}

export interface ITravelMapSummary {
  totalLocations: number;
  visitedLocations: number;
  wishlistLocations: number;
  completedTripsCount: number;
}

export interface ILocationWithDetails extends ILocation {
  visitCount: number;
  itineraryCount: number;
  latestVisitDate: string | null;
  totalPhotos: number;
  memories: ITravelMemory[];
  itineraries: ITravelItinerary[];
}
