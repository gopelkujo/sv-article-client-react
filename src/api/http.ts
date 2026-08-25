/**
 * HTTP helpers for talking to sv-article-service.
 * Uses Vite proxy (`/api` → `http://localhost:8080`) unless `VITE_API_BASE_URL` is set.
 */

/** API envelope returned by every article-service endpoint. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    details: Array<{ field: string; message: string }>;
  } | null;
}

/**
 * Resolves the API base URL (no trailing slash).
 * @returns Base URL for article-service requests
 */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (fromEnv?.replace(/\/$/, '') || '/api');
}

/**
 * Builds a human-readable message from an API error envelope.
 * @param error - Envelope error object
 * @returns Combined message including field details when present
 */
export function formatApiError(
  error: NonNullable<ApiEnvelope<unknown>['error']>,
): string {
  if (!error.details?.length) {
    return error.message;
  }
  const detailText = error.details
    .map((detail) => `${detail.field}: ${detail.message}`)
    .join('; ');
  return `${error.message} (${detailText})`;
}

/**
 * Performs a JSON request against the article service and unwraps the envelope.
 * @param path - Path beginning with `/` (e.g. `/article/1`)
 * @param init - Optional fetch init (method, body, headers)
 * @returns Unwrapped `data` payload
 * @throws Error when the network fails, HTTP is non-OK, or `success` is false
 */
export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  let envelope: ApiEnvelope<T>;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new Error(
      response.ok
        ? 'Invalid JSON response from API'
        : `Request failed with status ${response.status}`,
    );
  }

  if (!response.ok || !envelope.success) {
    if (envelope.error) {
      throw new Error(formatApiError(envelope.error));
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  return envelope.data as T;
}
