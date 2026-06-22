import { useCallback, useEffect, type ReactNode } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Bell, ChevronRight, MapPin, Sparkles } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, Text, Card, Badge, IconButton, CardSkeleton, Button } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore } from '@/store/locationStore';
import { useLocations } from '@/features/locations/hooks/useLocations';
import {
  useAttractionsByLocation,
  useEventsByLocation,
  usePackagesByLocation,
} from '@/features/catalog/hooks/useCatalog';
import { useUnreadCount } from '@/features/notifications/hooks/useNotifications';
import {
  AttractionCard,
  EventCard,
  PackageCard,
} from '@/features/catalog/components/CatalogCards';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const customer = useAuthStore((s) => s.customer);

  const selectedLocation = useLocationStore((s) => s.selectedLocation);
  const selectedLocationId = useLocationStore((s) => s.selectedLocationId);
  const setLocation = useLocationStore((s) => s.setLocation);

  const locationsQuery = useLocations();
  const unread = useUnreadCount();

  // Auto-select a sensible default location on first run.
  useEffect(() => {
    if (selectedLocationId || !locationsQuery.data?.length) return;
    const first = locationsQuery.data[0];
    if (first) setLocation(first);
  }, [locationsQuery.data, selectedLocationId, setLocation]);

  // Resolve the full selected-location object once locations load.
  useEffect(() => {
    if (selectedLocationId && !selectedLocation && locationsQuery.data) {
      const match = locationsQuery.data.find((l) => l.id === selectedLocationId);
      if (match) setLocation(match);
    }
  }, [selectedLocationId, selectedLocation, locationsQuery.data, setLocation]);

  const packages = usePackagesByLocation(selectedLocationId);
  const attractions = useAttractionsByLocation(selectedLocationId);
  const events = useEventsByLocation(selectedLocationId);

  const onRefresh = useCallback(() => {
    void packages.refetch();
    void attractions.refetch();
    void events.refetch();
  }, [packages, attractions, events]);

  const refreshing =
    packages.isRefetching || attractions.isRefetching || events.isRefetching;

  const locationName = selectedLocation?.name ?? locationsQuery.data?.[0]?.name ?? 'Select location';

  return (
    <Screen edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-3 pt-1">
        <View className="flex-1 pr-3">
          <Text variant="caption">{t('home.greeting', { name: customer?.first_name ?? 'there' })}</Text>
          <Text variant="title" numberOfLines={1}>
            {t('home.subtitle')}
          </Text>
        </View>
        <View className="relative">
          <IconButton
            accessibilityLabel={t('notifications.title')}
            variant="surface"
            onPress={() => navigation.navigate('Tabs', { screen: 'NotificationsTab' })}
          >
            <Bell size={20} color={theme.colors.text} />
          </IconButton>
          {unread.data && unread.data > 0 ? (
            <View className="absolute -right-0.5 -top-0.5 h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1">
              <Text className="text-2xs font-bold text-white">
                {unread.data > 9 ? '9+' : unread.data}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Location selector */}
      <View className="px-4 pb-2">
        <Card padded={false} onPress={() => navigation.navigate('LocationPicker')} className="px-3 py-2.5">
          <View className="flex-row items-center">
            <MapPin size={16} color={theme.colors.primary} />
            <View className="ml-2 flex-1">
              <Text variant="caption">{t('location.change')}</Text>
              <Text variant="label" numberOfLines={1}>
                {locationName}
              </Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textSubtle} />
          </View>
        </Card>
      </View>

      <ScrollView
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        <CatalogSection title={t('home.packages')} loading={packages.isLoading} isEmpty={!packages.data?.length}>
          {packages.data?.map((item) => (
            <PackageCard
              key={item.packageId}
              item={item}
              onPress={() => navigation.navigate('PackageDetail', { packageId: item.packageId, name: item.name })}
            />
          ))}
        </CatalogSection>

        <CatalogSection title={t('home.attractions')} loading={attractions.isLoading} isEmpty={!attractions.data?.length}>
          {attractions.data?.map((item) => (
            <AttractionCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('AttractionDetail', { attractionId: item.id, name: item.name })}
            />
          ))}
        </CatalogSection>

        <CatalogSection title={t('home.events')} loading={events.isLoading} isEmpty={!events.data?.length}>
          {events.data?.map((item) => (
            <EventCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate('EventDetail', { eventId: item.id, name: item.name })}
            />
          ))}
        </CatalogSection>

        {/* Membership CTA */}
        <View className="px-4 pt-2">
          <Card className="overflow-hidden bg-primary">
            <View className="flex-row items-center">
              <View className="flex-1 pr-3">
                <Badge label="Members save more" tone="neutral" className="bg-white/20" />
                <Text className="mt-2 text-lg font-bold text-primary-foreground">
                  Unlock member pricing
                </Text>
                <Text className="mt-0.5 text-sm text-primary-foreground/80">
                  Perks, discounts and priority booking.
                </Text>
                <Button
                  label={t('membership.viewPlans')}
                  variant="secondary"
                  size="sm"
                  className="mt-3 self-start bg-white"
                  onPress={() => navigation.navigate('PurchaseMembership')}
                />
              </View>
              <Sparkles size={56} color="#ffffff" />
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

function CatalogSection({
  title,
  loading,
  isEmpty,
  children,
}: {
  title: string;
  loading: boolean;
  isEmpty: boolean;
  children: ReactNode;
}) {
  if (!loading && isEmpty) return null;
  return (
    <View className="pt-4">
      <Text variant="heading" className="mb-3 px-4">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4"
      >
        {loading ? (
          <>
            <View className="w-44">
              <CardSkeleton />
            </View>
            <View className="w-44">
              <CardSkeleton />
            </View>
          </>
        ) : (
          children
        )}
      </ScrollView>
    </View>
  );
}
