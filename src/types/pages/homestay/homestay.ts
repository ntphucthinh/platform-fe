export type HomestayStatus = "Active" | "Maintenance" | "Inactive";

export interface HomestayImage {
  id: number;
  homestayId: number;
  imagePath: string;
  createdAt: string;
}

export interface IHomestayItem {
  id: number;
  name: string;
  address: string;
  /** Location alias for address (backwards compatibility for UI components) */
  location: string;
  description: string | null;
  /** Flexible price string, e.g. "100k → 500k", "1.500.000đ" */
  price: string | null;
  /** Google Maps URL, nullable */
  googleMapsUrl: string | null;
  /** Google Map Link alias for UI components */
  googleMapLink?: string | null;
  /** Resolved public URLs of images for rendering */
  images: string[];
  /** Raw database image records with raw storage path or URL */
  imageRecords?: HomestayImage[];
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
  updatedAt?: string;
}

export interface IHomestayFormImageItem {
  id: string;
  /** Preview URL (blob: URL for newly picked local file, or public URL) */
  url: string;
  /** Raw File object if selected from disk */
  file?: File;
  /** Flag indicating local objectUrl */
  isObjectUrl?: boolean;
  /** Raw storage path or persistent URL if existing */
  imagePath?: string;
}

export interface IHomestayFormData {
  name: string;
  address: string;
  /** Location field alias for compatibility */
  location?: string;
  description?: string | null;
  /** Display image URLs/paths */
  images: string[];
  /** Detailed image items including File objects */
  imageItems?: IHomestayFormImageItem[];
  /** Flexible price string, e.g. "100k → 500k" */
  price?: string | null;
  /** Google Maps URL, nullable */
  googleMapsUrl?: string | null;
  googleMapLink?: string | null;
}
