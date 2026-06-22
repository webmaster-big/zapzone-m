import { View } from 'react-native';
import { Calendar, Hash, MapPin } from 'lucide-react-native';
import { Badge, Card, PriceTag, Text, statusTone } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import { humanize } from '@/utils/format';
import { formatRelativeDay } from '@/utils/date';

export interface RecordCardProps {
  title: string;
  reference?: string | null;
  locationName?: string | null;
  date?: string | null;
  timeLabel?: string | null;
  status?: string | null;
  paymentStatus?: string | null;
  amount?: number | string | null;
  meta?: string | null;
  onPress?: () => void;
}

/** Unified card for reservations and ticket purchases in list views. */
export function RecordCard({
  title,
  reference,
  locationName,
  date,
  timeLabel,
  status,
  paymentStatus,
  amount,
  meta,
  onPress,
}: RecordCardProps) {
  const theme = useTheme();
  return (
    <Card onPress={onPress} elevated>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text variant="subheading" numberOfLines={1}>
            {title}
          </Text>
          {meta ? (
            <Text variant="caption" className="mt-0.5">
              {meta}
            </Text>
          ) : null}
        </View>
        {status ? <Badge label={humanize(status)} tone={statusTone(status)} /> : null}
      </View>

      <View className="mt-3 gap-1.5">
        {date ? (
          <View className="flex-row items-center gap-2">
            <Calendar size={13} color={theme.colors.textSubtle} />
            <Text variant="caption">
              {formatRelativeDay(date)}
              {timeLabel ? ` · ${timeLabel}` : ''}
            </Text>
          </View>
        ) : null}
        {locationName ? (
          <View className="flex-row items-center gap-2">
            <MapPin size={13} color={theme.colors.textSubtle} />
            <Text variant="caption">{locationName}</Text>
          </View>
        ) : null}
        {reference ? (
          <View className="flex-row items-center gap-2">
            <Hash size={13} color={theme.colors.textSubtle} />
            <Text variant="caption">{reference}</Text>
          </View>
        ) : null}
      </View>

      {(amount != null || paymentStatus) && (
        <View className="mt-3 flex-row items-center justify-between border-t border-border-subtle pt-3">
          {amount != null ? <PriceTag amount={amount} size="sm" /> : <View />}
          {paymentStatus ? <Badge label={humanize(paymentStatus)} tone={statusTone(paymentStatus)} /> : null}
        </View>
      )}
    </Card>
  );
}
