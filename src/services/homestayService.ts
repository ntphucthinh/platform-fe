/**
 * homestayService — Supabase REST API and Supabase Storage service
 * for homestays, homestay_rooms, and homestay_images.
 *
 * Bucket name: "homestay-images"
 * Storage path convention: homestays/{homestayId}/{uniqueFileName}
 */

import { env } from "@/config/env";
import { getValidAdminToken, refreshAdminSession } from "@/services/authService";
import { formatRoomPrice } from "@/constants/homestayConstant";
import {
  PriceUnit,
  type IHomestayItem,
  type IHomestayFormData,
  type IRoomFormImageItem,
  type HomestayRoom,
  type HomestayRoomImage,
} from "@/types/pages/homestay/homestay";

// ---------------------------------------------------------------------------
// Constants & Internal Database Interfaces
// ---------------------------------------------------------------------------

export const HOMESTAY_BUCKET = "homestay-images";

export interface DbHomestayImage {
  id: number;
  homestay_id?: number | null;
  room_id: number;
  image_path: string;
  sort_order: number;
  is_cover: boolean;
  created_at?: string;
}

export interface DbHomestayRoom {
  id: number;
  homestay_id: number;
  name: string;
  description: string | null;
  price_text: string | null;
  price_amount?: number | null;
  price_unit?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  homestay_images?: DbHomestayImage[];
}

export interface DbHomestay {
  id: number;
  name: string;
  address: string;
  description: string | null;
  price: string | null;
  google_maps_url: string | null;
  created_at?: string;
  updated_at?: string;
  homestay_rooms?: DbHomestayRoom[];
  homestay_images?: DbHomestayImage[];
}

// ---------------------------------------------------------------------------
// Header Builders & HTTP Request Helpers
// ---------------------------------------------------------------------------

/**
 * Public headers for unauthenticated operations (fetching homestay list / details).
 * ALWAYS uses the publishable / anon key and NEVER attaches an admin JWT.
 * This guarantees public visitors are never affected by expired admin tokens (PGRST303).
 */
