import type React from "react";
import { useNotification, type HttpError } from "@refinedev/core";
import {
  HTTP_ERROR_FORBIDDEN,
  HTTP_ERROR_INTERNAL,
  HTTP_ERROR_PAGE_NOT_FOUND,
  HTTP_ERROR_UNAUTHORIZED,
  HTTP_ERROR_BAD_REQUEST,
} from "@/constants/httpMessages";

/**
 * Expected shape of an error response body returned by the API
 */
export interface ErrorResponseBody {
  errors?: Record<string, string | null> | null;
  error?: string;
  message?: string;
  msg?: string;
}

function extractStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }
  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }
  if (
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "status" in error.response &&
    typeof error.response.status === "number"
  ) {
    return error.response.status;
  }
  return undefined;
}

async function extractErrorBody(
  error: unknown,
): Promise<ErrorResponseBody | null> {
  if (typeof error !== "object" || error === null) return null;

  // 1. If error is Response or has json() method
  if (
    "json" in error &&
    typeof (error as { json: unknown }).json === "function"
  ) {
    try {
      const parsed = await (error as { json: () => Promise<unknown> }).json();
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as ErrorResponseBody;
      }
    } catch {
      // ignore
    }
  }

  // 2. If error has body property (from normalizeFetchErrorResponse)
  if (
    "body" in error &&
    typeof (error as { body: unknown }).body === "object" &&
    (error as { body: unknown }).body !== null
  ) {
    return (error as { body: ErrorResponseBody }).body;
  }

  // 3. If error has response.data property (axios-like)
  if (
    "response" in error &&
    typeof (error as { response: unknown }).response === "object" &&
    (error as { response: unknown }).response !== null &&
    "data" in (error as { response: { data?: unknown } }).response &&
    typeof (error as { response: { data?: unknown } }).response.data ===
      "object" &&
    (error as { response: { data?: unknown } }).response.data !== null
  ) {
    return (error as { response: { data: ErrorResponseBody } }).response.data;
  }

  // 4. If error itself has error, message, or msg fields
  if ("error" in error || "message" in error || "msg" in error) {
    return error as ErrorResponseBody;
  }

  return null;
}

export const useCustomOpenNotification = () => {
  const { open } = useNotification();

  const showSuccess = (message: string) => {
    open?.({
      type: "success",
      message,
    });
  };

  const showError = (message: string) => {
    open?.({
      type: "error",
      message,
    });
  };

  const handleShowError = async (
    error: HttpError | unknown,
    fallbackMessage?: string,
    setErrorValidate?: React.Dispatch<
      React.SetStateAction<Record<string, string | null> | null>
    >,
  ) => {
    if (typeof error === "string") {
      showError(error);
      return;
    }

    const status = extractStatus(error);
    const body = await extractErrorBody(error);

    if (body?.errors && setErrorValidate) {
      setErrorValidate(body.errors);
      return;
    }

    const apiMessage = body?.error || body?.message || body?.msg;

    // Lỗi 500 hoặc server error (>= 500): Hiển thị fallback message trên FE (ví dụ "Cập nhật lịch trình thất bại")
    if (status !== undefined && status >= 500) {
      showError(fallbackMessage || HTTP_ERROR_INTERNAL);
      return;
    }

    // Các lỗi 401, 403, 404
    if (status === 401) {
      showError(apiMessage || HTTP_ERROR_UNAUTHORIZED);
      return;
    }

    if (status === 403) {
      showError(apiMessage || HTTP_ERROR_FORBIDDEN);
      return;
    }

    if (status === 404) {
      showError(apiMessage || HTTP_ERROR_PAGE_NOT_FOUND);
      return;
    }

    // Lỗi 400 hoặc 4xx khác: Ưu tiên hiển thị message từ API trả về
    if (status === 400 || (status !== undefined && status >= 400 && status < 500)) {
      showError(apiMessage || fallbackMessage || HTTP_ERROR_BAD_REQUEST);
      return;
    }

    // Trường hợp không xác định được mã lỗi
    showError(apiMessage || fallbackMessage || HTTP_ERROR_INTERNAL);
  };

  return { showSuccess, showError, handleShowError };
};

export default useCustomOpenNotification;
