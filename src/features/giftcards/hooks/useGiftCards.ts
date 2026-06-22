import { useQuery } from '@tanstack/react-query';
import { giftCardApi } from '../api/giftCardApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import { useAuthStore } from '@/store/authStore';
import type { NormalizedApiError } from '@/types/api';
import type { GiftCard } from '@/types/models';

export function useMyGiftCards() {
  const customerId = useAuthStore((s) => s.customer?.id ?? 0);
  return useQuery<GiftCard[], NormalizedApiError>({
    queryKey: queryKeys.giftCards.mine(customerId),
    enabled: customerId > 0,
    queryFn: async () => {
      try {
        return await giftCardApi.mine(customerId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useAvailableGiftCards() {
  return useQuery<GiftCard[], NormalizedApiError>({
    queryKey: queryKeys.giftCards.available(),
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      try {
        return await giftCardApi.available();
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
