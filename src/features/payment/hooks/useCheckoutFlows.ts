import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '@/features/booking/api/bookingApi';
import { attractionPurchaseApi, eventPurchaseApi } from '@/features/purchases/api/purchasesApi';
import { tokenizeAndCharge } from './usePayment';
import { normalizeError } from '@/lib/api/errors';
import { queryKeys } from '@/lib/query/queryKeys';
import { analytics, AnalyticsEvent } from '@/lib/analytics/analytics';
import type { NormalizedApiError } from '@/types/api';
import type {
  AttractionPurchaseCreatePayload,
  AuthorizeNetPublicKey,
  BookingCreatePayload,
  CardInput,
  EventPurchaseCreatePayload,
  PaymentCustomerInfo,
} from '@/types/payment';
import type { PaymentTokenizerHandle } from '../components/PaymentTokenizer';

interface BaseCheckoutArgs {
  tokenizer: PaymentTokenizerHandle;
  publicKey: AuthorizeNetPublicKey;
  card: CardInput;
  customer: PaymentCustomerInfo;
  customerId?: number;
  locationId: number;
  amount: number;
}

/**
 * Generic checkout: create the payable (pending), then tokenize + charge with
 * `payable_id`/`payable_type` so the backend links the payment and rolls the
 * payable back automatically if the charge declines.
 */
async function runCheckout<T extends { id: number; reference_number: string }>(
  createPayable: () => Promise<T>,
  payableType: 'booking' | 'attraction_purchase' | 'event_purchase',
  args: BaseCheckoutArgs,
): Promise<T> {
  const payable = await createPayable();
  const result = await tokenizeAndCharge({
    tokenizer: args.tokenizer,
    publicKey: args.publicKey,
    card: args.card,
    chargePayload: {
      location_id: args.locationId,
      amount: args.amount,
      customer_id: args.customerId,
      customer: args.customer,
      payable_id: payable.id,
      payable_type: payableType,
      send_email: true,
      terms_accepted: true,
    },
  });
  if (!result.success) {
    throw normalizeError(new Error(result.message || 'Your payment could not be processed.'));
  }
  return payable;
}

export function useBookingCheckout() {
  const qc = useQueryClient();
  return useMutation<
    { id: number; reference_number: string },
    NormalizedApiError,
    BaseCheckoutArgs & { payload: BookingCreatePayload }
  >({
    mutationFn: async ({ payload, ...args }) => {
      try {
        const booking = await runCheckout(() => bookingApi.create(payload), 'booking', args);
        analytics.logEvent(AnalyticsEvent.Purchase, {
          kind: 'booking',
          value: args.amount,
          currency: 'USD',
        });
        return booking;
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.bookings.all() }),
  });
}

export function useEventCheckout() {
  const qc = useQueryClient();
  return useMutation<
    { id: number; reference_number: string },
    NormalizedApiError,
    BaseCheckoutArgs & { payload: EventPurchaseCreatePayload }
  >({
    mutationFn: async ({ payload, ...args }) => {
      try {
        const purchase = await runCheckout(
          () => eventPurchaseApi.create(payload),
          'event_purchase',
          args,
        );
        analytics.logEvent(AnalyticsEvent.Purchase, {
          kind: 'event',
          value: args.amount,
          currency: 'USD',
        });
        return purchase;
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.eventPurchases.mine(undefined, '') }),
  });
}

export function useAttractionCheckout() {
  const qc = useQueryClient();
  return useMutation<
    { id: number; reference_number: string },
    NormalizedApiError,
    BaseCheckoutArgs & { payload: AttractionPurchaseCreatePayload }
  >({
    mutationFn: async ({ payload, ...args }) => {
      try {
        const purchase = await runCheckout(
          () => attractionPurchaseApi.create(payload),
          'attraction_purchase',
          args,
        );
        analytics.logEvent(AnalyticsEvent.Purchase, {
          kind: 'attraction',
          value: args.amount,
          currency: 'USD',
        });
        return purchase;
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.attractionPurchases.mine(undefined, '') }),
  });
}
