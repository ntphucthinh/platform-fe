import { useState, useCallback } from "react";
import { fetcher } from "@/utils/fetchUtils";

export interface UploadFileResult {
  path: string | null;
  url?: string | null;
  error: string | null;
}

export interface UploadBatchItem<T = unknown> {
  item: T;
  file: File;
}

export interface UploadBatchResult<T = unknown> {
  successful: { item: T; path: string; url?: string }[];
  failed: { item: T; error: string }[];
}

export interface UseUploadFileResult {
  uploadFile: (file: File, folder?: string) => Promise<UploadFileResult>;
  uploadBatch: <T = unknown>(
    filesToUpload: UploadBatchItem<T>[],
    folder?: string,
    concurrencyLimit?: number,
    onProgress?: (completed: number, total: number) => void,
  ) => Promise<UploadBatchResult<T>>;
  deleteFiles: (
    paths: string[],
  ) => Promise<{ success: boolean; error: string | null }>;
  isUploading: boolean;
  uploadError: string | null;
}

/**
 * Common custom hook for file and image uploads to backend storage.
 * Can be reused across modules (homestays, avatars, attachments, etc.).
 */
export function useUploadFile(): UseUploadFileResult {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Upload a single file to storage via POST /uploads.
   */
  const uploadFile = useCallback(
    async (file: File, folder = "homestays"): Promise<UploadFileResult> => {
      setIsUploading(true);
      setUploadError(null);
      try {
        const formData = new FormData();
        formData.append("folder", folder);
        formData.append("files", file, file.name);

        const response = await fetcher("/uploads", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const msg = `Tải tệp lên máy chủ thất bại (${response.status}). Vui lòng thử lại.`;
          setUploadError(msg);
          return { path: null, url: null, error: msg };
        }

        const body = (await response.json()) as {
          data?: { fileName: string; path: string; url: string }[];
        };

        if (!body.data || body.data.length === 0) {
          const msg = "Phản hồi upload không hợp lệ.";
          setUploadError(msg);
          return { path: null, url: null, error: msg };
        }

        const uploaded = body.data[0];
        return { path: uploaded.path, url: uploaded.url, error: null };
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Lỗi kết nối khi tải tệp lên.";
        setUploadError(message);
        return { path: null, url: null, error: message };
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  /**
   * Upload multiple files concurrently with concurrency limit and progress tracking.
   */
  const uploadBatch = useCallback(
    async <T = unknown>(
      filesToUpload: UploadBatchItem<T>[],
      folder = "homestays",
      concurrencyLimit = 3,
      onProgress?: (completed: number, total: number) => void,
    ): Promise<UploadBatchResult<T>> => {
      if (filesToUpload.length === 0) {
        return { successful: [], failed: [] };
      }

      setIsUploading(true);
      setUploadError(null);

      const successful: { item: T; path: string; url?: string }[] = [];
      const failed: { item: T; error: string }[] = [];
      let completedCount = 0;

      const queue = [...filesToUpload];
      const workers = Array.from(
        { length: Math.min(concurrencyLimit, queue.length) },
        async () => {
          while (queue.length > 0) {
            const fileObj = queue.shift();
            if (!fileObj) break;

            const res = await uploadFile(fileObj.file, folder);
            if (res.path) {
              successful.push({
                item: fileObj.item,
                path: res.path,
                url: res.url ?? undefined,
              });
            } else {
              failed.push({
                item: fileObj.item,
                error: res.error || "Upload failed",
              });
            }

            completedCount++;
            if (onProgress) {
              onProgress(completedCount, filesToUpload.length);
            }
          }
        },
      );

      try {
        await Promise.all(workers);
      } finally {
        setIsUploading(false);
      }

      return { successful, failed };
    },
    [uploadFile],
  );

  /**
   * Delete storage files via DELETE /uploads.
   */
  const deleteFiles = useCallback(
    async (
      paths: string[],
    ): Promise<{ success: boolean; error: string | null }> => {
      const validPaths = paths.filter(
        (p) =>
          Boolean(p) &&
          !p.startsWith("http://") &&
          !p.startsWith("https://") &&
          !p.startsWith("blob:") &&
          !p.startsWith("data:"),
      );

      if (validPaths.length === 0) {
        return { success: true, error: null };
      }

      try {
        const deletePayload = validPaths.map((p) => ({
          path: p,
          resourceType: "image",
        }));

        await fetcher("/uploads", {
          method: "DELETE",
          body: JSON.stringify(deletePayload),
        });

        return { success: true, error: null };
      } catch (err: unknown) {
        console.warn("Error deleting uploads:", err);
        return { success: false, error: "Lỗi xóa tệp từ máy chủ." };
      }
    },
    [],
  );

  return {
    uploadFile,
    uploadBatch,
    deleteFiles,
    isUploading,
    uploadError,
  };
}

