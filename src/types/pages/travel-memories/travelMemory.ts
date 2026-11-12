// ---------------------------------------------------------------------------
// Travel Memory Domain & Form Interfaces (I-prefixed per project conventions)
// ---------------------------------------------------------------------------

export interface ITravelMemoryPhoto {
  id: number;
  memoryDayId?: number;
  imagePath?: string;
  imageUrl?: string;
  caption?: string;
  altText?: string;
  fileName?: string;
  fileSize?: number;
  sortOrder?: number;
}

export interface ITravelMemoryDay {
  id?: number;
  memoryId?: number;
  date: string; // ISO date string 'YYYY-MM-DD'
  description?: string | null;
  photos: ITravelMemoryPhoto[];
}

export interface ITravelMemoryLocation {
  id?: number;
  countryCode?: string;
  countryName?: string;
  locationName?: string;
}

export interface ITravelMemory {
  id: number;
  locationId?: number;
  locationName?: string;
  location?: ITravelMemoryLocation;
  title: string;
  destination: string;
  countryCode?: string;
  startDate: string; // ISO date string 'YYYY-MM-DD'
  endDate: string; // ISO date string 'YYYY-MM-DD'
  description?: string | null;
  coverImagePath?: string;
  coverImage: string;
  days: ITravelMemoryDay[];
}

export interface ITravelMemoryFormData {
  title: string;
  destination: string;
  locationId?: number | null;
  startDate: string;
  endDate: string;
  description?: string;
  coverImage: string;
}

export interface IDateRangeDuration {
  days: number;
  nights: number;
  label: string;
}

export interface IRemovedDatePhotoSummary {
  date: string;
  formattedDate: string;
  photoCount: number;
}
