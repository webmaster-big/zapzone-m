import { useInfiniteQuery } from '@tanstack/react-query';
import { bookingApi } from '@/features/booking/api/bookingApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import { useAuthStore } from '@/store/authStore';
import type { NormalizedApiError } from '@/types/api';
import type { Booking } from '@/types/models';
import type { Pagination } from '@/types/api';

interface BookingsPage {
  bookings: Booking[];
  pagination: Pagination;
}

/** Paginated reservation history for the signed-in customer. */
export function useMyBookings(search?: string) {
  const email = useAuthStore((s) => s.customer?.email ?? '');

  return useInfiniteQuery<BookingsPage, NormalizedApiError>({
    queryKey: [...queryKeys.bookings.mine(undefined, email), { search }],
    enabled: Boolean(email),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    queryFn: async ({ pageParam }) => {
      try {
        return await bookingApi.listForCustomer({
          guestEmail: email,
          search,
          page: pageParam as number,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}
