import axios, { AxiosError } from 'axios';
import type { NormalizedApiError } from '@/types/api';

interface LaravelErrorBody {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

const NETWORK_CODES = new Set(['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT']);

/**
 * Converts any thrown value (Axios error, JS error, unknown) into a stable,
 * UI-safe {@link NormalizedApiError}. Centralizes the messy details of HTTP /
 * connectivity failures so feature code can render a single consistent shape.
 */
export function normalizeError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error);
  }
  if (error instanceof Error) {
    return { message: error.message, isNetworkError: false, cause: error };
  }
  return { message: 'Something went wrong. Please try again.', isNetworkError: false, cause: error };
}

function normalizeAxiosError(error: AxiosError<LaravelErrorBody>): NormalizedApiError {
  // No response => network/timeout failure.
  if (!error.response) {
    const isTimeout = error.code === 'ECONNABORTED';
    return {
      message: isTimeout
        ? 'The request timed out. Check your connection and try again.'
        : 'No internet connection. Please check your network and try again.',
      isNetworkError: true,
      cause: error,
    };
  }

  const status = error.response.status;
  const body = error.response.data;
  const fieldErrors = body?.errors;

  let message =
    body?.message ||
    body?.error ||
    firstFieldError(fieldErrors) ||
    defaultMessageForStatus(status);

  // Friendlier copy for common auth states.
  if (status === 401) message = body?.message || 'Your session has expired. Please sign in again.';
  if (status === 403) message = body?.message || "You don't have access to that.";
  if (status === 404) message = body?.message || 'We could not find what you were looking for.';
  if (status >= 500) message = 'Our servers are having a moment. Please try again shortly.';

  return {
    message,
    status,
    fieldErrors,
    isNetworkError: false,
    cause: error,
  };
}

function firstFieldError(errors?: Record<string, string[]>): string | undefined {
  if (!errors) return undefined;
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return undefined;
  return errors[firstKey]?.[0];
}

function defaultMessageForStatus(status: number): string {
  if (status === 422) return 'Please review the highlighted fields and try again.';
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
  return 'Something went wrong. Please try again.';
}

export function isNetworkCode(code?: string): boolean {
  return code ? NETWORK_CODES.has(code) : false;
}
