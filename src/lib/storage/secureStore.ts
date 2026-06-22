import * as SecureStore from 'expo-secure-store';

/**
 * Secure, encrypted storage for sensitive auth material (Sanctum token and the
 * authenticated customer profile). Uses the iOS Keychain / Android Keystore via
 * expo-secure-store. Never store tokens in MMKV/AsyncStorage.
 */

const TOKEN_KEY = 'zapzone.auth.token';
const CUSTOMER_KEY = 'zapzone.auth.customer';

export interface StoredCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  date_of_birth?: string | null;
  status?: string | null;
}

export const secureAuthStorage = {
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getCustomer(): Promise<StoredCustomer | null> {
    const raw = await SecureStore.getItemAsync(CUSTOMER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredCustomer;
    } catch {
      return null;
    }
  },

  async setCustomer(customer: StoredCustomer): Promise<void> {
    await SecureStore.setItemAsync(CUSTOMER_KEY, JSON.stringify(customer));
  },

  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(CUSTOMER_KEY),
    ]);
  },
};
