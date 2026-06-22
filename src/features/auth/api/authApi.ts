import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { StoredCustomer } from '@/lib/storage/secureStore';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  date_of_birth?: string;
}

export interface AuthResult {
  token: string;
  customer: StoredCustomer;
}

interface LoginResponse {
  user: StoredCustomer;
  role: string;
  token: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  user: StoredCustomer;
  token: string;
}

/** Authentication API mapped to the Laravel customer auth endpoints. */
export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResult> {
    const { data } = await apiClient.post<LoginResponse>(endpoints.auth.customerLogin, payload);
    return { token: data.token, customer: data.user };
  },

  async register(payload: RegisterPayload): Promise<AuthResult> {
    const { data } = await apiClient.post<RegisterResponse>(
      endpoints.auth.customerRegister,
      payload,
    );
    return { token: data.token, customer: data.user };
  },

  async logout(): Promise<void> {
    await apiClient.post(endpoints.auth.logout);
  },
};
