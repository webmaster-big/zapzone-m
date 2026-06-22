import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import type { Persister, PersistedClient } from '@tanstack/react-query-persist-client';
import { APP_CONFIG } from '@/config/env';
import { mmkvPersistStorage } from '@/lib/storage/mmkv';
import { normalizeError } from '@/lib/api/errors';

/**
 * TanStack Query client tuned for mobile:
 *  - Generous `staleTime` to minimize refetches on slow networks.
 *  - Long `gcTime` so data survives for offline reads.
 *  - No refetch-on-mount churn; we refetch on reconnect instead.
 *  - Failed mutations/queries are not retried when the device is offline
 *    (handled via the network-aware online manager).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.defaultStaleTimeMs,
      gcTime: APP_CONFIG.defaultGcTimeMs,
      retry: (failureCount, error) => {
        const normalized = normalizeError(error);
        // Don't hammer the server on auth/permission failures.
        if (normalized.status && [401, 403, 404, 422].includes(normalized.status)) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

const QUERY_CACHE_KEY = 'zapzone.query-cache.v1';

/** MMKV-backed persister for offline-first query hydration. */
const mmkvPersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    mmkvPersistStorage.setItem(QUERY_CACHE_KEY, JSON.stringify(client));
  },
  restoreClient: async () => {
    const raw = mmkvPersistStorage.getItem(QUERY_CACHE_KEY);
    return raw ? (JSON.parse(raw) as PersistedClient) : undefined;
  },
  removeClient: async () => {
    mmkvPersistStorage.removeItem(QUERY_CACHE_KEY);
  },
};

/** Wires up persistence. Call once during app bootstrap. */
export function setupQueryPersistence(): void {
  persistQueryClient({
    queryClient,
    persister: mmkvPersister,
    maxAge: APP_CONFIG.defaultGcTimeMs,
    dehydrateOptions: {
      // Only persist successful queries to avoid caching error states.
      shouldDehydrateQuery: (query) => query.state.status === 'success',
    },
  });
}