export function getPublicHeaders(includeContentType = true): Record<string, string> {
  const apiKey = env.supabasePublishableKey;
  const headers: Record<string, string> = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/**
 * Admin headers for authenticated CRUD operations and Supabase Storage.
 * Automatically verifies that the admin token is valid and refreshed before request.
 */
export async function getAdminHeaders(
  includeContentType = true
): Promise<Record<string, string>> {
  const apiKey = env.supabasePublishableKey;
  const token = await getValidAdminToken();

  const headers: Record<string, string> = {
    apikey: apiKey,
    Authorization: token ? `Bearer ${token}` : `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/**
 * Executes an authenticated admin HTTP request.
 * Automatically injects valid admin Authorization header and retries once if
 * PostgREST returns a 401 PGRST303 (JWT expired) error by forcing a token refresh.
 */
async function adminFetch(
  url: string,
  init: RequestInit,
  includeContentType = true
): Promise<Response> {
  const headers = await getAdminHeaders(includeContentType);
  const mergedHeaders = {
    ...headers,
    ...(init.headers || {}),
  };

  let response = await fetch(url, {
    ...init,
    headers: mergedHeaders,
  });

  if (response.status === 401) {
    const cloned = response.clone();
    try {
      const errBody = (await cloned.json()) as { code?: string; message?: string };
      if (
        errBody?.code === "PGRST303" ||
        errBody?.message?.toLowerCase().includes("jwt expired")
      ) {
        // Access token expired on server, force refresh and retry once
        const newToken = await refreshAdminSession();
        if (newToken) {
          const retryHeaders = {
            apikey: env.supabasePublishableKey,
            Authorization: `Bearer ${newToken}`,
            Accept: "application/json",
            ...(includeContentType ? { "Content-Type": "application/json" } : {}),
            ...(init.headers || {}),
          };
          response = await fetch(url, {
            ...init,
            headers: retryHeaders,
          });
        }
      }
    } catch {
      // Ignore JSON parse errors and return original response
    }
  }

  return response;
}

function getBaseUrl(): string {
  const url = env.supabaseUrl;
  if (!url) {
    throw new Error(
      "Missing VITE_SUPABASE_URL. Please configure environment variables."
    );
  }
  return url;
}

/**
 * Returns the accessible public URL for an image storage path or URL.
 * If path is already a full URL (http://, https://, blob:, data:), returns it as-is.
 * Otherwise, derives the public Supabase Storage URL for bucket 'homestay-images'.
 */
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

  const baseUrl = env.supabaseUrl;
  if (!baseUrl) return trimmed;

  const cleanPath = trimmed.replace(/^\/+/, "");
  return `${baseUrl}/storage/v1/object/public/${HOMESTAY_BUCKET}/${cleanPath}`;
}

/**
 * Transform database row to application IHomestayItem model.
 * Preserves price strictly as string and maps image_path to public URLs.
 * Sorts rooms and room images deterministically.
 */
export function mapDbHomestayToItem(dbRow: DbHomestay): IHomestayItem {
  const rawRooms = dbRow.homestay_rooms ?? [];

  // Sort rooms deterministically by sort_order asc, then id asc
  const sortedRooms = [...rawRooms].sort((a, b) => {
    const orderA = a.sort_order ?? 0;
    const orderB = b.sort_order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.id - b.id;
  });

  const rooms: HomestayRoom[] = sortedRooms.map((room) => {
    const rawImages = room.homestay_images ?? [];

    // Sort images deterministically by sort_order asc, then id asc
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
      priceText: room.price_text ?? null,
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

  // Collect all images across rooms for cards and fallback
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

  // Representative price:
  // If rooms exist, format first room's price using new fields if available, otherwise "Chưa cập nhật giá"
  const representativePrice = rooms.length > 0
    ? formatRoomPrice(rooms[0].priceAmount, rooms[0].priceUnit)
    : "Chưa cập nhật giá";

  // Representative image:
  const firstRoom = rooms[0];
  const firstRoomCover = firstRoom?.imageRecords.find((img) => img.isCover);
  const mainImage =
    firstRoomCover?.url ||
    (firstRoomCover ? getPublicImageUrl(firstRoomCover.imagePath) : null) ||
    detectedCoverUrl ||
    (firstRoom?.images && firstRoom.images.length > 0 ? firstRoom.images[0] : null) ||
    (allRoomImages.length > 0 ? allRoomImages[0] : "") ||
    "";

  // Aggregated images for backward compatibility
  const images = firstRoom?.images && firstRoom.images.length > 0 ? firstRoom.images : allRoomImages;

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

// ---------------------------------------------------------------------------
// Supabase Storage Operations
// ---------------------------------------------------------------------------

/**
 * Upload a single binary File to Supabase Storage in 'homestay-images' bucket.
 * Storage path convention: homestays/{homestayId}/{uniqueFileName}
 */
export async function uploadImageToStorage(
  file: File,
  homestayId: number
): Promise<{ path: string | null; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const sanitizeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${sanitizeName}`;
    const storagePath = `homestays/${homestayId}/${fileName}`;

    const uploadUrl = `${baseUrl}/storage/v1/object/${HOMESTAY_BUCKET}/${storagePath}`;

    const response = await adminFetch(
      uploadUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type || "image/jpeg",
          "x-upsert": "true",
        },
        body: file,
      },
      false
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[homestayService] Storage upload failed:", response.status, errBody);

      if (response.status === 404) {
        return {
          path: null,
          error: `Bucket '${HOMESTAY_BUCKET}' không tồn tại trên Supabase Storage. Vui lòng tạo public bucket '${HOMESTAY_BUCKET}' trên Supabase Dashboard.`,
        };
      }

      if (response.status === 401 || response.status === 403) {
        return {
          path: null,
          error: `Không có quyền upload ảnh vào Supabase Storage. Vui lòng kiểm tra phiên đăng nhập và RLS Policy cho bucket '${HOMESTAY_BUCKET}'.`,
        };
      }

      return {
        path: null,
        error: `Tải ảnh lên Supabase Storage thất bại. Vui lòng thử lại.`,
      };
    }

    return { path: storagePath, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi kết nối khi tải ảnh lên Storage.";
    return { path: null, error: message };
  }
}

