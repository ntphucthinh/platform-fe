import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import type { ITravelItinerary } from "@/types/pages/itineraries/itinerary";

export type LocationStatus = "Visited" | "Wishlist";

export interface ApiTravelLocation {
  id: number;
  name: string;
  address: string;
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  latitude: number | null;
  longitude: number | null;
  imagePath?: string;
  status: "visited" | "wishlist" | string;
  description?: string;
  notes?: string;
  googleMapsUrl?: string;
  visitCount?: number;
  itineraryCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILocation {
  id: number;
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  provinceCode?: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  coverImage: string;
  status: LocationStatus;
  description?: string;
  notes?: string;
  googleMapsUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILocationFormData {
  countryCode?: string;
  countryName?: string;
  stateCode?: string;
  provinceCode?: string;
  name: string;
  address: string;
  latitude: number | "" | null;
  longitude: number | "" | null;
  coverImage: string;
  status: LocationStatus;
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
