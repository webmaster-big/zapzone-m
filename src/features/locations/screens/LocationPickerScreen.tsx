import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Check, MapPin } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Screen, Text, Spinner, ErrorState, Divider } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { useLocationStore } from '@/store/locationStore';
import type { Location } from '@/types/models';

export function LocationPickerScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { data, isLoading, error, refetch } = useLocations();
  const selectedId = useLocationStore((s) => s.selectedLocationId);
  const setLocation = useLocationStore((s) => s.setLocation);

  const onSelect = (location: Location) => {
    setLocation(location);
    navigation.goBack();
  };

  if (isLoading) return <Screen><Spinner fullscreen label="Loading locations…" /></Screen>;
  if (error) return <Screen><ErrorState error={error} onRetry={refetch} /></Screen>;

  return (
    <Screen>
      <View className="px-4 pb-2 pt-2">
        <Text variant="title">Choose your ZapZone</Text>
        <Text variant="bodyMuted" className="mt-1">
          Pick a location to see what&apos;s available nearby.
        </Text>
      </View>
      <FlashList
        data={data ?? []}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => {
          const selected = item.id === selectedId;
          return (
            <Pressable
              onPress={() => onSelect(item)}
              className="flex-row items-center py-3 active:opacity-70"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MapPin size={18} color={theme.colors.primary} />
              </View>
              <View className="ml-3 flex-1">
                <Text variant="subheading" numberOfLines={1}>
                  {item.name}
                </Text>
                {(item.city || item.state) && (
                  <Text variant="caption" numberOfLines={1}>
                    {[item.address, item.city, item.state].filter(Boolean).join(', ')}
                  </Text>
                )}
              </View>
              {selected ? <Check size={20} color={theme.colors.primary} /> : null}
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}
