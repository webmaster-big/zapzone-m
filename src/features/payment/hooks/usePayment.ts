import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import { normalizeError } from '@/lib/api/errors';
import type { NormalizedApiError } from '@/types/api';
import type {
  AuthorizeNetPublicKey,
  CardInput,
  PaymentChargeRequest,
  PaymentChargeResponse,
} from '@/types/payment';
import type { PaymentTokenizerHandle } from '../components/PaymentTokenizer';

/** Loads the per-location Accept.js public key (cached briefly). */
export function usePublicKey(locationId: number | null) {
  return useQuery<AuthorizeNetPublicKey, NormalizedApiError>({
    queryKey: ['authorize-net', 'public-key', locationId],
    enabled: locationId != null,
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      try {
        return await paymentApi.getPublicKey(locationId as number);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

/**
 * Tokenizes a card via the hidden Accept.js WebView and charges it.
 * `chargePayload` should already contain `payable_id`/`payable_type` so the
 * backend can link the payment and roll the payable back on decline.
 */
export async function tokenizeAndCharge(params: {
  tokenizer: PaymentTokenizerHandle;
  publicKey: AuthorizeNetPublicKey;
  card: CardInput;
  chargePayload: Omit<PaymentChargeRequest, 'opaqueData'>;
}): Promise<PaymentChargeResponse> {
  const { tokenizer, publicKey, card, chargePayload } = params;
  const opaqueData = await tokenizer.tokenize(publicKey, card);
  return paymentApi.charge({ ...chargePayload, opaqueData });
}
