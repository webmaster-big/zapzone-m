import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '../api/locationsApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import type { NormalizedApiError } from '@/types/api';
import type { Location } from '@/types/models';

/** Loads bookable locations. Locations rarely change, so we cache aggressively. */
export function useLocations() {
  return useQuery<Location[], NormalizedApiError>({
    queryKey: queryKeys.locations(),
    queryFn: async () => {
      try {
        return await locationsApi.list();
      } catch (error) {
        throw normalizeError(error);
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes — configuration data
  });
}
