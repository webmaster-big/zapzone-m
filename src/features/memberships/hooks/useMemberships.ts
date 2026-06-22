import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membershipApi } from '../api/membershipApi';
import type { PaymentTokenizerHandle } from '@/features/payment/components/PaymentTokenizer';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import { analytics, AnalyticsEvent } from '@/lib/analytics/analytics';
import type { NormalizedApiError } from '@/types/api';
import type { AuthorizeNetPublicKey, CardInput } from '@/types/payment';
import type {
  CancellationEffective,
  Membership,
  MembershipPlan,
} from '@/types/membership';

export function useMembershipPlans() {
  return useQuery<MembershipPlan[], NormalizedApiError>({
    queryKey: queryKeys.memberships.plans(),
    staleTime: 1000 * 60 * 15,
    queryFn: async () => {
      try {
        return await membershipApi.publicPlans();
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useMyMembership() {
  return useQuery<Membership | null, NormalizedApiError>({
    queryKey: queryKeys.memberships.me(),
    queryFn: async () => {
      try {
        return await membershipApi.mine();
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useFreezeMembership() {
  const qc = useQueryClient();
  return useMutation<Membership, NormalizedApiError, { id: number; until: string; note?: string }>({
    mutationFn: async ({ id, until, note }) => {
      try {
        return await membershipApi.freeze(id, until, note);
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.memberships.me() }),
  });
}

export function useCancelMembership() {
  const qc = useQueryClient();
  return useMutation<
    Membership,
    NormalizedApiError,
    { id: number; effective: CancellationEffective; note?: string }
  >({
    mutationFn: async ({ id, effective, note }) => {
      try {
        return await membershipApi.cancel(id, effective, note);
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.memberships.me() }),
  });
}

export function useRetryMembershipPayment() {
  const qc = useQueryClient();
  return useMutation<void, NormalizedApiError, { id: number }>({
    mutationFn: async ({ id }) => {
      try {
        await membershipApi.retryPayment(id);
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.memberships.me() }),
  });
}

export interface MembershipPurchaseArgs {
  tokenizer: PaymentTokenizerHandle;
  publicKey: AuthorizeNetPublicKey;
  card: CardInput;
  planId: number;
  homeLocationId: number;
  termsAccepted: boolean;
  recurringAuthorized: boolean;
}

/**
 * Membership sign-up. Unlike one-off purchases, the membership endpoint accepts
 * the Accept.js opaque token directly and provisions the recurring billing
 * profile, so we tokenize first and pass `opaque_data` to `/memberships/purchase`.
 */
export function useMembershipPurchase() {
  const qc = useQueryClient();
  return useMutation<Membership, NormalizedApiError, MembershipPurchaseArgs>({
    mutationFn: async (args) => {
      try {
        const opaqueData = await args.tokenizer.tokenize(args.publicKey, args.card);
        const membership = await membershipApi.purchase({
          membership_plan_id: args.planId,
          home_location_id: args.homeLocationId,
          opaque_data: {
            dataDescriptor: opaqueData.dataDescriptor,
            dataValue: opaqueData.dataValue,
          },
          terms_accepted: args.termsAccepted,
          recurring_billing_authorized: args.recurringAuthorized,
        });
        analytics.logEvent(AnalyticsEvent.MembershipPurchased, { plan_id: args.planId });
        return membership;
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.memberships.me() }),
  });
}
