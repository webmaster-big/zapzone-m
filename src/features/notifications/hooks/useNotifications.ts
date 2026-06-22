import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notificationApi';
import { queryKeys } from '@/lib/query/queryKeys';
import { normalizeError } from '@/lib/api/errors';
import { useAuthStore } from '@/store/authStore';
import type { NormalizedApiError } from '@/types/api';
import type { CustomerNotification } from '@/types/models';
import type { Pagination } from '@/types/api';

export function useNotifications() {
  const customerId = useAuthStore((s) => s.customer?.id ?? 0);
  return useQuery<{ notifications: CustomerNotification[]; pagination: Pagination }, NormalizedApiError>({
    queryKey: queryKeys.notifications.list(customerId),
    enabled: customerId > 0,
    queryFn: async () => {
      try {
        return await notificationApi.list(customerId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useUnreadCount() {
  const customerId = useAuthStore((s) => s.customer?.id ?? 0);
  return useQuery<number, NormalizedApiError>({
    queryKey: queryKeys.notifications.unreadCount(customerId),
    enabled: customerId > 0,
    refetchInterval: 1000 * 60, // light polling for the tab badge
    queryFn: async () => {
      try {
        return await notificationApi.unreadCount(customerId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  const customerId = useAuthStore((s) => s.customer?.id ?? 0);
  return useMutation<void, NormalizedApiError, number>({
    mutationFn: async (id) => {
      try {
        await notificationApi.markRead(id);
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.list(customerId) });
      qc.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(customerId) });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  const customerId = useAuthStore((s) => s.customer?.id ?? 0);
  return useMutation<void, NormalizedApiError, void>({
    mutationFn: async () => {
      try {
        await notificationApi.markAllRead(customerId);
      } catch (error) {
        throw normalizeError(error);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.notifications.list(customerId) });
      qc.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(customerId) });
    },
  });
}
