import {
  MOCK_LOCATIONS,
  LOCATION_MEMORY_RELATIONS,
  LOCATION_ITINERARY_RELATIONS,
  type ILocationMemoryRelation,
  type ILocationItineraryRelation,
} from "@/constants/travelMapConstant";
import type {
  ILocation,
  ILocationFormData,
  ILocationFilterState,
  ITravelMapSummary,
  ILocationWithDetails,
} from "@/types/pages/travel-map/travelMap";
import { getTravelMemories } from "@/services/travelMemoryService";
import { getItineraryById } from "@/services/itineraryService";
import type { ITravelMemory } from "@/types/pages/travel-memories/travelMemory";
import type { ITravelItinerary } from "@/types/pages/itineraries/itinerary";
import { countTotalPhotos } from "@/utils/travelMemoryUtils";

const LOCATIONS_STORAGE_KEY = "platform_travel_map_locations";
const MEMORY_RELATIONS_KEY = "platform_travel_map_memory_relations";
const ITINERARY_RELATIONS_KEY = "platform_travel_map_itinerary_relations";

// In-memory store with sessionStorage sync
let locationStore: ILocation[] = (() => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem(LOCATIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as ILocation[];
      }
    } catch {
      // Fallback
    }
  }
  return [...MOCK_LOCATIONS];
})();

let memoryRelationsStore: ILocationMemoryRelation[] = (() => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem(MEMORY_RELATIONS_KEY);
      if (stored) {
        return JSON.parse(stored) as ILocationMemoryRelation[];
      }
    } catch {
      // Fallback
    }
  }
  return [...LOCATION_MEMORY_RELATIONS];
})();

const itineraryRelationsStore: ILocationItineraryRelation[] = (() => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.sessionStorage.getItem(ITINERARY_RELATIONS_KEY);
      if (stored) {
        return JSON.parse(stored) as ILocationItineraryRelation[];
      }
    } catch {
      // Fallback
    }
  }
  return [...LOCATION_ITINERARY_RELATIONS];
})();

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener error
    }
  });
}

function persistStore(): void {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(
        LOCATIONS_STORAGE_KEY,
        JSON.stringify(locationStore),
      );
      window.sessionStorage.setItem(
        MEMORY_RELATIONS_KEY,
        JSON.stringify(memoryRelationsStore),
      );
    } catch {
      // Ignore storage error
    }
  }
  notifyListeners();
}

