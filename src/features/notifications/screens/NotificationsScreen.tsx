import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { BellRing, CheckCheck } from 'lucide-react-native';
import { Screen, Text, Spinner, EmptyState, ErrorState, Card, Badge, IconButton } from '@/components/ui';
import { statusTone } from '@/components/ui';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '../hooks/useNotifications';
import { useTheme } from '@/theme/useTheme';
import { formatTimeAgo } from '@/utils/date';
import { humanize } from '@/utils/format';
import type { CustomerNotification, NotificationPriority } from '@/types/models';

function priorityTone(priority: NotificationPriority) {
  if (priority === 'urgent' || priority === 'high') return 'danger' as const;
  if (priority === 'normal') return 'primary' as const;
  return 'neutral' as const;
}

export function NotificationsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, isLoading, error, refetch, isRefetching } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];
  const hasUnread = notifications.some((n) => !n.read_at);

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-4 pb-2 pt-1">
        <Text variant="title">{t('notifications.title')}</Text>
        {hasUnread ? (
          <IconButton
            accessibilityLabel={t('notifications.markAll')}
            variant="surface"
            onPress={() => markAll.mutate()}
          >
            <CheckCheck size={18} color={theme.colors.primary} />
          </IconButton>
        ) : null}
      </View>

      {isLoading ? (
        <Spinner fullscreen label={t('common.loading')} />
      ) : error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <FlashList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingTop: 4 }}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={theme.colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon={<BellRing size={28} color={theme.colors.primary} />}
              title={t('notifications.empty')}
              description={t('notifications.emptyDesc')}
            />
          }
          renderItem={({ item }: { item: CustomerNotification }) => {
            const unread = !item.read_at;
            return (
              <Card
                onPress={unread ? () => markRead.mutate(item.id) : undefined}
                className={unread ? 'border-l-2 border-l-primary' : undefined}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-2">
                    <View className="flex-row items-center gap-2">
                      {unread ? <View className="h-2 w-2 rounded-full bg-primary" /> : null}
                      <Text variant="subheading" numberOfLines={1} className="flex-1">
                        {item.title}
                      </Text>
                    </View>
                    <Text variant="bodyMuted" className="mt-1">
                      {item.message}
                    </Text>
                    <Text variant="caption" className="mt-2">
                      {formatTimeAgo(item.created_at)}
                    </Text>
                  </View>
                  <Badge label={humanize(item.type)} tone={statusTone(item.type) === 'neutral' ? priorityTone(item.priority) : 'primary'} />
                </View>
              </Card>
            );
          }}
        />
      )}
    </Screen>
  );
}
