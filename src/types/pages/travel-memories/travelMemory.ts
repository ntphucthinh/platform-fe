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
  file?: File;
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

// ---------------------------------------------------------------------------
// API Request Payloads & Form Submit Interfaces
// ---------------------------------------------------------------------------

// Photo payloads
export interface ICreateTravelMemoryPhotoPayload {
  imagePath: string;
}

export interface IUpdateTravelMemoryPhotoPayload
  extends ICreateTravelMemoryPhotoPayload {
  id?: number | null;
}

// Day payloads
export interface ITravelMemoryBaseDayPayload {
  date: string; // ISO date string 'YYYY-MM-DD'
  description?: string | null;
}

export interface ICreateTravelMemoryDayPayload
  extends ITravelMemoryBaseDayPayload {
  photos?: ICreateTravelMemoryPhotoPayload[];
}

export interface IUpdateTravelMemoryDayPayload
  extends ITravelMemoryBaseDayPayload {
  id?: number | null;
  photos?: IUpdateTravelMemoryPhotoPayload[];
}

// Memory request payloads
export interface ITravelMemoryBasePayload {
  locationId: number;
  title: string;
  startDate: string; // ISO date string 'YYYY-MM-DD'
  endDate: string; // ISO date string 'YYYY-MM-DD'
  description?: string | null;
  coverImagePath?: string | null;
}

export interface ICreateTravelMemoryPayload extends ITravelMemoryBasePayload {
  days?: ICreateTravelMemoryDayPayload[];
}

export interface IUpdateTravelMemoryPayload extends ITravelMemoryBasePayload {
  days?: IUpdateTravelMemoryDayPayload[];
}

// Form submit data extending base form schema data
export interface ITravelMemoryFormSubmitData extends ITravelMemoryFormData {
  coverImagePath?: string | null;
  coverImageFile?: File | null;
  days: ITravelMemoryDay[];
}
