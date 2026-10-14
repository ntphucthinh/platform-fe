export interface ITravelMemoryPhoto {
  id: string;
  imageUrl: string;
  caption?: string;
  altText?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ITravelMemoryDay {
  date: string; // ISO date string 'YYYY-MM-DD'
  photos: ITravelMemoryPhoto[];
}

export interface ITravelMemory {
  id: string;
  title: string;
  destination: string;
  startDate: string; // ISO date string 'YYYY-MM-DD'
  endDate: string; // ISO date string 'YYYY-MM-DD'
  description?: string;
  coverImage: string;
  days: ITravelMemoryDay[];
  createdAt: string;
  updatedAt: string;
}

export interface ITravelMemoryFormData {
  title: string;
  destination: string;
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
