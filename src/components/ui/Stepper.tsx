import { Pressable, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { cn } from '@/utils/cn';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/** Compact +/- quantity stepper for participants, ticket counts and add-ons. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  className,
}: StepperProps) {
  const theme = useTheme();
  const canDecrement = value > min;
  const canIncrement = value < max;

  const decrement = () => canDecrement && onChange(Math.max(min, value - step));
  const increment = () => canIncrement && onChange(Math.min(max, value + step));

  return (
    <View className={cn('flex-row items-center gap-3', className)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease"
        onPress={decrement}
        disabled={!canDecrement}
        hitSlop={8}
        className={cn(
          'h-8 w-8 items-center justify-center rounded-lg border border-border active:opacity-70',
          !canDecrement && 'opacity-40',
        )}
      >
        <Minus size={16} color={theme.colors.text} />
      </Pressable>
      <Text variant="subheading" className="min-w-7 text-center">
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase"
        onPress={increment}
        disabled={!canIncrement}
        hitSlop={8}
        className={cn(
          'h-8 w-8 items-center justify-center rounded-lg border border-border active:opacity-70',
          !canIncrement && 'opacity-40',
        )}
      >
        <Plus size={16} color={theme.colors.text} />
      </Pressable>
    </View>
  );
}
