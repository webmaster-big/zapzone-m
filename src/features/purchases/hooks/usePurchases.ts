import { useQuery } from '@tanstack/react-query';
import { attractionPurchaseApi, eventPurchaseApi } from '../api/purchasesApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import { useAuthStore } from '@/store/authStore';
import type { NormalizedApiError } from '@/types/api';
import type { AttractionPurchase, EventPurchase } from '@/types/models';

export function useMyEventPurchases() {
  const email = useAuthStore((s) => s.customer?.email ?? '');
  return useQuery<EventPurchase[], NormalizedApiError>({
    queryKey: queryKeys.eventPurchases.mine(undefined, email),
    enabled: Boolean(email),
    queryFn: async () => {
      try {
        return await eventPurchaseApi.listForCustomer(email);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useMyAttractionPurchases() {
  const email = useAuthStore((s) => s.customer?.email ?? '');
  return useQuery<AttractionPurchase[], NormalizedApiError>({
    queryKey: queryKeys.attractionPurchases.mine(undefined, email),
    enabled: Boolean(email),
    queryFn: async () => {
      try {
        return await attractionPurchaseApi.listForCustomer(email);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
