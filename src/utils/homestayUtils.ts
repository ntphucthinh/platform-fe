/**
 * homestayUtils — Pure utility functions for homestay image formatting, DB mapping, and API fetch.
 */

import { env } from "@/config/env";
import { formatRoomPrice } from "@/constants/homestay";
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
  const rawRooms = dbRow.rooms ?? dbRow.homestayRooms ?? [];

  const sortedRooms = [...rawRooms].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });

  const rooms: HomestayRoom[] = sortedRooms.map((room) => {
    const rawImages = room.images ?? room.homestayImages ?? [];

    const sortedImages = [...rawImages].sort((a, b) => {
      const orderA = a.sortOrder ?? 0;
      const orderB = b.sortOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id;
    });

    const imageRecords: HomestayRoomImage[] = sortedImages.map((img) => {
      const path = img.imagePath || img.url || "";
      const isCover = Boolean(img.isCover);
      const sortOrder = img.sortOrder ?? 1;
      const roomId = img.roomId ?? room.id;
      const homestayId = img.homestayId ?? room.homestayId ?? dbRow.id;

      return {
        id: img.id,
        roomId,
        homestayId,
        imagePath: path,
        sortOrder,
        isCover,
        createdAt: img.createdAt,
        url: img.url || getPublicImageUrl(path),
        mediaType: img.mediaType,
      };
    });

    const images = imageRecords
      .map((img) => img.url || getPublicImageUrl(img.imagePath))
      .filter((url): url is string => Boolean(url && url.trim().length > 0));

    const priceAmount =
      room.priceAmount !== undefined &&
      room.priceAmount !== null &&
      !isNaN(Number(room.priceAmount))
        ? Number(room.priceAmount)
        : null;

    const priceUnit = (room.priceUnit as PriceUnit) || null;
    const sortOrder = room.sortOrder ?? 1;
    const homestayId = room.homestayId ?? dbRow.id;

    return {
      id: room.id,
      homestayId,
      name: room.name ?? "",
      description: room.description ?? null,
      priceText: null,
      priceAmount,
      priceUnit,
      sortOrder,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
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

  // Direct homestay-level images if returned by API
  const directImages = dbRow.images ?? dbRow.homestayImages ?? [];
  if (directImages.length > 0 && allImageRecords.length === 0) {
    directImages.forEach((img) => {
      const path = img.imagePath || img.url || "";
      const isCover = Boolean(img.isCover);
      const url = img.url || getPublicImageUrl(path);
      if (url) {
        allRoomImages.push(url);
        allImageRecords.push({
          id: img.id,
          roomId: img.roomId ?? 0,
          homestayId: img.homestayId ?? dbRow.id,
          imagePath: path,
          sortOrder: img.sortOrder ?? 1,
          isCover,
          createdAt: img.createdAt,
          url,
          mediaType: img.mediaType,
        });
        if (isCover && !detectedCoverUrl) {
          detectedCoverUrl = url;
        }
      }
    });
  }

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

  const googleMapsUrl = dbRow.googleMapsUrl ?? null;
  const address = dbRow.address ?? dbRow.location ?? "";

  return {
    id: dbRow.id,
    name: dbRow.name ?? "",
    address,
    location: address,
    description: dbRow.description ?? null,
    price: representativePrice,
    googleMapsUrl,
    googleMapLink: googleMapsUrl,
    rooms,
    images,
    imageRecords: allImageRecords,
    mainImage,
    createdAt: dbRow.createdAt,
    updatedAt: dbRow.updatedAt,
  };
}
