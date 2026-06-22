import { create } from 'zustand';
import type { StoredCustomer } from '@/lib/storage/secureStore';
import { secureAuthStorage } from '@/lib/storage/secureStore';
import { setAuthToken } from '@/lib/api/client';
import { clearCacheStorage } from '@/lib/storage/mmkv';
import { setSentryUser } from '@/lib/sentry';
import { analytics } from '@/lib/analytics/analytics';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  token: string | null;
  customer: StoredCustomer | null;
  /** Hydrate auth from secure storage on app start. */
  bootstrap: () => Promise<void>;
  /** Persist a successful login/registration. */
  setSession: (token: string, customer: StoredCustomer) => Promise<void>;
  /** Update the cached customer profile in place. */
  updateCustomer: (customer: StoredCustomer) => Promise<void>;
  /** Clear all auth state + cached server data. */
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  customer: null,

  bootstrap: async () => {
    set({ status: 'loading' });
    const [token, customer] = await Promise.all([
      secureAuthStorage.getToken(),
      secureAuthStorage.getCustomer(),
    ]);
    if (token && customer) {
      setAuthToken(token);
      setSentryUser({ id: customer.id, email: customer.email });
      analytics.setUserId(String(customer.id));
      set({ status: 'authenticated', token, customer });
    } else {
      setAuthToken(null);
      set({ status: 'unauthenticated', token: null, customer: null });
    }
  },

  setSession: async (token, customer) => {
    await Promise.all([
      secureAuthStorage.setToken(token),
      secureAuthStorage.setCustomer(customer),
    ]);
    setAuthToken(token);
    setSentryUser({ id: customer.id, email: customer.email });
    analytics.setUserId(String(customer.id));
    set({ status: 'authenticated', token, customer });
  },

  updateCustomer: async (customer) => {
    await secureAuthStorage.setCustomer(customer);
    set({ customer });
  },

  signOut: async () => {
    const { token } = get();
    if (token) {
      // Best-effort server-side revocation; ignore failures (offline, expired).
      try {
        const { authApi } = await import('@/features/auth/api/authApi');
        await authApi.logout();
      } catch {
        // no-op
      }
    }
    await secureAuthStorage.clear();
    clearCacheStorage();
    setAuthToken(null);
    setSentryUser(null);
    analytics.setUserId(null);
    set({ status: 'unauthenticated', token: null, customer: null });
  },
}));
