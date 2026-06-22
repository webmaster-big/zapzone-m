import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapData } from '@/lib/api/unwrap';
import type { ApiResponse } from '@/types/api';
import type { Attraction, AppEvent, Package } from '@/types/models';
import type { GroupedPackageRaw, PackageCatalogItem } from '../types';

/**
 * Customer catalog API.
 *
 * Notes on endpoint choice (verified against the backend):
 *  - Packages: the `/packages/location/{id}` route is staff-scoped and 403s a
 *    customer token, so we use the public `/packages/grouped-by-name` endpoint
 *    (same as the web customer home) and flatten it to the selected location.
 *  - Attractions/Events: their `/location/{id}` routes are public and safe.
 */
export const catalogApi = {
  async packagesByLocation(locationId: number): Promise<PackageCatalogItem[]> {
    const { data } = await apiClient.get<ApiResponse<GroupedPackageRaw[]>>(
      endpoints.catalog.groupedPackages,
    );
    const groups = data.data ?? [];
    const items: PackageCatalogItem[] = [];

    for (const group of groups) {
      const match = group.locations?.find((loc) => loc.location_id === locationId);
      if (!match) continue;
      items.push({
        packageId: match.package_id,
        name: group.name,
        description: group.description,
        category: group.category,
        price: group.price,
        pricePerAdditional: group.price_per_additional,
        image: group.image,
        duration: group.duration,
        durationUnit: group.duration_unit,
        minParticipants: group.min_participants,
        maxParticipants: group.max_guests,
        locationId: match.location_id,
        locationName: match.location_name,
        availabilitySchedules: match.availability_schedules ?? group.availability_schedules,
      });
    }
    return items;
  },

  async packageDetail(id: number): Promise<Package> {
    const { data } = await apiClient.get<ApiResponse<Package>>(endpoints.catalog.package(id));
    return unwrapData<Package>(data);
  },

  async attractionsByLocation(locationId: number): Promise<Attraction[]> {
    const { data } = await apiClient.get<ApiResponse<Attraction[]>>(
      endpoints.catalog.attractionsByLocation(locationId),
    );
    return data.data ?? [];
  },

  async attractionDetail(id: number): Promise<Attraction> {
    const { data } = await apiClient.get<unknown>(endpoints.catalog.attraction(id));
    return unwrapData<Attraction>(data);
  },

  async eventsByLocation(locationId: number): Promise<AppEvent[]> {
    // This endpoint returns a bare array.
    const { data } = await apiClient.get<AppEvent[]>(
      endpoints.catalog.eventsByLocation(locationId),
    );
    return Array.isArray(data) ? data : [];
  },

  async eventDetail(id: number): Promise<AppEvent> {
    const { data } = await apiClient.get<AppEvent>(endpoints.catalog.event(id));
    return data;
  },

  async eventAvailableDates(id: number): Promise<string[]> {
    const { data } = await apiClient.get<{ dates?: string[] } | string[]>(
      endpoints.catalog.eventAvailableDates(id),
    );
    if (Array.isArray(data)) return data;
    return data.dates ?? [];
  },

  async eventAvailableTimeSlots(id: number, date: string): Promise<string[]> {
    const { data } = await apiClient.get<{ time_slots?: string[] } | string[]>(
      endpoints.catalog.eventAvailableTimeSlots(id, date),
    );
    if (Array.isArray(data)) return data;
    return data.time_slots ?? [];
  },
};
