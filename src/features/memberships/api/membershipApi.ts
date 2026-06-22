import axios from 'axios';
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapData } from '@/lib/api/unwrap';
import type {
  CancellationEffective,
  Membership,
  MembershipPlan,
  PurchaseMembershipPayload,
} from '@/types/membership';

export const membershipApi = {
  async publicPlans(): Promise<MembershipPlan[]> {
    const { data } = await apiClient.get<unknown>(endpoints.memberships.publicPlans);
    const unwrapped = unwrapData<MembershipPlan[] | { data?: MembershipPlan[] }>(data);
    if (Array.isArray(unwrapped)) return unwrapped;
    return Array.isArray(unwrapped.data) ? unwrapped.data : [];
  },

  /** Returns the customer's current membership, or null when none exists. */
  async mine(): Promise<Membership | null> {
    try {
      const { data } = await apiClient.get<unknown>(endpoints.memberships.me);
      const result = unwrapData<Membership | null>(data);
      return result ?? null;
    } catch (error) {
      // No active membership is a normal state, not an error.
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async purchase(payload: PurchaseMembershipPayload): Promise<Membership> {
    const { data } = await apiClient.post<unknown>(endpoints.memberships.purchase, payload);
    return unwrapData<Membership>(data);
  },

  async freeze(id: number, until: string, note?: string): Promise<Membership> {
    const { data } = await apiClient.patch<unknown>(endpoints.memberships.freeze(id), {
      until,
      note,
    });
    return unwrapData<Membership>(data);
  },

  async cancel(id: number, effective: CancellationEffective, note?: string): Promise<Membership> {
    const { data } = await apiClient.patch<unknown>(endpoints.memberships.cancel(id), {
      effective,
      note,
    });
    return unwrapData<Membership>(data);
  },

  async retryPayment(id: number): Promise<void> {
    await apiClient.post(endpoints.memberships.retryPayment(id));
  },
};
