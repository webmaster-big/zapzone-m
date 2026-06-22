import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Location } from '@/types/models';

/** Locations API. Uses the mobile-optimized endpoint which returns active
 * venues with timezone metadata used for availability calculations. */
export const locationsApi = {
  async list(): Promise<Location[]> {
    const { data } = await apiClient.get<ApiResponse<Location[]>>(endpoints.locations.mobileList);
    return data.data ?? [];
  },
};
