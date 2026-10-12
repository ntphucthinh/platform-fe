export type HomestayStatus = "Active" | "Maintenance" | "Inactive";

/**
 * HomestayRoomImage — image metadata associated with a room in homestay_images table.
 */
export interface HomestayRoomImage {
  id: number;
  roomId: number;
  homestayId?: number | null;
  imagePath: string;
  sortOrder: number;
  isCover: boolean;
  createdAt?: string;
  url?: string;
}

/** Legacy alias for HomestayRoomImage */
export type HomestayImage = HomestayRoomImage;

/**
 * HomestayRoom — room type belonging to a homestay in homestay_rooms table.
 */
export interface HomestayRoom {
  id: number;
  homestayId: number;
  name: string;
  description: string | null;
  priceText: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  /** Resolved public URLs of images for rendering, ordered by sort_order */
  images: string[];
  /** Detailed image records with metadata */
  imageRecords: HomestayRoomImage[];
}

export interface IHomestayItem {
  id: number;
  name: string;
  address: string;
  /** Location alias for address (backwards compatibility for UI components) */
  location: string;
  description: string | null;
  /** Flexible representative price string, e.g. "430k - 450k / đêm / phòng" */
  price: string | null;
  /** Google Maps URL, nullable */
  googleMapsUrl: string | null;
  /** Google Map Link alias for UI components */
  googleMapLink?: string | null;
  /** Room types belonging to this homestay */
  rooms: HomestayRoom[];
  /** Aggregated or representative images for backwards compatibility */
  images: string[];
  /** Raw database image records with raw storage path or URL */
  imageRecords?: HomestayRoomImage[];
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

export interface IRoomFormImageItem {
  id: string;
  imageId?: number;
  /** Preview URL (blob: URL for newly picked local file, or public URL) */
  url: string;
  /** Raw File object if selected from disk */
  file?: File;
  /** Flag indicating local objectUrl */
  isObjectUrl?: boolean;
  /** Raw storage path or persistent URL if existing */
  imagePath?: string;
  sortOrder: number;
  isCover: boolean;
}

/** Legacy alias for form image item */
export type IHomestayFormImageItem = IRoomFormImageItem;

export interface IHomestayRoomFormData {
  id?: number;
  name: string;
  description?: string | null;
  priceText?: string | null;
  sortOrder: number;
  images: string[];
  imageItems?: IRoomFormImageItem[];
}

export interface IHomestayFormData {
  name: string;
  address: string;
  /** Location field alias for compatibility */
  location?: string;
  description?: string | null;
  /** Flexible representative price string */
  price?: string | null;
  /** Google Maps URL, nullable */
  googleMapsUrl?: string | null;
  googleMapLink?: string | null;
  /** Rooms belonging to this homestay */
  rooms: IHomestayRoomFormData[];
  /** Display image URLs/paths for compatibility */
  images?: string[];
  /** Detailed image items for compatibility */
  imageItems?: IRoomFormImageItem[];
}
