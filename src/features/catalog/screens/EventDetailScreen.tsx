import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Calendar, Clock, Check } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import {
  Screen,
  Text,
  Button,
  NetworkImage,
  PriceTag,
  Spinner,
  ErrorState,
  Divider,
} from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import { useEventDetail } from '@/features/catalog/hooks/useCatalog';
import { formatLongDate } from '@/utils/date';
import { formatTime12h } from '@/utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export function EventDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { eventId } = route.params;
  const { data, isLoading, error, refetch } = useEventDetail(eventId);

  if (isLoading) return <Screen><Spinner fullscreen label="Loading event…" /></Screen>;
  if (error || !data) return <Screen><ErrorState error={error} onRetry={refetch} /></Screen>;

  const dateLabel =
    data.date_type === 'date_range' && data.end_date
      ? `${formatLongDate(data.start_date)} – ${formatLongDate(data.end_date)}`
      : formatLongDate(data.start_date);

  return (
    <Screen edges={['bottom']}>
      <ScrollView contentContainerClassName="pb-4" showsVerticalScrollIndicator={false}>
        <NetworkImage source={data.image} className="h-56 w-full" />
        <View className="px-4 pt-4">
          <Text variant="title">{data.name}</Text>

          <View className="mt-3 gap-2">
            <View className="flex-row items-center gap-2">
              <Calendar size={15} color={theme.colors.primary} />
              <Text variant="body">{dateLabel}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Clock size={15} color={theme.colors.primary} />
              <Text variant="body">
                {formatTime12h(data.time_start)} – {formatTime12h(data.time_end)}
              </Text>
            </View>
          </View>

          {data.description ? (
            <>
              <Divider className="my-4" />
              <Text variant="subheading" className="mb-1.5">
                About
              </Text>
              <Text variant="bodyMuted">{data.description}</Text>
            </>
          ) : null}

          {data.features && data.features.length > 0 ? (
            <>
              <Divider className="my-4" />
              <Text variant="subheading" className="mb-2">
                What&apos;s included
              </Text>
              <View className="gap-2">
                {data.features.map((feature, idx) => (
                  <View key={`${feature}-${idx}`} className="flex-row items-center gap-2">
                    <Check size={16} color={theme.colors.success} />
                    <Text variant="body">{feature}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between border-t border-border-subtle bg-card px-4 py-3">
        <View>
          <Text variant="caption">Per ticket</Text>
          <PriceTag amount={data.price} size="lg" />
        </View>
        <Button
          label="Get tickets"
          size="lg"
          onPress={() => navigation.navigate('PurchaseEvent', { eventId })}
          className="px-8"
        />
      </View>
    </Screen>
  );
}