/**
 * Delete specified storage paths from 'homestay-images' bucket.
 */
export async function deleteStorageFiles(
  paths: string[]
): Promise<{ success: boolean; error: string | null }> {
  const validPaths = paths.filter(
    (p) =>
      Boolean(p) &&
      !p.startsWith("http://") &&
      !p.startsWith("https://") &&
      !p.startsWith("blob:") &&
      !p.startsWith("data:")
  );

  if (validPaths.length === 0) {
    return { success: true, error: null };
  }

  try {
    const baseUrl = getBaseUrl();
    const deleteUrl = `${baseUrl}/storage/v1/object/${HOMESTAY_BUCKET}`;

    const response = await adminFetch(
      deleteUrl,
      {
        method: "DELETE",
        body: JSON.stringify({ prefixes: validPaths }),
      },
      true
    );

    if (!response.ok) {
      console.warn("[homestayService] Delete storage files failed:", response.status);
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    console.warn("[homestayService] Error deleting storage files:", err);
    return { success: false, error: "Lỗi xóa tệp từ Storage." };
  }
}

// ---------------------------------------------------------------------------
// Database Operations (Public Reads & Admin Writes)
// ---------------------------------------------------------------------------

/**
 * Fetch list of all homestays with their rooms and images in ONE single query.
 * PUBLIC OPERATION: Always uses public publishable headers (anon role).
 */
export async function getHomestays(): Promise<{
  data: IHomestayItem[];
  error: string | null;
}> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/rest/v1/homestays?select=*,homestay_rooms(*,homestay_images(*))&order=created_at.desc&homestay_rooms.order=sort_order.asc,id.asc&homestay_rooms.homestay_images.order=sort_order.asc,id.asc`;

    const response = await fetch(url, {
      method: "GET",
      headers: getPublicHeaders(false),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[homestayService] getHomestays failed:", response.status, errText);
      return {
        data: [],
        error: `Không thể tải danh sách homestay. Vui lòng thử lại.`,
      };
    }

    const rawData = (await response.json()) as DbHomestay[];
    const items = rawData.map(mapDbHomestayToItem);

    return { data: items, error: null };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Không thể kết nối đến máy chủ Supabase.";
    return { data: [], error: message };
  }
}

/**
 * Fetch a single homestay by ID with its rooms and images in ONE query.
 * PUBLIC OPERATION: Always uses public publishable headers (anon role).
 */
export async function getHomestayById(
  id: number
): Promise<{ data: IHomestayItem | null; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/rest/v1/homestays?id=eq.${id}&select=*,homestay_rooms(*,homestay_images(*))&homestay_rooms.order=sort_order.asc,id.asc&homestay_rooms.homestay_images.order=sort_order.asc,id.asc`;

    const response = await fetch(url, {
      method: "GET",
      headers: getPublicHeaders(false),
    });

    if (!response.ok) {
      return { data: null, error: `Không tìm thấy homestay #${id}.` };
    }

    const rawData = (await response.json()) as DbHomestay[];
    if (rawData.length === 0) {
      return { data: null, error: `Không tìm thấy homestay #${id}.` };
    }

    return { data: mapDbHomestayToItem(rawData[0]), error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi kết nối.";
    return { data: null, error: message };
  }
}

/**
 * Upload multiple files with bounded concurrency (default max 5 parallel uploads).
 * Calls onProgress callback after each completed file.
 */
