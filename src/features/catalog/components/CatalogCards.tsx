import { Pressable, View } from 'react-native';
import { Clock, Users } from 'lucide-react-native';
import { NetworkImage, PriceTag, Text } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import { formatDuration } from '@/utils/format';
import { formatLongDate } from '@/utils/date';
import type { Attraction, AppEvent } from '@/types/models';
import type { PackageCatalogItem } from '../types';

const CARD_WIDTH = 'w-44';

/** Package catalog card (horizontal carousel item). */
export function PackageCard({
  item,
  onPress,
}: {
  item: PackageCatalogItem;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className={`${CARD_WIDTH} overflow-hidden rounded-xl border border-border-subtle bg-card active:opacity-90`}
    >
      <NetworkImage source={item.image} className="h-28 w-full" />
      <View className="gap-1 p-3">
        <Text variant="subheading" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Clock size={12} color={theme.colors.textSubtle} />
            <Text variant="caption">{formatDuration(item.duration, item.durationUnit)}</Text>
          </View>
          {item.maxParticipants ? (
            <View className="flex-row items-center gap-1">
              <Users size={12} color={theme.colors.textSubtle} />
              <Text variant="caption">{item.maxParticipants}</Text>
            </View>
          ) : null}
        </View>
        <PriceTag amount={item.price} prefix="from" size="sm" className="mt-1" />
      </View>
    </Pressable>
  );
}

/** Attraction catalog card. */
export function AttractionCard({
  item,
  onPress,
}: {
  item: Attraction;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`${CARD_WIDTH} overflow-hidden rounded-xl border border-border-subtle bg-card active:opacity-90`}
    >
      <NetworkImage source={item.image} className="h-28 w-full" />
      <View className="gap-1 p-3">
        <Text variant="subheading" numberOfLines={1}>
          {item.name}
        </Text>
        {item.category ? (
          <Text variant="caption" numberOfLines={1}>
            {item.category}
          </Text>
        ) : null}
        <PriceTag amount={item.price} size="sm" className="mt-1" />
      </View>
    </Pressable>
  );
}

/** Event catalog card. */
export function EventCard({ item, onPress }: { item: AppEvent; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`${CARD_WIDTH} overflow-hidden rounded-xl border border-border-subtle bg-card active:opacity-90`}
    >
      <NetworkImage source={item.image} className="h-28 w-full" />
      <View className="gap-1 p-3">
        <Text variant="subheading" numberOfLines={1}>
          {item.name}
        </Text>
        <Text variant="caption" numberOfLines={1}>
          {formatLongDate(item.start_date)}
        </Text>
        <PriceTag amount={item.price} size="sm" className="mt-1" />
      </View>
    </Pressable>
  );
}
