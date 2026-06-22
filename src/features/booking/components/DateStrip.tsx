import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { addDays, format } from 'date-fns';
import { cn } from '@/utils/cn';
import { Text } from '@/components/ui';
import { toISODate } from '@/utils/date';

export interface DateStripProps {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  /** Number of days to show starting today. */
  days?: number;
  /** Earliest selectable offset from today (e.g. min booking notice). */
  startOffset?: number;
}

/** Horizontal scrollable date picker (weekday + day number chips). */
export function DateStrip({ selectedDate, onSelect, days = 21, startOffset = 0 }: DateStripProps) {
  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => addDays(today, i + startOffset));
  }, [days, startOffset]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
    >
      {dates.map((date) => {
        const iso = toISODate(date);
        const selected = iso === selectedDate;
        return (
          <Pressable
            key={iso}
            onPress={() => onSelect(iso)}
            className={cn(
              'h-16 w-14 items-center justify-center rounded-xl border active:opacity-80',
              selected ? 'border-primary bg-primary' : 'border-border bg-card',
            )}
          >
            <Text
              className={cn('text-2xs font-medium uppercase', selected ? 'text-primary-foreground/80' : 'text-subtle')}
            >
              {format(date, 'EEE')}
            </Text>
            <Text
              className={cn('text-lg font-bold', selected ? 'text-primary-foreground' : 'text-foreground')}
            >
              {format(date, 'd')}
            </Text>
            <View className="h-px" />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
