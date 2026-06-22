import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapData } from '@/lib/api/unwrap';
import type {
  AuthorizeNetPublicKey,
  PaymentChargeRequest,
  PaymentChargeResponse,
} from '@/types/payment';

/** Payment API: per-location Accept.js keys + the charge endpoint. */
export const paymentApi = {
  async getPublicKey(locationId: number): Promise<AuthorizeNetPublicKey> {
    const { data } = await apiClient.get<unknown>(endpoints.payments.publicKey(locationId));
    return unwrapData<AuthorizeNetPublicKey>(data);
  },

  async charge(payload: PaymentChargeRequest): Promise<PaymentChargeResponse> {
    const { data } = await apiClient.post<PaymentChargeResponse>(
      endpoints.payments.charge,
      payload,
    );
    return data;
  },
};