export function subscribeTravelMap(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLocations(): ILocation[] {
  return [...locationStore];
}

export function getLocationById(id: string): ILocation | undefined {
  return locationStore.find((loc) => loc.id === id);
}

/**
 * Get all Travel Memories linked to a Location by ID.
 * Deduplicates memories and sorts descending by start date (latest trip first).
 */
export function getMemoriesByLocationId(locationId: string): ITravelMemory[] {
  const allMemories = getTravelMemories();
  const linkedIds = new Set(
    memoryRelationsStore
      .filter((rel) => rel.locationId === locationId)
      .map((rel) => rel.memoryId),
  );

  const matched = allMemories.filter((mem) => linkedIds.has(mem.id));

  // Sort latest trip first
  return matched.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

/**
 * Get all Itineraries linked to a Location by ID.
 */
export function getItinerariesByLocationId(
  locationId: string,
): ITravelItinerary[] {
  const linkedIds = itineraryRelationsStore
    .filter((rel) => rel.locationId === locationId)
    .map((rel) => rel.itineraryId);

  const seen = new Set<string>();
  const itineraries: ITravelItinerary[] = [];

  linkedIds.forEach((id) => {
    if (!seen.has(id)) {
      seen.add(id);
      const it = getItineraryById(id);
      if (it) {
        itineraries.push(it);
      }
    }
  });

  return itineraries;
}

/**
 * Count of completed visits for a Location.
 * Based purely on completed Travel Memories. Itineraries do NOT count as visits.
 */
export function getVisitCountByLocationId(locationId: string): number {
  return getMemoriesByLocationId(locationId).length;
}

/**
 * Latest visit date for a Location (ISO string or null).
 */
export function getLatestVisitByLocationId(locationId: string): string | null {
  const memories = getMemoriesByLocationId(locationId);
  return memories.length > 0 ? memories[0].startDate : null;
}

/**
 * Total photos across all memories linked to a Location.
 */
export function getPhotoCountByLocationId(locationId: string): number {
  const memories = getMemoriesByLocationId(locationId);
  return memories.reduce((acc, m) => acc + countTotalPhotos(m.days), 0);
}

/**
 * Aggregate summary metrics across all locations and trips.
 */
export function getTravelMapSummary(locs?: ILocation[]): ITravelMapSummary {
  const locations = locs || getLocations();
  const visitedLocations = locations.filter(
    (l) => l.status === "Visited",
  ).length;
  const wishlistLocations = locations.filter(
    (l) => l.status === "Wishlist",
  ).length;

  // Count unique completed trips linked to any location
  const allLinkedMemoryIds = new Set(
    memoryRelationsStore.map((rel) => rel.memoryId),
  );

  return {
    totalLocations: locations.length,
    visitedLocations,
    wishlistLocations,
    completedTripsCount: allLinkedMemoryIds.size,
  };
}

/**
 * Get all distinct years with completed visits across all locations.
 */
export function getAvailableVisitYears(locs?: ILocation[]): number[] {
  const locations = locs || getLocations();
  const locationIds = new Set(locations.map((l) => l.id));
  const years = new Set<number>();
  const allMemories = getTravelMemories();
  const linkedMemoryIds = new Set(
    memoryRelationsStore
      .filter((rel) => locationIds.has(rel.locationId))
      .map((rel) => rel.memoryId),
  );

  allMemories.forEach((mem) => {
    if (linkedMemoryIds.has(mem.id) && mem.startDate) {
      const y = new Date(mem.startDate).getFullYear();
      if (!isNaN(y)) {
        years.add(y);
      }
    }
  });

  return Array.from(years).sort((a, b) => b - a);
}

/**
 * Filter locations according to search text, status, and visit year.
 */
export function filterLocations(
  locations: ILocation[],
  filters: ILocationFilterState,
): ILocation[] {
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
      const memories = getMemoriesByLocationId(loc.id);
      const hasTripInYear = memories.some((mem) => {
        const tripYear = new Date(mem.startDate).getFullYear();
        return tripYear === yearNum;
      });
      if (!hasTripInYear) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Return a location bundled with its computed details and relations.
 */
export function getLocationWithDetails(
  location: ILocation,
): ILocationWithDetails {
  return {
    ...location,
    visitCount: getVisitCountByLocationId(location.id),
    latestVisitDate: getLatestVisitByLocationId(location.id),
    totalPhotos: getPhotoCountByLocationId(location.id),
    memories: getMemoriesByLocationId(location.id),
    itineraries: getItinerariesByLocationId(location.id),
  };
}

/**
 * Create a new Location (mock state).
 */
export function createLocation(input: ILocationFormData): ILocation {
  const newLocation: ILocation = {
    id: `loc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: input.name.trim(),
    address: input.address.trim(),
    latitude: Number(input.latitude),
    longitude: Number(input.longitude),
    coverImage:
      input.coverImage.trim() ||
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    status: input.status,
    description: input.description?.trim(),
    notes: input.notes?.trim(),
    googleMapsUrl:
      input.googleMapsUrl?.trim() ||
      `https://maps.google.com/?q=${encodeURIComponent(input.name.trim())}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  locationStore = [newLocation, ...locationStore];
  persistStore();
  return newLocation;
}

/**
 * Update an existing Location (mock state).
 */
export function updateLocation(
  id: string,
  input: ILocationFormData,
): ILocation | null {
  const index = locationStore.findIndex((loc) => loc.id === id);
  if (index === -1) return null;

  const existing = locationStore[index];
  const updated: ILocation = {
    ...existing,
    name: input.name.trim(),
    address: input.address.trim(),
    latitude: Number(input.latitude),
    longitude: Number(input.longitude),
    coverImage: input.coverImage.trim() || existing.coverImage,
    status: input.status,
    description: input.description?.trim(),
    notes: input.notes?.trim(),
    googleMapsUrl: input.googleMapsUrl?.trim() || existing.googleMapsUrl,
    updatedAt: new Date().toISOString(),
  };

  locationStore[index] = updated;
  persistStore();
  return updated;
}

/**
 * Delete a Location (mock state). Preserves the original memories and itineraries.
 */
export function deleteLocation(id: string): boolean {
  const initialLength = locationStore.length;
  locationStore = locationStore.filter((loc) => loc.id !== id);
  // Also clean relations for this location without deleting the memories/itineraries themselves
  memoryRelationsStore = memoryRelationsStore.filter(
    (rel) => rel.locationId !== id,
  );
  persistStore();
  return locationStore.length < initialLength;
}
