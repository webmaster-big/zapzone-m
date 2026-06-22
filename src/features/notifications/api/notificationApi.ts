import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { CustomerNotification } from '@/types/models';
import type { Pagination } from '@/types/api';

interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: CustomerNotification[];
    pagination: Pagination;
  };
}

export const notificationApi = {
  async list(customerId: number, page = 1): Promise<{
    notifications: CustomerNotification[];
    pagination: Pagination;
  }> {
    const { data } = await apiClient.get<NotificationsResponse>(endpoints.notifications.list, {
      params: { customer_id: customerId, per_page: 30, page },
    });
    return data.data;
  },

  async unreadCount(customerId: number): Promise<number> {
    const { data } = await apiClient.get<{ success: boolean; data: { count?: number } | number }>(
      endpoints.notifications.unreadCount(customerId),
    );
    const payload = data.data;
    if (typeof payload === 'number') return payload;
    return payload?.count ?? 0;
  },

  async markRead(id: number): Promise<void> {
    await apiClient.patch(endpoints.notifications.markRead(id));
  },

  async markAllRead(customerId: number): Promise<void> {
    await apiClient.patch(endpoints.notifications.markAllRead(customerId));
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(endpoints.notifications.remove(id));
  },
};
