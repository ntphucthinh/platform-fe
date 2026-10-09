/**
 * homestayService — Supabase REST API and Supabase Storage service
 * for homestays and homestay_images.
 *
 * Bucket name: "homestay-images"
 * Storage path convention: homestays/{homestayId}/{uniqueFileName}
 */

import { env } from "@/config/env";
import { getStoredToken } from "@/utils/auth";
import type {
  IHomestayItem,
  IHomestayFormData,
  IHomestayFormImageItem,
  HomestayImage,
} from "@/types/pages/homestay/homestay";

// ---------------------------------------------------------------------------
// Constants & Internal Interfaces
// ---------------------------------------------------------------------------

export const HOMESTAY_BUCKET = "homestay-images";

export interface DbHomestayImage {
  id: number;
  homestay_id: number;
  image_path: string;
  created_at: string;
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
  homestay_images?: DbHomestayImage[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHeaders(includeContentType = true): Record<string, string> {
  const apiKey = env.supabasePublishableKey;
  const token = getStoredToken();

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
 */
export function mapDbHomestayToItem(dbRow: DbHomestay): IHomestayItem {
  const rawImages = dbRow.homestay_images ?? [];
  const imageRecords: HomestayImage[] = rawImages.map((img) => ({
    id: img.id,
    homestayId: img.homestay_id,
    imagePath: img.image_path,
    createdAt: img.created_at,
  }));

  const images = imageRecords
    .map((img) => getPublicImageUrl(img.imagePath))
    .filter((url): url is string => Boolean(url && url.trim().length > 0));

  return {
    id: dbRow.id,
    name: dbRow.name ?? "",
    address: dbRow.address ?? "",
    location: dbRow.address ?? "",
    description: dbRow.description ?? null,
    price: dbRow.price ?? null,
    googleMapsUrl: dbRow.google_maps_url ?? null,
    googleMapLink: dbRow.google_maps_url ?? null,
    images,
    imageRecords,
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

    const apiKey = env.supabasePublishableKey;
    const token = getStoredToken();

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: apiKey,
        Authorization: token ? `Bearer ${token}` : `Bearer ${apiKey}`,
        "Content-Type": file.type || "image/jpeg",
        "x-upsert": "true",
      },
      body: file,
    });

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
          error: `Không có quyền upload ảnh vào Supabase Storage (mã ${response.status}). Vui lòng kiểm tra RLS Policy cho bucket '${HOMESTAY_BUCKET}'.`,
        };
      }

      return {
        path: null,
        error: `Tải ảnh lên Supabase Storage thất bại (mã ${response.status}).`,
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
    const apiKey = env.supabasePublishableKey;
    const token = getStoredToken();

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        apikey: apiKey,
        Authorization: token ? `Bearer ${token}` : `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prefixes: validPaths }),
    });

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
// Database Operations
// ---------------------------------------------------------------------------

/**
 * Fetch list of all homestays with their associated images.
 */
export async function getHomestays(): Promise<{
  data: IHomestayItem[];
  error: string | null;
}> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/rest/v1/homestays?select=*,homestay_images(*)&order=created_at.desc`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(false),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[homestayService] getHomestays failed:", response.status, errText);
      return {
        data: [],
        error: `Không thể tải danh sách homestay (mã lỗi ${response.status}).`,
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
 * Fetch a single homestay by ID with its associated images.
 */
export async function getHomestayById(
  id: number
): Promise<{ data: IHomestayItem | null; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/rest/v1/homestays?id=eq.${id}&select=*,homestay_images(*)`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(false),
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
  filesToUpload: { item: IHomestayFormImageItem; file: File }[],
  homestayId: number,
  concurrencyLimit: number = 5,
  onProgress?: (completed: number, total: number) => void
): Promise<{
  successful: { item: IHomestayFormImageItem; path: string }[];
  failed: { item: IHomestayFormImageItem; error: string }[];
}> {
  const successful: { item: IHomestayFormImageItem; path: string }[] = [];
  const failed: { item: IHomestayFormImageItem; error: string }[] = [];
  let completedCount = 0;
  const total = filesToUpload.length;

  if (total === 0) {
    return { successful, failed };
  }

  let index = 0;

  async function worker() {
    while (index < filesToUpload.length) {
      const currentIdx = index++;
      const { item, file } = filesToUpload[currentIdx];

      const res = await uploadImageToStorage(file, homestayId);
      completedCount++;
      if (onProgress) {
        onProgress(completedCount, total);
      }

      if (res.error || !res.path) {
        failed.push({ item, error: res.error || `Tải ảnh ${file.name} thất bại.` });
      } else {
        successful.push({ item, path: res.path });
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrencyLimit, total) }, () => worker());
  await Promise.all(workers);

  return { successful, failed };
}

/**
 * Create a new homestay record, upload images to Supabase Storage, and insert image metadata.
 */
export async function createHomestay(
  formData: IHomestayFormData,
  onProgress?: (completed: number, total: number) => void
): Promise<{ data: IHomestayItem | null; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const imageItems: IHomestayFormImageItem[] = formData.imageItems || [];

    // Validation: max 50 images per homestay
    if (imageItems.length > 50) {
      return {
        data: null,
        error: "Homestay chỉ được phép có tối đa 50 hình ảnh. Vui lòng giảm số lượng ảnh trước khi tiếp tục.",
      };
    }

    // 1. Insert main homestay record
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      description: formData.description?.trim() || null,
      price: formData.price?.trim() || null,
      google_maps_url: formData.googleMapsUrl?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const headers = getHeaders(true);
    headers["Prefer"] = "return=representation";

    const response = await fetch(`${baseUrl}/rest/v1/homestays`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[homestayService] createHomestay failed:", response.status, errBody);

      if (response.status === 401 || response.status === 403) {
        return {
          data: null,
          error:
            "Không có quyền tạo homestay. Vui lòng kiểm tra RLS Policy trên Supabase cho bảng homestays.",
        };
      }

      return {
        data: null,
        error: `Không thể tạo homestay (mã lỗi ${response.status}).`,
      };
    }

    const insertedRows = (await response.json()) as DbHomestay[];
    if (!insertedRows || insertedRows.length === 0) {
      return { data: null, error: "Tạo homestay thất bại, không nhận được dữ liệu phản hồi." };
    }

    const createdHomestay = insertedRows[0];
    const homestayId = createdHomestay.id;

    // 2. Separate items with File objects for bounded concurrent uploading
    const filesToUpload = imageItems
      .filter((item): item is IHomestayFormImageItem & { file: File } => Boolean(item.file))
      .map((item) => ({ item, file: item.file }));

    const existingPaths = imageItems
      .filter((item) => !item.file && item.imagePath && !item.imagePath.startsWith("blob:"))
      .map((item) => item.imagePath as string);

    // Perform bulk upload with max 5 concurrent requests
    const uploadResult = await uploadFilesConcurrently(filesToUpload, homestayId, 5, onProgress);

    // If any upload fails during creation, clean up newly uploaded files & delete created homestay
    if (uploadResult.failed.length > 0) {
      const successfulPaths = uploadResult.successful.map((s) => s.path);
      if (successfulPaths.length > 0) {
        await deleteStorageFiles(successfulPaths);
      }
      await deleteHomestay(homestayId);

      return {
        data: null,
        error: `Tải ảnh lên Supabase Storage thất bại cho ${uploadResult.failed.length}/${filesToUpload.length} tệp. Vui lòng thử lại.`,
      };
    }

    const allPathsToInsert = [
      ...existingPaths,
      ...uploadResult.successful.map((s) => s.path),
    ];

    // Fallback: check string array if imageItems wasn't provided
    if (allPathsToInsert.length === 0 && formData.images && formData.images.length > 0) {
      for (const url of formData.images) {
        if (url && !url.startsWith("blob:")) {
          allPathsToInsert.push(url);
        }
      }
    }

    // 3. Insert valid non-blob image paths into public.homestay_images
    if (allPathsToInsert.length > 0) {
      const imagesPayload = allPathsToInsert.map((path) => ({
        homestay_id: homestayId,
        image_path: path,
      }));

      const imagesUrl = `${baseUrl}/rest/v1/homestay_images`;
      const imgRes = await fetch(imagesUrl, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(imagesPayload),
      });

      if (!imgRes.ok) {
        console.warn("[homestayService] failed to insert homestay_images metadata:", imgRes.status);
      }
    }

    // 4. Return fresh record
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
 * Update an existing homestay record, upload new images, and sync storage + metadata.
 */
export async function updateHomestay(
  id: number,
  formData: IHomestayFormData,
  existingImageRecords: HomestayImage[] = [],
  onProgress?: (completed: number, total: number) => void
): Promise<{ data: IHomestayItem | null; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();
    const imageItems: IHomestayFormImageItem[] = formData.imageItems || [];

    // Validation: max 50 images per homestay
    if (imageItems.length > 50) {
      return {
        data: null,
        error: "Homestay chỉ được phép có tối đa 50 hình ảnh. Vui lòng giảm số lượng ảnh trước khi tiếp tục.",
      };
    }

    // 1. Update main homestay record
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      description: formData.description?.trim() || null,
      price: formData.price?.trim() || null,
      google_maps_url: formData.googleMapsUrl?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const headers = getHeaders(true);
    headers["Prefer"] = "return=representation";

    const response = await fetch(`${baseUrl}/rest/v1/homestays?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[homestayService] updateHomestay failed:", response.status, errBody);

      if (response.status === 401 || response.status === 403) {
        return {
          data: null,
          error:
            "Không có quyền cập nhật homestay. Vui lòng kiểm tra RLS Policy trên Supabase cho bảng homestays.",
        };
      }

      return { data: null, error: `Không thể cập nhật homestay (${response.status}).` };
    }

    // 2. Upload newly added File objects with concurrency = 5
    const filesToUpload = imageItems
      .filter((item): item is IHomestayFormImageItem & { file: File } => Boolean(item.file))
      .map((item) => ({ item, file: item.file }));

    const uploadResult = await uploadFilesConcurrently(filesToUpload, id, 5, onProgress);

    // If any new upload fails, preserve existing images intact and report error without deleting existing images!
    if (uploadResult.failed.length > 0) {
      const newPathsToClean = uploadResult.successful.map((s) => s.path);
      if (newPathsToClean.length > 0) {
        await deleteStorageFiles(newPathsToClean);
      }

      return {
        data: null,
        error: `Tải ảnh mới lên Supabase Storage thất bại cho ${uploadResult.failed.length}/${filesToUpload.length} tệp. Các ảnh cũ được giữ nguyên. Vui lòng thử lại.`,
      };
    }

    const newStoragePathsToInsert = uploadResult.successful.map((s) => s.path);

    // Determine kept image paths / URLs
    const keptPaths = imageItems
      .map((item) => item.imagePath || item.url)
      .filter((p): p is string => Boolean(p) && !p.startsWith("blob:"));

    const formDataImagesClean = (formData.images || []).filter(
      (img) => Boolean(img) && !img.startsWith("blob:")
    );

    // Identify existing records explicitly removed by the user
    const recordsToDelete = existingImageRecords.filter((rec) => {
      const publicUrl = getPublicImageUrl(rec.imagePath);
      const isKept =
        keptPaths.includes(rec.imagePath) ||
        keptPaths.includes(publicUrl) ||
        formDataImagesClean.includes(rec.imagePath) ||
        formDataImagesClean.includes(publicUrl);
      return !isKept;
    });

    // Delete removed image records from public.homestay_images
    if (recordsToDelete.length > 0) {
      const deleteIds = recordsToDelete.map((r) => r.id);
      const deleteDbUrl = `${baseUrl}/rest/v1/homestay_images?id=in.(${deleteIds.join(",")})`;
      await fetch(deleteDbUrl, {
        method: "DELETE",
        headers: getHeaders(false),
      });

      // Delete corresponding storage files from Supabase Storage
      const storagePathsToDelete = recordsToDelete.map((r) => r.imagePath);
      await deleteStorageFiles(storagePathsToDelete);
    }

    // Insert newly uploaded storage paths into public.homestay_images
    if (newStoragePathsToInsert.length > 0) {
      const addPayload = newStoragePathsToInsert.map((path) => ({
        homestay_id: id,
        image_path: path,
      }));
      const addUrl = `${baseUrl}/rest/v1/homestay_images`;
      await fetch(addUrl, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(addPayload),
      });
    }

    // 3. Return fresh record
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
 * Delete a homestay from public.homestays, metadata, and Storage.
 */
export async function deleteHomestay(
  id: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const baseUrl = getBaseUrl();

    // 1. Get existing image records to clean up Storage files
    const existing = await getHomestayById(id);
    const imageRecords = existing.data?.imageRecords || [];

    // 2. Delete image records from public.homestay_images
    const deleteImagesUrl = `${baseUrl}/rest/v1/homestay_images?homestay_id=eq.${id}`;
    await fetch(deleteImagesUrl, {
      method: "DELETE",
      headers: getHeaders(false),
    });

    // 3. Delete files from Supabase Storage
    if (imageRecords.length > 0) {
      const pathsToDelete = imageRecords.map((r) => r.imagePath);
      await deleteStorageFiles(pathsToDelete);
    }

    // 4. Delete main homestay record
    const deleteHomestayUrl = `${baseUrl}/rest/v1/homestays?id=eq.${id}`;
    const response = await fetch(deleteHomestayUrl, {
      method: "DELETE",
      headers: getHeaders(false),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[homestayService] deleteHomestay failed:", response.status, errText);

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error:
            "Không có quyền xóa homestay. Vui lòng kiểm tra RLS Policy trên Supabase cho bảng homestays.",
        };
      }

      return {
        success: false,
        error: `Xóa homestay thất bại (${response.status}).`,
      };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi xóa homestay.";
    return { success: false, error: message };
  }
}
