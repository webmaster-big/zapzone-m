import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { unwrapData } from '@/lib/api/unwrap';
import type { ApiResponse, Pagination } from '@/types/api';
import type { Booking } from '@/types/models';
import type { BookingCreatePayload } from '@/types/payment';

export interface CustomerBookingsParams {
  guestEmail: string;
  search?: string;
  perPage?: number;
  page?: number;
}

interface CustomerBookingsResponse {
  success: boolean;
  data: {
    bookings: Booking[];
    pagination: Pagination;
  };
}

/** Booking creation + customer booking history. */
export const bookingApi = {
  async create(payload: BookingCreatePayload): Promise<Booking> {
    const { data } = await apiClient.post<ApiResponse<Booking>>(endpoints.bookings.create, payload);
    return unwrapData<Booking>(data);
  },

  /**
   * Customer reservation history. The backend matches on `guest_email` OR the
   * linked customer's email, so a single email param covers both guest and
   * authenticated bookings.
   */
  async listForCustomer(params: CustomerBookingsParams): Promise<{
    bookings: Booking[];
    pagination: Pagination;
  }> {
    const { data } = await apiClient.get<CustomerBookingsResponse>(
      endpoints.bookings.customerBookings,
      {
        params: {
          guest_email: params.guestEmail,
          search: params.search,
          per_page: params.perPage ?? 20,
          page: params.page ?? 1,
          sort_by: 'booking_date',
          sort_order: 'desc',
        },
      },
    );
    return data.data;
  },
};
