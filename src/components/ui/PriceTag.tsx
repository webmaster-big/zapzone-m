import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';
import { Text } from './Text';

export interface PriceTagProps {
  amount: number | string;
  /** Optional prefix like "from". */
  prefix?: string;
  /** Optional suffix like "/ person". */
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const amountSize = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

/** Consistent price presentation across catalog and checkout. */
export function PriceTag({ amount, prefix, suffix, size = 'md', className }: PriceTagProps) {
  return (
    <View className={cn('flex-row items-baseline gap-1', className)}>
      {prefix ? <Text className="text-xs text-subtle">{prefix}</Text> : null}
      <Text className={cn('font-bold text-primary', amountSize[size])}>
        {formatCurrency(amount)}
      </Text>
      {suffix ? <Text className="text-xs text-subtle">{suffix}</Text> : null}
    </View>
  );
}
