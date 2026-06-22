import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapData } from '@/lib/api/unwrap';
import type { ApiResponse } from '@/types/api';
import type { AttractionPurchase, EventPurchase } from '@/types/models';
import type {
  AttractionPurchaseCreatePayload,
  EventPurchaseCreatePayload,
} from '@/types/payment';

/** Tolerantly extracts an array of purchases from the various envelope shapes. */
function extractPurchases<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === 'object') {
    const obj = body as { data?: unknown };
    const data = obj.data;
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object' && 'purchases' in data) {
      const purchases = (data as { purchases?: T[] }).purchases;
      return Array.isArray(purchases) ? purchases : [];
    }
  }
  return [];
}

export const eventPurchaseApi = {
  async create(payload: EventPurchaseCreatePayload): Promise<EventPurchase> {
    const { data } = await apiClient.post<ApiResponse<EventPurchase>>(
      endpoints.eventPurchases.create,
      payload,
    );
    return unwrapData<EventPurchase>(data);
  },

  async listForCustomer(email: string): Promise<EventPurchase[]> {
    const { data } = await apiClient.get<unknown>(endpoints.eventPurchases.customer, {
      params: { guest_email: email, per_page: 50 },
    });
    return extractPurchases<EventPurchase>(data);
  },
};

export const attractionPurchaseApi = {
  async create(payload: AttractionPurchaseCreatePayload): Promise<AttractionPurchase> {
    const { data } = await apiClient.post<ApiResponse<AttractionPurchase>>(
      endpoints.attractionPurchases.create,
      payload,
    );
    return unwrapData<AttractionPurchase>(data);
  },

  async listForCustomer(email: string): Promise<AttractionPurchase[]> {
    const { data } = await apiClient.get<unknown>(endpoints.attractionPurchases.customer, {
      params: { guest_email: email, per_page: 50 },
    });
    return extractPurchases<AttractionPurchase>(data);
  },
};
