import type {
  ILocation,
  ILocationPayload,
  ILocationFilterState,
  ILocationFormData,
  ILocationWithDetails,
  ITravelMapSummary,
} from "@/types/pages/travel-map/travelMap";
import { getPublicImageUrl } from "@/utils/homestayUtils";
import { findCountryByCode } from "@/hooks/common/useGlobalGeo";
import { Country } from "country-state-city";
import {
  LocationStatus,
  VIETNAM_DEFAULT_CENTER,
  VIETNAM_DEFAULT_ZOOM,
} from "@/constants/travelMap";

/**
 * Dynamically generates Google Maps URL from latitude and longitude.
 */
export const getGoogleMapsUrl = (
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): string | null => {
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined ||
    isNaN(Number(latitude)) ||
    isNaN(Number(longitude))
  ) {
    return null;
  }

  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

/**
 * Maps/normalizes a travel location to frontend ILocationWithDetails.
 * Ensures id is preserved strictly as a number.
 */
export function mapApiLocationToItem(
  raw: ILocation,
): ILocationWithDetails {
  const status: LocationStatus =
    raw.status === LocationStatus.Wishlist ||
    raw.status?.toLowerCase() === LocationStatus.Wishlist
      ? LocationStatus.Wishlist
      : LocationStatus.Visited;
  const locName = raw.locationName || "";
  const dynamicMapUrl = getGoogleMapsUrl(raw.latitude, raw.longitude);

  return {
    id: raw.id, // Strictly number, not converted to string
    countryCode: raw.countryCode,
    countryName: raw.countryName,
    locationName: locName,
    name: locName,
    address: raw.countryName ? `${locName}, ${raw.countryName}` : locName,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    coverImage: getPublicImageUrl(raw.imagePath),
    imagePath: raw.imagePath || undefined,
    status,
    description: raw.description || "",
    notes: raw.notes || "",
    googleMapsUrl: raw.googleMapsUrl || dynamicMapUrl || "",
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
    // 1. Search locationName, name, or address
    if (searchLower) {
      const matchName = (loc.locationName || loc.name || "")
        .toLowerCase()
        .includes(searchLower);
      const matchAddress = (loc.address || "")
        .toLowerCase()
        .includes(searchLower);
      const matchCountry = (loc.countryName || "")
        .toLowerCase()
        .includes(searchLower);
      if (!matchName && !matchAddress && !matchCountry) {
        return false;
      }
    }

    // 2. Status filter
    if (filters.status && loc.status !== filters.status) {
      return false;
    }

    // 3. Year filter
    if (filters.year !== undefined && filters.year !== null) {
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
 * Lấy tọa độ tâm và mức zoom phù hợp cho quốc gia
 */
export function getCountryCenterAndZoom(iso2?: string | null): {
  center: [number, number];
  zoom: number;
} {
  if (!iso2) {
    return { center: VIETNAM_DEFAULT_CENTER, zoom: VIETNAM_DEFAULT_ZOOM };
  }

  const code = iso2.toUpperCase();
  if (code === "VN") {
    return { center: VIETNAM_DEFAULT_CENTER, zoom: VIETNAM_DEFAULT_ZOOM };
  }

  const countryData = Country.getCountryByCode(code);
  if (countryData?.latitude && countryData?.longitude) {
    const lat = Number(countryData.latitude);
    const lng = Number(countryData.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const microCountries = new Set([
        "SG",
        "HK",
        "MO",
        "VA",
        "MC",
        "MT",
        "BH",
        "LU",
        "AD",
        "LI",
        "SM",
      ]);
      const megaCountries = new Set(["RU", "CA", "US", "CN", "AU", "BR"]);

      let zoom = 6;
      if (microCountries.has(code)) {
        zoom = 11;
      } else if (megaCountries.has(code)) {
        zoom = 4;
      }

      return { center: [lat, lng], zoom };
    }
  }

  return { center: VIETNAM_DEFAULT_CENTER, zoom: VIETNAM_DEFAULT_ZOOM };
}

/**
 * Calculates travel map summary statistics from current locations.
 */
export function getTravelMapSummary(
  locations: ILocationWithDetails[],
): ITravelMapSummary {
  const totalLocations = locations.length;
  const visitedLocations = locations.filter(
    (loc) => loc.status === LocationStatus.Visited,
  ).length;
  const wishlistLocations = locations.filter(
    (loc) => loc.status === LocationStatus.Wishlist,
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

/**
 * Extracts clean relative storage path from any URL or path string.
 * Strips Cloudinary origin/folder prefix, local absolute leading slashes, etc.
 * Example:
 *  - "https://res.cloudinary.com/aapohgop/image/upload/dev/travel_location/550e...png" -> "travel_location/550e...png"
 *  - "travel_location/550e...png" -> "travel_location/550e...png"
 *  - "/images/locations/tokyo.jpg" -> "images/locations/tokyo.jpg"
 */
export function extractRelativeImagePath(
  pathOrUrl?: string | null,
): string | undefined {
  if (!pathOrUrl || !pathOrUrl.trim()) return undefined;
  const trimmed = pathOrUrl.trim();

  // If local base64 or blob, not a remote path
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return undefined;
  }

  // 1. Cloudinary upload URL pattern
  // Matches: https://res.cloudinary.com/<cloudName>/image/upload/(transforms/)?(v\d+/)?(env/)?(actual_path)
  const cloudinaryUploadIndex = trimmed.indexOf("/image/upload/");
  if (cloudinaryUploadIndex !== -1) {
    const afterUpload = trimmed.substring(
      cloudinaryUploadIndex + "/image/upload/".length,
    );
    // Strip transforms (e.g. c_scale,w_500/), version (e.g. v1234567890/), and env prefix (dev/|prod/|production/|staging/|test/)
    const pathWithoutEnv = afterUpload
      .replace(/^(?:[a-z]_[^/]+\/)+/i, "") // e.g. w_500,f_auto/
      .replace(/^v\d+\//, "") // e.g. v1689234123/
      .replace(/^(?:dev|prod|production|staging|test)\//i, ""); // e.g. dev/

    return pathWithoutEnv.replace(/^\/+/, "");
  }

  // 2. Generic HTTP URL with known resource folders
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const match = url.pathname.match(
        /\/(travel_location\/.+|homestays\/.+|images\/.+)/i,
      );
      if (match && match[1]) {
        return match[1];
      }
    } catch {
      // ignore
    }
  }

  // 3. Relative path (strip leading slash)
  return trimmed.replace(/^\/+/, "");
}

/**
 * Builds the API payload for creating or updating a travel location.
 * Uses countryCode, countryName, and locationName.
 * Automatically derives dynamic Google Maps URL from latitude and longitude.
 * Always guarantees imagePath is a relative storage path (never full URL).
 */
export function buildTravelLocationPayload(
  formData: ILocationFormData,
  uploadedImagePath?: string,
): ILocationPayload {
  const countryCode = (formData.countryCode || "VN").toUpperCase();

  // Auto-fill countryName from countryCode
  const targetCountry = findCountryByCode(countryCode);
  const countryName = targetCountry?.name || formData.countryName || "";
  const locationName = (formData.locationName || "").trim();

  const lat =
    formData.latitude !== "" &&
    formData.latitude !== null &&
    formData.latitude !== undefined &&
    !isNaN(Number(formData.latitude))
      ? Number(formData.latitude)
      : null;

  const lng =
    formData.longitude !== "" &&
    formData.longitude !== null &&
    formData.longitude !== undefined &&
    !isNaN(Number(formData.longitude))
      ? Number(formData.longitude)
      : null;

  const status: LocationStatus =
    formData.status === LocationStatus.Wishlist ||
    formData.status?.toLowerCase() === LocationStatus.Wishlist
      ? LocationStatus.Wishlist
      : LocationStatus.Visited;

  let rawPath: string | undefined = undefined;

  if (uploadedImagePath) {
    rawPath = uploadedImagePath;
  } else if (formData.imagePath !== undefined && formData.imagePath !== null) {
    rawPath = formData.imagePath.trim() ? formData.imagePath.trim() : undefined;
  } else if (
    formData.coverImage &&
    !formData.coverImage.startsWith("data:") &&
    !formData.coverImage.startsWith("blob:")
  ) {
    rawPath = formData.coverImage.trim();
  }

  const imagePath = extractRelativeImagePath(rawPath);
  const dynamicGoogleMapsUrl = getGoogleMapsUrl(lat, lng);
  const googleMapsUrl =
    formData.googleMapsUrl?.trim() || dynamicGoogleMapsUrl || undefined;

  return {
    countryCode,
    countryName,
    locationName,
    latitude: lat,
    longitude: lng,
    imagePath: imagePath || undefined,
    status,
    description: formData.description?.trim() || undefined,
    notes: formData.notes?.trim() || undefined,
    googleMapsUrl,
  };
}

/**
 * Kiểu dữ liệu hình học đa giác biên giới quốc gia (GeoJSON Polygon/MultiPolygon)
 */
export type CountryGeometry =
  | {
      type: "Polygon";
      coordinates: [number, number][][];
    }
  | {
      type: "MultiPolygon";
      coordinates: [number, number][][][];
    };

let cachedBoundaries: Record<string, CountryGeometry> | null = null;
let loadPromise: Promise<Record<string, CountryGeometry>> | null = null;

/**
 * Tải danh sách ranh giới các quốc gia từ file tĩnh public/data/countryBoundaries.json
 */
export async function loadCountryBoundaries(): Promise<
  Record<string, CountryGeometry>
> {
  if (cachedBoundaries) {
    return cachedBoundaries;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      const response = await fetch("/data/countryBoundaries.json");
      if (!response.ok) {
        throw new Error(
          `Failed to load country boundaries: ${response.statusText}`,
        );
      }
      const data = (await response.json()) as Record<string, CountryGeometry>;
      cachedBoundaries = data;
      return data;
    } catch (err) {
      console.warn("Could not load country boundaries JSON:", err);
      return {};
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

/**
 * Lấy dữ liệu ranh giới hình học của một quốc gia theo mã ISO2
 */
export async function getCountryBoundary(
  iso2?: string | null,
): Promise<CountryGeometry | null> {
  if (!iso2) return null;
  const boundaries = await loadCountryBoundaries();
  return boundaries[iso2.toUpperCase()] || null;
}

/**
 * Thuật toán Ray-Casting kiểm tra tọa độ [lng, lat] nằm trong đa giác
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][],
): boolean {
  const [lng, lat] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function dist2(p1: [number, number], p2: [number, number]): number {
  return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
}

function distToSegmentSquared(
  p: [number, number],
  v: [number, number],
  w: [number, number],
): number {
  const l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}

function minDistanceToPolygon(
  point: [number, number],
  polygon: [number, number][],
): number {
  let minD = Infinity;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const d = distToSegmentSquared(point, polygon[i], polygon[j]);
    if (d < minD) minD = d;
  }
  return Math.sqrt(minD);
}

function minDistanceToGeometry(
  point: [number, number],
  geometry: CountryGeometry,
): number {
  if (geometry.type === "Polygon") {
    return minDistanceToPolygon(point, geometry.coordinates[0]);
  } else if (geometry.type === "MultiPolygon") {
    let minD = Infinity;
    for (const poly of geometry.coordinates) {
      const d = minDistanceToPolygon(point, poly[0]);
      if (d < minD) minD = d;
    }
    return minD;
  }
  return Infinity;
}

/**
 * Kiểm tra xem tọa độ có thuộc vùng biển chủ quyền, hải đảo và thềm lục địa của Việt Nam:
 * - Quần đảo Hoàng Sa (Paracel Islands)
 * - Quần đảo Trường Sa (Spratly Islands) & Cụm nhà giàn DK1
 * - Vùng biển Vịnh Bắc Bộ (Bạch Long Vĩ, Cô Tô, Cát Bà, Vịnh Hạ Long ngoài khơi)
 * - Vùng biển duyên hải miền Trung (Cồn Cỏ, Cù Lao Chàm, Lý Sơn)
 * - Vùng biển duyên hải Nam Trung Bộ & Nam Bộ (Phú Quý, Côn Đảo, Vịnh Thái Lan, Thổ Chu, Nam Du)
 */
export function isPointInVietnamMaritime(lat: number, lng: number): boolean {
  // 1. Quần đảo Hoàng Sa
  if (lat >= 15.5 && lat <= 17.5 && lng >= 111.0 && lng <= 113.5) {
    return true;
  }

  // 2. Quần đảo Trường Sa & Nhà giàn DK1
  if (lat >= 6.5 && lat <= 12.5 && lng >= 111.0 && lng <= 117.8) {
    return true;
  }

  // 3. Vùng biển thềm lục địa phía Nam & DK1
  if (lat >= 6.5 && lat <= 9.0 && lng >= 108.5 && lng <= 111.5) {
    return true;
  }

  // 4. Vùng biển Vịnh Bắc Bộ (Bạch Long Vĩ, Cô Tô, Vịnh Hạ Long, vịnh biển phía Bắc)
  if (lat >= 18.0 && lat <= 21.8 && lng >= 105.8 && lng <= 108.8) {
    return true;
  }

  // 5. Vùng biển Duyên hải Miền Trung & Nam Trung Bộ (Cồn Cỏ, Cù Lao Chàm, Lý Sơn, Phú Quý, vùng biển)
  if (lat >= 9.0 && lat <= 18.0 && lng >= 107.0 && lng <= 110.5) {
    return true;
  }

  // 6. Vùng biển Vịnh Thái Lan & Tây Nam (Phú Quốc, Thổ Chu, Nam Du, Côn Đảo)
  if (lat >= 8.0 && lat <= 10.6 && lng >= 103.0 && lng <= 107.0) {
    return true;
  }

  return false;
}

/**
 * Kiểm tra tọa độ có thuộc lãnh thổ của quốc gia được chọn hay không
 */
export function isPointInCountry(
  lat: number,
  lng: number,
  geometry?: CountryGeometry | null,
  countryCode?: string | null,
  toleranceDeg: number = 0.08,
): boolean {
  if (!geometry) {
    return true;
  }

  const isVN =
    countryCode?.toUpperCase() === "VN" ||
    (geometry.type === "MultiPolygon" && geometry.coordinates.length >= 10);
  if (isVN && isPointInVietnamMaritime(lat, lng)) {
    return true;
  }

  const point: [number, number] = [lng, lat];

  if (geometry.type === "Polygon") {
    if (isPointInPolygon(point, geometry.coordinates[0])) {
      return true;
    }
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) {
      if (isPointInPolygon(point, poly[0])) {
        return true;
      }
    }
  }

  const dist = minDistanceToGeometry(point, geometry);
  return dist <= toleranceDeg;
}
