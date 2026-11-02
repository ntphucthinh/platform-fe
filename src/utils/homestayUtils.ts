/**
 * homestayUtils — Pure utility functions for homestay image formatting, DB mapping, and API fetch.
 */

import { env } from "@/config/env";
import { formatRoomPrice } from "@/constants/homestayConstant";
import {
  PriceUnit,
  type IHomestayItem,
  type HomestayRoom,
  type HomestayRoomImage,
  type DbHomestay,
} from "@/types/pages/homestay/homestay";

// ---------------------------------------------------------------------------
// Image URL Mapper
// ---------------------------------------------------------------------------

export function getPublicImageUrl(path: string | null | undefined): string {
  if (!path || !path.trim()) return "";
  const trimmed = path.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const cloudName = env.cloudinaryCloudName || "aapohgop";
  const assetEnv = env.cloudinaryAssetEnv || "dev";
  const cleanPath = trimmed.replace(/^\/+/, "");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${assetEnv}/${cleanPath}`;
}

// ---------------------------------------------------------------------------
// Response Model Mapper
// ---------------------------------------------------------------------------

export function mapDbHomestayToItem(dbRow: DbHomestay): IHomestayItem {
  const rawRooms = dbRow.homestay_rooms ?? [];

  const sortedRooms = [...rawRooms].sort((a, b) => {
    const orderA = a.sort_order ?? 0;
    const orderB = b.sort_order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });

  const rooms: HomestayRoom[] = sortedRooms.map((room) => {
    const rawImages = room.homestay_images ?? [];

    const sortedImages = [...rawImages].sort((a, b) => {
      const orderA = a.sort_order ?? 0;
      const orderB = b.sort_order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id;
    });

    const imageRecords: HomestayRoomImage[] = sortedImages.map((img) => ({
      id: img.id,
      roomId: img.room_id,
      homestayId: img.homestay_id ?? dbRow.id,
      imagePath: img.image_path,
      sortOrder: img.sort_order ?? 1,
      isCover: Boolean(img.is_cover),
      createdAt: img.created_at,
      url: getPublicImageUrl(img.image_path),
    }));

    const images = imageRecords
      .map((img) => img.url || getPublicImageUrl(img.imagePath))
      .filter((url): url is string => Boolean(url && url.trim().length > 0));

    return {
      id: room.id,
      homestayId: room.homestay_id,
      name: room.name ?? "",
      description: room.description ?? null,
      priceText: null,
      priceAmount:
        room.price_amount !== undefined && room.price_amount !== null
          ? Number(room.price_amount)
          : null,
      priceUnit: (room.price_unit as PriceUnit) || null,
      sortOrder: room.sort_order ?? 1,
      createdAt: room.created_at,
      updatedAt: room.updated_at,
      images,
      imageRecords,
    };
  });

  const allRoomImages: string[] = [];
  const allImageRecords: HomestayRoomImage[] = [];
  let detectedCoverUrl: string | null = null;

  rooms.forEach((r) => {
    r.imageRecords.forEach((imgRec) => {
      allImageRecords.push(imgRec);
      const url = imgRec.url || getPublicImageUrl(imgRec.imagePath);
      if (url) {
        allRoomImages.push(url);
        if (imgRec.isCover && !detectedCoverUrl) {
          detectedCoverUrl = url;
        }
      }
    });
  });

  const representativePrice =
    rooms.length > 0
      ? formatRoomPrice(rooms[0].priceAmount, rooms[0].priceUnit)
      : "Chưa cập nhật giá";

  const firstRoom = rooms[0];
  const firstRoomCover = firstRoom?.imageRecords.find((img) => img.isCover);
  const mainImage =
    firstRoomCover?.url ||
    (firstRoomCover ? getPublicImageUrl(firstRoomCover.imagePath) : null) ||
    detectedCoverUrl ||
    (firstRoom?.images && firstRoom.images.length > 0
      ? firstRoom.images[0]
      : null) ||
    (allRoomImages.length > 0 ? allRoomImages[0] : "") ||
    "";

  const images =
    firstRoom?.images && firstRoom.images.length > 0
      ? firstRoom.images
      : allRoomImages;

  return {
    id: dbRow.id,
    name: dbRow.name ?? "",
    address: dbRow.address ?? "",
    location: dbRow.address ?? "",
    description: dbRow.description ?? null,
    price: representativePrice,
    googleMapsUrl: dbRow.google_maps_url ?? null,
    googleMapLink: dbRow.google_maps_url ?? null,
    rooms,
    images,
    imageRecords: allImageRecords,
    mainImage,
    createdAt: dbRow.created_at,
    updatedAt: dbRow.updated_at,
  };
}
