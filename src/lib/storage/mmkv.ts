import { createMMKV, type MMKV } from 'react-native-mmkv';

/**
 * MMKV-backed key/value stores.
 *
 * - `appStorage`  — user preferences (theme, language, selected location).
 * - `cacheStorage` — TanStack Query persistence + general response caching.
 *
 * MMKV is synchronous and extremely fast, which keeps cold-start hydration and
 * cache reads off the critical path on slow devices.
 */
export const appStorage: MMKV = createMMKV({ id: 'zapzone-app' });
export const cacheStorage: MMKV = createMMKV({ id: 'zapzone-cache' });

/**
 * Adapter exposing the synchronous-string interface that TanStack Query's
 * persister expects, backed by MMKV.
 */
export const mmkvPersistStorage = {
  getItem: (key: string): string | null => cacheStorage.getString(key) ?? null,
  setItem: (key: string, value: string): void => {
    cacheStorage.set(key, value);
  },
  removeItem: (key: string): void => {
    cacheStorage.remove(key);
  },
};

/** Strongly-typed preference keys to avoid stringly-typed bugs. */
export const PREF_KEYS = {
  themeMode: 'pref.themeMode',
  language: 'pref.language',
  selectedLocationId: 'pref.selectedLocationId',
  onboardingComplete: 'pref.onboardingComplete',
  pushToken: 'pref.pushToken',
} as const;

export type PrefKey = (typeof PREF_KEYS)[keyof typeof PREF_KEYS];

/** Typed helpers over `appStorage`. */
export const prefs = {
  getString(key: PrefKey): string | undefined {
    return appStorage.getString(key);
  },
  setString(key: PrefKey, value: string): void {
    appStorage.set(key, value);
  },
  getNumber(key: PrefKey): number | undefined {
    return appStorage.getNumber(key);
  },
  setNumber(key: PrefKey, value: number): void {
    appStorage.set(key, value);
  },
  getBoolean(key: PrefKey): boolean | undefined {
    return appStorage.getBoolean(key);
  },
  setBoolean(key: PrefKey, value: boolean): void {
    appStorage.set(key, value);
  },
  remove(key: PrefKey): void {
    appStorage.remove(key);
  },
};

/** Clears cached server data (used on logout / account switch). */
export function clearCacheStorage(): void {
  cacheStorage.clearAll();
}
