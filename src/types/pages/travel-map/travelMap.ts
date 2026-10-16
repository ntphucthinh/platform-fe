import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import type { ITravelItinerary } from "@/types/pages/itineraries/itinerary";

export type LocationStatus = "Visited" | "Wishlist";

export interface ILocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  status: LocationStatus;
  description?: string;
  notes?: string;
  googleMapsUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILocationFormData {
  name: string;
  address: string;
  latitude: number | "";
  longitude: number | "";
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
  latestVisitDate: string | null;
  totalPhotos: number;
  memories: ITravelMemory[];
  itineraries: ITravelItinerary[];
}
