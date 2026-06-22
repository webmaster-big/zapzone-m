import { Pressable } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

/** Compact selectable chip used for dates, time slots and filters. */
export function Chip({ label, selected = false, onPress, disabled = false, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      className={cn(
        'h-9 items-center justify-center rounded-lg border px-3.5 active:opacity-80',
        selected ? 'border-primary bg-primary' : 'border-border bg-card',
        disabled && 'opacity-40',
        className,
      )}
    >
      <Text
        className={cn(
          'text-sm font-medium',
          selected ? 'text-primary-foreground' : 'text-foreground',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
