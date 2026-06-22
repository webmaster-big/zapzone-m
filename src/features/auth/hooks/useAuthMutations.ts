import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginPayload, type RegisterPayload } from '../api/authApi';
import { useAuthStore } from '@/store/authStore';
import { normalizeError } from '@/lib/api/errors';
import type { NormalizedApiError } from '@/types/api';
import { analytics, AnalyticsEvent } from '@/lib/analytics/analytics';

/** Logs the customer in and persists the session. */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<void, NormalizedApiError, LoginPayload>({
    mutationKey: ['auth', 'login'],
    mutationFn: async (payload) => {
      try {
        const { token, customer } = await authApi.login(payload);
        await setSession(token, customer);
        analytics.logEvent(AnalyticsEvent.Login, { method: 'password' });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

/** Registers a new customer and signs them in. */
export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation<void, NormalizedApiError, RegisterPayload>({
    mutationKey: ['auth', 'register'],
    mutationFn: async (payload) => {
      try {
        const { token, customer } = await authApi.register(payload);
        await setSession(token, customer);
        analytics.logEvent(AnalyticsEvent.SignUp, { method: 'password' });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
