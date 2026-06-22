import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { GiftCard } from '@/types/models';

function extractGiftCards(body: unknown): GiftCard[] {
  if (Array.isArray(body)) return body as GiftCard[];
  if (body && typeof body === 'object') {
    const data = (body as { data?: unknown }).data;
    if (Array.isArray(data)) return data as GiftCard[];
    if (data && typeof data === 'object' && 'gift_cards' in data) {
      const cards = (data as { gift_cards?: GiftCard[] }).gift_cards;
      return Array.isArray(cards) ? cards : [];
    }
  }
  return [];
}

export interface GiftCardValidation {
  valid: boolean;
  gift_card?: GiftCard;
  message?: string;
}

export const giftCardApi = {
  async available(): Promise<GiftCard[]> {
    const { data } = await apiClient.get<unknown>(endpoints.giftCards.list, {
      params: { status: 'active', per_page: 50 },
    });
    return extractGiftCards(data);
  },

  async mine(customerId: number): Promise<GiftCard[]> {
    const { data } = await apiClient.get<unknown>(endpoints.giftCards.list, {
      params: { customer_id: customerId, per_page: 50 },
    });
    return extractGiftCards(data);
  },

  async validateCode(code: string): Promise<GiftCardValidation> {
    const { data } = await apiClient.post<{ success: boolean; data: GiftCardValidation }>(
      endpoints.giftCards.validateCode,
      { code },
    );
    return data.data;
  },
};
