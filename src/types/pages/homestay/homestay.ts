export type HomestayStatus = "Active" | "Maintenance" | "Inactive";

export interface IHomestayItem {
  id: string;
  name: string;
  location: string;
  description?: string;
  images: string[];
  /** Flexible price string, e.g. "100k", "100k → 500k", "$120/đêm" */
  price?: string;
  /** Google Maps URL, nullable */
  googleMapLink?: string | null;
  // Optional metadata for public card rendering compatibility
  shortDescription?: string;
  mainImage?: string;
  pricePerNight?: number;
  capacity?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  status?: HomestayStatus;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  createdAt?: string;
}

export interface IHomestayFormData {
  name: string;
  location: string;
  description?: string;
  images: string[];
  /** Flexible price string, e.g. "100k → 500k" */
  price?: string;
  /** Google Maps URL, nullable */
  googleMapLink?: string | null;
}
