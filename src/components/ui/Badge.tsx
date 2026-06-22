import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, { bg: string; text: string }> = {
  neutral: { bg: 'bg-bg-secondary', text: 'text-muted' },
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  danger: { bg: 'bg-danger/10', text: 'text-danger' },
  info: { bg: 'bg-info/10', text: 'text-info' },
};

/** Compact status pill. */
export function Badge({ label, tone = 'neutral', className }: BadgeProps) {
  const classes = toneClasses[tone];
  return (
    <View className={cn('self-start rounded-full px-2.5 py-0.5', classes.bg, className)}>
      <Text className={cn('text-2xs font-semibold uppercase tracking-wide', classes.text)}>
        {label}
      </Text>
    </View>
  );
}

/** Maps a booking/purchase status to an appropriate badge tone. */
export function statusTone(status?: string | null): BadgeTone {
  switch (status) {
    case 'confirmed':
    case 'completed':
    case 'paid':
    case 'active':
      return 'success';
    case 'pending':
    case 'partial':
    case 'past_due':
    case 'frozen':
      return 'warning';
    case 'cancelled':
    case 'canceled':
    case 'expired':
    case 'voided':
    case 'suspended':
      return 'danger';
    case 'checked-in':
      return 'info';
    default:
      return 'neutral';
  }
}
