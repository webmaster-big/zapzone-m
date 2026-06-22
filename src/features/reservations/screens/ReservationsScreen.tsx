import { useMemo, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Ticket, Sparkles } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, Text, Spinner, EmptyState, ErrorState, SegmentedControl } from '@/components/ui';
import { RecordCard } from '@/features/shared/components/RecordCard';
import { useMyBookings } from '../hooks/useMyBookings';
import {
  useMyAttractionPurchases,
  useMyEventPurchases,
} from '@/features/purchases/hooks/usePurchases';
import { useTheme } from '@/theme/useTheme';
import { formatTime12h } from '@/utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Segment = 'bookings' | 'events' | 'attractions';

export function ReservationsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const [segment, setSegment] = useState<Segment>('bookings');

  const bookingsQuery = useMyBookings();
  const eventsQuery = useMyEventPurchases();
  const attractionsQuery = useMyAttractionPurchases();

  const bookings = useMemo(
    () => bookingsQuery.data?.pages.flatMap((p) => p.bookings) ?? [],
    [bookingsQuery.data],
  );

  const browse = () => navigation.navigate('Tabs', { screen: 'HomeTab' });

  return (
    <Screen edges={['top']}>
      <View className="px-4 pb-3 pt-1">
        <Text variant="title">{t('reservations.title')}</Text>
        <SegmentedControl<Segment>
          className="mt-3"
          value={segment}
          onChange={setSegment}
          options={[
            { label: 'Bookings', value: 'bookings' },
            { label: 'Events', value: 'events' },
            { label: 'Attractions', value: 'attractions' },
          ]}
        />
      </View>

      {segment === 'bookings' &&
        (bookingsQuery.isLoading ? (
          <Spinner fullscreen label={t('common.loading')} />
        ) : bookingsQuery.error ? (
          <ErrorState error={bookingsQuery.error} onRetry={bookingsQuery.refetch} />
        ) : (
          <FlashList
            data={bookings}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 16, paddingTop: 4 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={bookingsQuery.isRefetching}
                onRefresh={bookingsQuery.refetch}
                tintColor={theme.colors.primary}
              />
            }
            onEndReachedThreshold={0.4}
            onEndReached={() => {
              if (bookingsQuery.hasNextPage && !bookingsQuery.isFetchingNextPage) {
                void bookingsQuery.fetchNextPage();
              }
            }}
            ListEmptyComponent={
              <EmptyState
                icon={<CalendarDays size={28} color={theme.colors.primary} />}
                title={t('reservations.empty')}
                description={t('reservations.emptyDesc')}
                actionLabel={t('reservations.browse')}
                onAction={browse}
              />
            }
            ListFooterComponent={
              bookingsQuery.isFetchingNextPage ? <Spinner className="py-4" /> : <View className="h-2" />
            }
            renderItem={({ item }) => (
              <RecordCard
                title={item.package?.name ?? 'Booking'}
                reference={item.reference_number}
                locationName={item.location?.name}
                date={item.booking_date}
                timeLabel={formatTime12h(item.booking_time)}
                status={item.status}
                paymentStatus={item.payment_status}
                amount={item.total_amount}
                meta={`${item.participants} guest${item.participants === 1 ? '' : 's'}`}
              />
            )}
          />
        ))}

      {segment === 'events' &&
        (eventsQuery.isLoading ? (
          <Spinner fullscreen label={t('common.loading')} />
        ) : eventsQuery.error ? (
          <ErrorState error={eventsQuery.error} onRetry={eventsQuery.refetch} />
        ) : (
          <FlashList
            data={eventsQuery.data ?? []}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 16, paddingTop: 4 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={eventsQuery.isRefetching}
                onRefresh={eventsQuery.refetch}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon={<Ticket size={28} color={theme.colors.primary} />}
                title="No event tickets yet"
                description="Your purchased event tickets will appear here."
                actionLabel={t('reservations.browse')}
                onAction={browse}
              />
            }
            renderItem={({ item }) => (
              <RecordCard
                title={item.event?.name ?? 'Event'}
                reference={item.reference_number}
                locationName={item.location?.name}
                date={item.purchase_date}
                timeLabel={formatTime12h(item.purchase_time)}
                status={item.status}
                paymentStatus={item.payment_status}
                amount={item.total_amount}
                meta={`${item.quantity} ticket${item.quantity === 1 ? '' : 's'}`}
              />
            )}
          />
        ))}

      {segment === 'attractions' &&
        (attractionsQuery.isLoading ? (
          <Spinner fullscreen label={t('common.loading')} />
        ) : attractionsQuery.error ? (
          <ErrorState error={attractionsQuery.error} onRetry={attractionsQuery.refetch} />
        ) : (
          <FlashList
            data={attractionsQuery.data ?? []}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ padding: 16, paddingTop: 4 }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={attractionsQuery.isRefetching}
                onRefresh={attractionsQuery.refetch}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon={<Sparkles size={28} color={theme.colors.primary} />}
                title="No attraction tickets yet"
                description="Your purchased attraction tickets will appear here."
                actionLabel={t('reservations.browse')}
                onAction={browse}
              />
            }
            renderItem={({ item }) => (
              <RecordCard
                title={item.attraction?.name ?? 'Attraction'}
                reference={item.reference_number}
                locationName={item.location?.name}
                date={item.purchase_date}
                timeLabel={item.purchase_time ? formatTime12h(item.purchase_time) : undefined}
                status={item.status}
                paymentStatus={item.payment_status}
                amount={item.total_amount}
                meta={`${item.quantity} ticket${item.quantity === 1 ? '' : 's'}`}
              />
            )}
          />
        ))}
    </Screen>
  );
}
