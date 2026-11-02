import { HttpStatusCode } from "@/constants/httpConstant";

/** Expected format of an error response received from API calls such as save operations */
interface RawErrorBody {
  message?: string;
  error?: string;
}

/** Error normalized to Refine's HttpError format */
export interface NormalizedFetchError {
  message: string;
  statusCode: number;
  body: unknown;
}

/** Determine whether the JSON parse result can be interpreted as a RawErrorBody (by accepting external input as `unknown` and then narrowing it) */
function isRawErrorBody(value: unknown): value is RawErrorBody {
  return typeof value === "object" && value !== null;
}

/**
 * Normalizes a fetch Response into the HttpError format (message/statusCode/body) expected by refine.
 * If the methods in dataProvider.ts were to throw a raw Response object, refine's
 * automatic error notification system would be unable to access `error.statusCode`
 * or `error.message`, resulting in a generic, uninformative toast notification
 * like "Error (status code: undefined)." Therefore, all methods must pass
 * the response through this helper before throwing an error.
 */
export async function normalizeFetchErrorResponse(
  response: Response,
): Promise<NormalizedFetchError> {
  let errorResponse: RawErrorBody = {};
  try {
    const parsed: unknown = await response.json();
    errorResponse = isRawErrorBody(parsed) ? parsed : {};
  } catch {
    // Fall back to default text if the body is not JSON or is empty
  }

  return {
    message:
      errorResponse.message || errorResponse.error || "An error has occurred.",
    statusCode: response.status || HttpStatusCode.BAD_REQUEST,
    body: errorResponse,
  };
}
