import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { PackageAvailability } from '../types';

/** Availability + pricing helpers for the package booking flow. */
export const availabilityApi = {
  /** Mobile-optimized availability: returns bookable slots (with rooms) for a date. */
  async packageAvailability(packageId: number, date: string): Promise<PackageAvailability> {
    const { data } = await apiClient.get<ApiResponse<PackageAvailability>>(
      endpoints.locations.mobilePackageAvailability(packageId),
      { params: { date } },
    );
    return data.data;
  },
};
