import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, APP_CONFIG } from '@/config/env';
import { isNetworkCode } from './errors';

/**
 * Singleton Axios instance for the ZapZone backend.
 *
 * Responsibilities:
 *  - Inject the Sanctum bearer token (kept in memory, hydrated at boot).
 *  - Light retry for idempotent GETs on transient network failures.
 *  - Surface 401s to a registered handler so the auth layer can sign the user out.
 */

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: APP_CONFIG.requestTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (authToken) {
    config.headers.set('Authorization', `Bearer ${authToken}`);
  }
  return config;
});

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 600;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as
      | (InternalAxiosRequestConfig & { _retryCount?: number })
      | undefined;

    // Handle expired/invalid sessions.
    if (error.response?.status === 401) {
      unauthorizedHandler?.();
      return Promise.reject(error);
    }

    // Retry transient network errors for safe (GET) requests only.
    const method = (config?.method ?? 'get').toLowerCase();
    const isRetryable =
      !!config &&
      method === 'get' &&
      (!error.response || isNetworkCode(error.code) || error.response.status >= 500);

    if (config && isRetryable) {
      config._retryCount = config._retryCount ?? 0;
      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        const delay = RETRY_BASE_DELAY_MS * 2 ** (config._retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  },
);
