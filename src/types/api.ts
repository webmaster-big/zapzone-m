/**
 * Shared API envelope types that match the Laravel backend response shapes used
 * across the ZapZone customer endpoints.
 */

/** Standard success/data envelope returned by most endpoints. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

/** Laravel-style pagination metadata. */
export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

/** Envelope for list endpoints that wrap items under a named key + pagination. */
export interface PaginatedEnvelope<T> {
  success: boolean;
  message?: string;
  data: {
    pagination: Pagination;
  } & Record<string, T[] | Pagination>;
}

/** Generic paginated payload where the array key is known. */
export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

/** Normalized application error surfaced to the UI layer. */
export interface NormalizedApiError {
  /** Human-readable message safe to show to the user. */
  message: string;
  /** HTTP status code, when available. */
  status?: number;
  /** Laravel field validation errors. */
  fieldErrors?: Record<string, string[]>;
  /** True when the failure was caused by lack of connectivity. */
  isNetworkError: boolean;
  /** Original error for logging/Sentry. */
  cause?: unknown;
}
