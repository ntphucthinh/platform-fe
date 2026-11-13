import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import type { ITravelItinerary } from "@/types/pages/itineraries/itinerary";
import type { LocationStatus } from "@/constants/travelMap";

export interface ILocation {
  id: number;
  countryCode: string;
  countryName: string;
  locationName: string;
  name?: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  coverImage: string;
  imagePath?: string | null;
  status: LocationStatus;
  description?: string | null;
  notes?: string | null;
  googleMapsUrl?: string | null;
  visitCount?: number;
  itineraryCount?: number;
}

export interface ILocationPayload {
  countryCode: string;
  countryName: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  imagePath?: string;
  status: LocationStatus;
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
  status?: LocationStatus;
  countryCode?: string;
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