export async function uploadFilesConcurrently(
  filesToUpload: { item: IRoomFormImageItem; file: File }[],
  homestayId: number,
  concurrencyLimit: number = 5,
  onProgress?: (completed: number, total: number) => void
): Promise<{
  successful: { item: IRoomFormImageItem; path: string }[];
  failed: { item: IRoomFormImageItem; error: string }[];
}> {
  const successful: { item: IRoomFormImageItem; path: string }[] = [];
  const failed: { item: IRoomFormImageItem; error: string }[] = [];
  let completedCount = 0;

  const executing: Promise<void>[] = [];

  for (const fileObj of filesToUpload) {
    const p = (async () => {
      const res = await uploadImageToStorage(fileObj.file, homestayId);
      if (res.path) {
        successful.push({ item: fileObj.item, path: res.path });
      } else {
        failed.push({ item: fileObj.item, error: res.error || "Upload failed" });
      }
      completedCount++;
      if (onProgress) {
        onProgress(completedCount, filesToUpload.length);
      }
    })();

    executing.push(p);

    if (executing.length >= concurrencyLimit) {
      await Promise.race(executing);
      for (let i = executing.length - 1; i >= 0; i--) {
        // Remove settled promises
      }
    }
  }

  await Promise.all(executing);

  return { successful, failed };
}

/**
 * Create a new homestay record with multiple room types, upload room images, and insert image metadata.
 * ADMIN OPERATION: Uses authenticated adminFetch.
 */
