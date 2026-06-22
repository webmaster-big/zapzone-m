import Constants from 'expo-constants';

/**
 * Central runtime configuration.
 *
 * Resolution order for the API base URL:
 *  1. `EXPO_PUBLIC_API_BASE_URL` env var (inlined at build time by Expo)
 *  2. `expo.extra.apiBaseUrl` from app.json
 *  3. Production backend default
 *
 * Mirrors the web app (`zappoint/src/utils/storage.ts`): the value always ends
 * in `/api`, and `ASSET_URL` is derived from the same origin + `/storage/`.
 */
const DEFAULT_API_BASE_URL = 'https://zapzone-backend-yt1lm2w5.on-forge.com/api';

const normalizeBaseUrl = (value: string): string => value.trim().replace(/\/+$/, '');

const extra = (Constants.expoConfig?.extra ?? {}) as { apiBaseUrl?: string };

const rawBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? DEFAULT_API_BASE_URL;

const normalized = normalizeBaseUrl(rawBaseUrl);

export const API_BASE_URL = normalized.endsWith('/api') ? normalized : `${normalized}/api`;

/** Backend origin without the trailing `/api`. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

/** Public asset base, e.g. `https://.../storage/`. */
export const ASSET_URL = `${API_ORIGIN}/storage/`;

/** Sentry DSN (optional — no-ops when unset). */
export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';

export const IS_DEV = __DEV__;

/** App-wide constants. */
export const APP_CONFIG = {
  appName: 'ZapZone',
  /** Default request timeout in milliseconds. */
  requestTimeoutMs: 20000,
  /** How long cached server data is considered fresh by default. */
  defaultStaleTimeMs: 1000 * 60 * 5, // 5 minutes
  /** How long cached data is retained for offline use. */
  defaultGcTimeMs: 1000 * 60 * 60 * 24, // 24 hours
} as const;
