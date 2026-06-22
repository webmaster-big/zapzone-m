import { type ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** Friendly empty/zero-data state with an optional call to action. */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center px-8 py-12', className)}>
      {icon ? (
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </View>
      ) : null}
      <Text variant="subheading" className="text-center">
        {title}
      </Text>
      {description ? (
        <Text variant="bodyMuted" className="mt-1.5 text-center">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="primary" size="md" className="mt-5" />
      ) : null}
    </View>
  );
}
