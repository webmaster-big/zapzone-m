import { useQuery } from '@tanstack/react-query';
import { availabilityApi } from '../api/availabilityApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import type { NormalizedApiError } from '@/types/api';
import type { PackageAvailability } from '../types';

/** Loads bookable slots for a package on a given date. */
export function usePackageAvailability(packageId: number, date: string | null) {
  return useQuery<PackageAvailability, NormalizedApiError>({
    queryKey: queryKeys.packages.availability(packageId, date ?? ''),
    enabled: Boolean(date),
    // Availability is time-sensitive; keep it fresh but allow brief caching.
    staleTime: 1000 * 60,
    queryFn: async () => {
      try {
        return await availabilityApi.packageAvailability(packageId, date as string);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
