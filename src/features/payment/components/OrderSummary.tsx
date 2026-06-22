import { View } from 'react-native';
import { Divider, Text } from '@/components/ui';
import { formatCurrency } from '@/utils/format';

export interface OrderLine {
  label: string;
  amount: number;
  muted?: boolean;
}

export interface OrderSummaryProps {
  lines: OrderLine[];
  total: number;
}

/** Itemized price summary used at the bottom of checkout flows. */
export function OrderSummary({ lines, total }: OrderSummaryProps) {
  return (
    <View className="rounded-xl border border-border-subtle bg-bg-secondary p-4">
      <View className="gap-2">
        {lines.map((line, idx) => (
          <View key={`${line.label}-${idx}`} className="flex-row items-center justify-between">
            <Text variant={line.muted ? 'bodyMuted' : 'body'}>{line.label}</Text>
            <Text variant={line.muted ? 'bodyMuted' : 'body'}>{formatCurrency(line.amount)}</Text>
          </View>
        ))}
      </View>
      <Divider className="my-3" />
      <View className="flex-row items-center justify-between">
        <Text variant="subheading">Total</Text>
        <Text variant="heading" className="text-primary">
          {formatCurrency(total)}
        </Text>
      </View>
    </View>
  );
}
