import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '../api/catalogApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import type { NormalizedApiError } from '@/types/api';
import type { Attraction, AppEvent, Package } from '@/types/models';
import type { PackageCatalogItem } from '../types';

const catalogStaleTime = 1000 * 60 * 10; // catalog changes infrequently

export function usePackagesByLocation(locationId: number | null) {
  return useQuery<PackageCatalogItem[], NormalizedApiError>({
    queryKey: queryKeys.packages.byLocation(locationId ?? 0),
    enabled: locationId != null,
    staleTime: catalogStaleTime,
    queryFn: async () => {
      try {
        return await catalogApi.packagesByLocation(locationId as number);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function usePackageDetail(packageId: number) {
  return useQuery<Package, NormalizedApiError>({
    queryKey: queryKeys.packages.detail(packageId),
    staleTime: catalogStaleTime,
    queryFn: async () => {
      try {
        return await catalogApi.packageDetail(packageId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useAttractionsByLocation(locationId: number | null) {
  return useQuery<Attraction[], NormalizedApiError>({
    queryKey: queryKeys.attractions.byLocation(locationId ?? 0),
    enabled: locationId != null,
    staleTime: catalogStaleTime,
    queryFn: async () => {
      try {
        return await catalogApi.attractionsByLocation(locationId as number);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useAttractionDetail(attractionId: number) {
  return useQuery<Attraction, NormalizedApiError>({
    queryKey: queryKeys.attractions.detail(attractionId),
    staleTime: catalogStaleTime,
    queryFn: async () => {
      try {
        return await catalogApi.attractionDetail(attractionId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useEventsByLocation(locationId: number | null) {
  return useQuery<AppEvent[], NormalizedApiError>({
    queryKey: queryKeys.events.byLocation(locationId ?? 0),
    enabled: locationId != null,
    staleTime: catalogStaleTime,
    queryFn: async () => {
      try {
        return await catalogApi.eventsByLocation(locationId as number);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useEventDetail(eventId: number) {
  return useQuery<AppEvent, NormalizedApiError>({
    queryKey: queryKeys.events.detail(eventId),
    staleTime: catalogStaleTime,
    queryFn: async () => {
      try {
        return await catalogApi.eventDetail(eventId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useEventAvailableDates(eventId: number) {
  return useQuery<string[], NormalizedApiError>({
    queryKey: queryKeys.events.availableDates(eventId),
    queryFn: async () => {
      try {
        return await catalogApi.eventAvailableDates(eventId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useEventTimeSlots(eventId: number, date: string | null) {
  return useQuery<string[], NormalizedApiError>({
    queryKey: queryKeys.events.availableSlots(eventId, date ?? ''),
    enabled: Boolean(date),
    queryFn: async () => {
      try {
        return await catalogApi.eventAvailableTimeSlots(eventId, date as string);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
