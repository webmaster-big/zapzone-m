import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Compact iOS-style segmented control used for inline filters. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View className={cn('flex-row rounded-lg bg-bg-secondary p-1', className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={cn(
              'flex-1 items-center justify-center rounded-md py-1.5',
              selected && 'bg-card shadow-sm shadow-black/5',
            )}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                selected ? 'text-foreground' : 'text-subtle',
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
