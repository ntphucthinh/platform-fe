import type {
  ApiTravelLocation,
  ILocationFilterState,
  ILocationWithDetails,
  ITravelMapSummary,
  LocationStatus,
} from "@/types/pages/travel-map/travelMap";
import { getPublicImageUrl } from "@/utils/homestayUtils";

/**
 * Maps raw backend ApiTravelLocation to frontend ILocationWithDetails.
 * Ensures id is preserved strictly as a number.
 */
export function mapApiLocationToItem(
  raw: ApiTravelLocation,
): ILocationWithDetails {
  const status: LocationStatus =
    raw.status?.toLowerCase() === "visited" ? "Visited" : "Wishlist";

  return {
    id: raw.id, // Strictly number, not converted to string
    countryCode: raw.countryCode,
    countryName: raw.countryName,
    stateCode: raw.stateCode,
    provinceCode: raw.stateCode,
    name: raw.name || "",
    address: raw.address || "",
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    coverImage: getPublicImageUrl(raw.imagePath),
    status,
    description: raw.description || "",
    notes: raw.notes || "",
    googleMapsUrl: raw.googleMapsUrl || "",
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    visitCount: raw.visitCount ?? 0,
    itineraryCount: raw.itineraryCount ?? 0,
    latestVisitDate: null,
    totalPhotos: 0,
    memories: [],
    itineraries: [],
  };
}

/**
 * Filters locations by search query, status, and year.
 */
export function filterLocations(
  locations: ILocationWithDetails[],
  filters: ILocationFilterState,
): ILocationWithDetails[] {
  const searchLower = filters.search.trim().toLowerCase();

  return locations.filter((loc) => {
    // 1. Search name or address
    if (searchLower) {
      const matchName = loc.name.toLowerCase().includes(searchLower);
      const matchAddress = loc.address.toLowerCase().includes(searchLower);
      if (!matchName && !matchAddress) {
        return false;
      }
    }

    // 2. Status filter
    if (filters.status !== "ALL" && loc.status !== filters.status) {
      return false;
    }

    // 3. Year filter
    if (filters.year !== "ALL") {
      const yearNum = Number(filters.year);
      if (loc.latestVisitDate) {
        const visitYear = new Date(loc.latestVisitDate).getFullYear();
        if (visitYear !== yearNum) return false;
      } else {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculates travel map summary statistics from current locations.
 */
export function getTravelMapSummary(
  locations: ILocationWithDetails[],
): ITravelMapSummary {
  const totalLocations = locations.length;
  const visitedLocations = locations.filter(
    (loc) => loc.status === "Visited",
  ).length;
  const wishlistLocations = locations.filter(
    (loc) => loc.status === "Wishlist",
  ).length;
  const completedTripsCount = locations.reduce(
    (acc, loc) => acc + (loc.visitCount || 0),
    0,
  );

  return {
    totalLocations,
    visitedLocations,
    wishlistLocations,
    completedTripsCount,
  };
}

/**
 * Extracts available visit years from locations.
 */
export function getAvailableVisitYears(
  locations: ILocationWithDetails[],
): number[] {
  const yearsSet = new Set<number>();
  for (const loc of locations) {
    if (loc.latestVisitDate) {
      const y = new Date(loc.latestVisitDate).getFullYear();
      if (!isNaN(y)) yearsSet.add(y);
    }
  }
  return Array.from(yearsSet).sort((a, b) => b - a);
}