export async function createHomestay(
  formData: IHomestayFormData,
  onProgress?: (completed: number, total: number) => void
): Promise<{ data: IHomestayItem | null; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const rooms = formData.rooms || [];

    if (rooms.length === 0) {
      return {
        data: null,
        error: "Homestay phải có ít nhất một loại phòng.",
      };
    }

    // Validation: max 50 images per room
    for (const room of rooms) {
      const count = room.imageItems?.length || 0;
      if (count > 50) {
        return {
          data: null,
          error: `Loại phòng "${room.name}" vượt quá giới hạn 50 hình ảnh. Vui lòng giảm bớt ảnh trước khi tiếp tục.`,
        };
      }
    }

    // Count total files to upload across all rooms
    const allFilesToUpload: { roomIndex: number; item: IRoomFormImageItem; file: File }[] = [];
    rooms.forEach((room, roomIdx) => {
      (room.imageItems || []).forEach((item) => {
        if (item.file) {
          allFilesToUpload.push({ roomIndex: roomIdx, item, file: item.file });
        }
      });
    });

    // 1. Insert main homestay record (do not write new room prices to homestays.price)
    const homestayPayload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      description: formData.description?.trim() || null,
      price: null,
      google_maps_url: formData.googleMapsUrl?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const resHomestay = await adminFetch(
      `${baseUrl}/rest/v1/homestays`,
      {
        method: "POST",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(homestayPayload),
      },
      true
    );

    if (!resHomestay.ok) {
      const errBody = await resHomestay.text();
      console.error("[homestayService] createHomestay failed:", resHomestay.status, errBody);

      if (resHomestay.status === 401 || resHomestay.status === 403) {
        return {
          data: null,
          error: "Không có quyền tạo homestay. Vui lòng kiểm tra phiên đăng nhập quản trị viên.",
        };
      }

      return {
        data: null,
        error: "Không thể tạo homestay. Vui lòng thử lại.",
      };
    }

    const insertedRows = (await resHomestay.json()) as DbHomestay[];
    if (!insertedRows || insertedRows.length === 0) {
      return { data: null, error: "Tạo homestay thất bại, không nhận được dữ liệu phản hồi." };
    }

    const createdHomestay = insertedRows[0];
    const homestayId = createdHomestay.id;

    // Track all newly uploaded paths for rollback if an error occurs
    const allUploadedPaths: string[] = [];
    let uploadCounter = 0;

    // 2. Insert each room into homestay_rooms, upload images, and insert homestay_images
    for (let rIdx = 0; rIdx < rooms.length; rIdx++) {
      const room = rooms[rIdx];
      const roomPayload = {
        homestay_id: homestayId,
        name: room.name.trim() || `Room ${rIdx + 1}`,
        description: room.description?.trim() || null,
        price_amount:
          room.priceAmount !== undefined && room.priceAmount !== null && !isNaN(Number(room.priceAmount))
            ? Number(room.priceAmount)
            : null,
        price_unit: room.priceUnit || null,
        sort_order: room.sortOrder ?? (rIdx + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const resRoom = await adminFetch(
        `${baseUrl}/rest/v1/homestay_rooms`,
        {
          method: "POST",
          headers: {
            Prefer: "return=representation",
          },
          body: JSON.stringify(roomPayload),
        },
        true
      );

      if (!resRoom.ok) {
        console.error("[homestayService] createRoom failed:", resRoom.status);
        // Rollback created homestay and uploaded storage files
        if (allUploadedPaths.length > 0) {
          await deleteStorageFiles(allUploadedPaths);
        }
        await deleteHomestay(homestayId);
        return {
          data: null,
          error: `Không thể tạo loại phòng "${room.name}". Vui lòng thử lại.`,
        };
      }

      const insertedRoomRows = (await resRoom.json()) as DbHomestayRoom[];
      const createdRoom = insertedRoomRows[0];
      const roomId = createdRoom.id;

      // Filter files to upload for this room
      const roomImageItems = room.imageItems || [];
      const roomFiles = roomImageItems
        .filter((item): item is IRoomFormImageItem & { file: File } => Boolean(item.file))
        .map((item) => ({ item, file: item.file }));

      // Upload room images
      const uploadResult = await uploadFilesConcurrently(
        roomFiles,
        homestayId,
        5,
        () => {
          uploadCounter++;
          if (onProgress) {
            onProgress(uploadCounter, allFilesToUpload.length);
          }
        }
      );

      if (uploadResult.failed.length > 0) {
        const newlyUploaded = uploadResult.successful.map((s) => s.path);
        allUploadedPaths.push(...newlyUploaded);
        if (allUploadedPaths.length > 0) {
          await deleteStorageFiles(allUploadedPaths);
        }
        await deleteHomestay(homestayId);
        return {
          data: null,
          error: `Tải ảnh lên Supabase Storage thất bại cho loại phòng "${room.name}". Vui lòng thử lại.`,
        };
      }

      // Map uploaded paths back to items
      const uploadedMap = new Map<string, string>();
      uploadResult.successful.forEach(({ item, path }) => {
        uploadedMap.set(item.id, path);
        allUploadedPaths.push(path);
      });

      // Prepare homestay_images records to insert
      const imagesPayload: {
        homestay_id: number;
        room_id: number;
        image_path: string;
        sort_order: number;
        is_cover: boolean;
      }[] = [];

      roomImageItems.forEach((item, imgIdx) => {
        let storagePath = uploadedMap.get(item.id) || item.imagePath;
        if (!storagePath && !item.url.startsWith("blob:")) {
          storagePath = item.url;
        }

        if (storagePath) {
          imagesPayload.push({
            homestay_id: homestayId,
            room_id: roomId,
            image_path: storagePath,
            sort_order: item.sortOrder ?? (imgIdx + 1),
            is_cover: Boolean(item.isCover),
          });
        }
      });

      if (imagesPayload.length > 0) {
        const resImg = await adminFetch(
          `${baseUrl}/rest/v1/homestay_images`,
          {
            method: "POST",
            body: JSON.stringify(imagesPayload),
          },
          true
        );

        if (!resImg.ok) {
          console.warn("[homestayService] failed to insert homestay_images metadata:", resImg.status);
        }
      }
    }

    // 3. Return fresh record via public read
    const freshResult = await getHomestayById(homestayId);
    return {
      data: freshResult.data ?? mapDbHomestayToItem(createdHomestay),
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi tạo homestay.";
    return { data: null, error: message };
  }
}

/**
 * Update an existing homestay record, update/insert/delete rooms, and sync room images with Supabase Storage.
 * ADMIN OPERATION: Uses authenticated adminFetch.
 */
export async function updateHomestay(
  id: number,
  formData: IHomestayFormData,
  existingHomestay: IHomestayItem,
  onProgress?: (completed: number, total: number) => void
): Promise<{ data: IHomestayItem | null; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const rooms = formData.rooms || [];

    if (rooms.length === 0) {
      return {
        data: null,
        error: "Homestay phải có ít nhất một loại phòng.",
      };
    }

    // Validation: max 50 images per room
    for (const room of rooms) {
      const count = room.imageItems?.length || 0;
      if (count > 50) {
        return {
          data: null,
          error: `Loại phòng "${room.name}" vượt quá giới hạn 50 hình ảnh. Vui lòng giảm bớt ảnh trước khi tiếp tục.`,
        };
      }
    }

    // 1. Update main homestay record (leave homestays.price unchanged in DB)
    const homestayPayload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      description: formData.description?.trim() || null,
      google_maps_url: formData.googleMapsUrl?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const resHomestay = await adminFetch(
      `${baseUrl}/rest/v1/homestays?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          Prefer: "return=representation",
        },
        body: JSON.stringify(homestayPayload),
      },
      true
    );

    if (!resHomestay.ok) {
      const errBody = await resHomestay.text();
      console.error("[homestayService] updateHomestay failed:", resHomestay.status, errBody);

      if (resHomestay.status === 401 || resHomestay.status === 403) {
        return {
          data: null,
          error: "Không có quyền cập nhật homestay. Vui lòng kiểm tra phiên đăng nhập quản trị viên.",
        };
      }

      return { data: null, error: "Không thể cập nhật homestay. Vui lòng thử lại." };
    }

    // Count total files to upload across all rooms
    const allFilesToUpload: { roomIndex: number; item: IRoomFormImageItem; file: File }[] = [];
    rooms.forEach((room, roomIdx) => {
      (room.imageItems || []).forEach((item) => {
        if (item.file) {
          allFilesToUpload.push({ roomIndex: roomIdx, item, file: item.file });
        }
      });
    });

    let uploadCounter = 0;

    // 2. Identify and handle deleted rooms
    const existingRooms = existingHomestay.rooms || [];
    const submittedRoomIds = new Set(
      rooms.map((r) => r.id).filter((rid): rid is number => typeof rid === "number")
    );

    const roomsToDelete = existingRooms.filter((er) => !submittedRoomIds.has(er.id));
    for (const rToDelete of roomsToDelete) {
      // Collect storage files belonging to this room
      const pathsToDelete = (rToDelete.imageRecords || []).map((img) => img.imagePath);

      // Delete image metadata
      await adminFetch(
        `${baseUrl}/rest/v1/homestay_images?room_id=eq.${rToDelete.id}`,
        { method: "DELETE" },
        false
      );

      // Clean up Storage objects
      if (pathsToDelete.length > 0) {
        await deleteStorageFiles(pathsToDelete);
      }

      // Delete room record
      await adminFetch(
        `${baseUrl}/rest/v1/homestay_rooms?id=eq.${rToDelete.id}`,
        { method: "DELETE" },
        false
      );
    }

    // 3. Process each room in submitted formData.rooms
    for (let rIdx = 0; rIdx < rooms.length; rIdx++) {
      const room = rooms[rIdx];
      let roomId = room.id;

      if (roomId) {
        // Existing room -> update metadata
        const updateRoomPayload = {
          name: room.name.trim() || `Room ${rIdx + 1}`,
          description: room.description?.trim() || null,
          price_amount:
            room.priceAmount !== undefined && room.priceAmount !== null && !isNaN(Number(room.priceAmount))
              ? Number(room.priceAmount)
              : null,
          price_unit: room.priceUnit || null,
          sort_order: room.sortOrder ?? (rIdx + 1),
          updated_at: new Date().toISOString(),
        };

        await adminFetch(
          `${baseUrl}/rest/v1/homestay_rooms?id=eq.${roomId}`,
          {
            method: "PATCH",
            body: JSON.stringify(updateRoomPayload),
          },
          true
        );
      } else {
        // Newly added room -> insert
        const newRoomPayload = {
          homestay_id: id,
          name: room.name.trim() || `Room ${rIdx + 1}`,
          description: room.description?.trim() || null,
          price_amount:
            room.priceAmount !== undefined && room.priceAmount !== null && !isNaN(Number(room.priceAmount))
              ? Number(room.priceAmount)
              : null,
          price_unit: room.priceUnit || null,
          sort_order: room.sortOrder ?? (rIdx + 1),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const resNewRoom = await adminFetch(
          `${baseUrl}/rest/v1/homestay_rooms`,
          {
            method: "POST",
            headers: {
              Prefer: "return=representation",
            },
            body: JSON.stringify(newRoomPayload),
          },
          true
        );

        if (!resNewRoom.ok) {
          console.error("[homestayService] failed to insert new room:", resNewRoom.status);
          continue;
        }

        const insertedRoomRows = (await resNewRoom.json()) as DbHomestayRoom[];
        roomId = insertedRoomRows[0].id;
      }

      if (!roomId) continue;

      // Handle images for this room
      const existingRoomData = existingRooms.find((er) => er.id === roomId);
      const existingImgs = existingRoomData?.imageRecords || [];

      const roomImageItems = room.imageItems || [];

      // A. Upload newly added File objects for this room
      const filesToUpload = roomImageItems
        .filter((item): item is IRoomFormImageItem & { file: File } => Boolean(item.file))
        .map((item) => ({ item, file: item.file }));

      const uploadResult = await uploadFilesConcurrently(
        filesToUpload,
        id,
        5,
        () => {
          uploadCounter++;
          if (onProgress) {
            onProgress(uploadCounter, allFilesToUpload.length);
          }
        }
      );

      if (uploadResult.failed.length > 0) {
        // Clean up newly uploaded files
        const newPathsToClean = uploadResult.successful.map((s) => s.path);
        if (newPathsToClean.length > 0) {
          await deleteStorageFiles(newPathsToClean);
        }

        return {
          data: null,
          error: `Tải ảnh mới lên Supabase Storage thất bại cho loại phòng "${room.name}". Các ảnh cũ được giữ nguyên. Vui lòng thử lại.`,
        };
      }

      const uploadedMap = new Map<string, string>();
      uploadResult.successful.forEach(({ item, path }) => {
        uploadedMap.set(item.id, path);
      });

      // B. Identify removed images from this room
      const submittedImageIds = new Set(
        roomImageItems.map((item) => item.imageId).filter((iid): iid is number => typeof iid === "number")
      );

      const keptPathsOrUrls = new Set(
        roomImageItems
          .map((item) => item.imagePath || item.url)
          .filter((p): p is string => Boolean(p) && !p.startsWith("blob:"))
      );

      const imagesToDelete = existingImgs.filter((rec) => {
        if (submittedImageIds.has(rec.id)) return false;
        if (keptPathsOrUrls.has(rec.imagePath) || (rec.url && keptPathsOrUrls.has(rec.url))) return false;
        return true;
      });

      if (imagesToDelete.length > 0) {
        const deleteIds = imagesToDelete.map((img) => img.id);
        await adminFetch(
          `${baseUrl}/rest/v1/homestay_images?id=in.(${deleteIds.join(",")})`,
          { method: "DELETE" },
          false
        );

        const storagePathsToDelete = imagesToDelete.map((img) => img.imagePath);
        await deleteStorageFiles(storagePathsToDelete);
      }

      // C. Insert newly uploaded images into homestay_images
      const newImagesPayload: {
        homestay_id: number;
        room_id: number;
        image_path: string;
        sort_order: number;
        is_cover: boolean;
      }[] = [];

      for (let imgIdx = 0; imgIdx < roomImageItems.length; imgIdx++) {
        const item = roomImageItems[imgIdx];
        const newStoragePath = uploadedMap.get(item.id);

        if (newStoragePath) {
          newImagesPayload.push({
            homestay_id: id,
            room_id: roomId,
            image_path: newStoragePath,
            sort_order: item.sortOrder ?? (imgIdx + 1),
            is_cover: Boolean(item.isCover),
          });
        } else if (item.imageId) {
          // Existing image: update sort_order & is_cover if changed
          const existingRec = existingImgs.find((img) => img.id === item.imageId);
          const newOrder = item.sortOrder ?? (imgIdx + 1);
          const newCover = Boolean(item.isCover);

          if (existingRec && (existingRec.sortOrder !== newOrder || existingRec.isCover !== newCover)) {
            await adminFetch(
              `${baseUrl}/rest/v1/homestay_images?id=eq.${item.imageId}`,
              {
                method: "PATCH",
                body: JSON.stringify({
                  sort_order: newOrder,
                  is_cover: newCover,
                }),
              },
              true
            );
          }
        }
      }

      if (newImagesPayload.length > 0) {
        await adminFetch(
          `${baseUrl}/rest/v1/homestay_images`,
          {
            method: "POST",
            body: JSON.stringify(newImagesPayload),
          },
          true
        );
      }
    }

    // 4. Return fresh record via public read
    const fresh = await getHomestayById(id);
    return {
      data: fresh.data,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi cập nhật homestay.";
    return { data: null, error: message };
  }
}

/**
 * Delete a homestay from public.homestays, metadata in homestay_rooms and homestay_images, and Storage.
 * ADMIN OPERATION: Uses authenticated adminFetch.
 */
export async function deleteHomestay(
  id: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();

    // 1. Get existing homestay record to collect all storage paths to clean up
    const existing = await getHomestayById(id);
    const rooms = existing.data?.rooms || [];

    const storagePathsToDelete: string[] = [];
    rooms.forEach((r) => {
      (r.imageRecords || []).forEach((img) => {
        if (img.imagePath) {
          storagePathsToDelete.push(img.imagePath);
        }
      });
    });

    // 2. Delete all image records for this homestay
    const roomIds = rooms.map((r) => r.id);
    if (roomIds.length > 0) {
      await adminFetch(
        `${baseUrl}/rest/v1/homestay_images?room_id=in.(${roomIds.join(",")})`,
        { method: "DELETE" },
        false
      );
    }

    // Also delete any images referencing homestay_id directly
    await adminFetch(
      `${baseUrl}/rest/v1/homestay_images?homestay_id=eq.${id}`,
      { method: "DELETE" },
      false
    );

    // 3. Delete files from Supabase Storage
    if (storagePathsToDelete.length > 0) {
      await deleteStorageFiles(storagePathsToDelete);
    }

    // 4. Delete all rooms belonging to this homestay
    await adminFetch(
      `${baseUrl}/rest/v1/homestay_rooms?homestay_id=eq.${id}`,
      { method: "DELETE" },
      false
    );

    // 5. Delete main homestay record
    const deleteHomestayUrl = `${baseUrl}/rest/v1/homestays?id=eq.${id}`;
    const response = await adminFetch(
      deleteHomestayUrl,
      { method: "DELETE" },
      false
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[homestayService] deleteHomestay failed:", response.status, errText);

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: "Không có quyền xóa homestay. Vui lòng kiểm tra phiên đăng nhập quản trị viên.",
        };
      }

      return {
        success: false,
        error: "Xóa homestay thất bại. Vui lòng thử lại.",
      };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi xóa homestay.";
    return { success: false, error: message };
  }
}
