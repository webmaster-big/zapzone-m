import { type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  right?: ReactNode;
  className?: string;
}

/** Row with a section title and an optional trailing action / node. */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
  right,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn('flex-row items-center justify-between', className)}>
      <Text variant="subheading">{title}</Text>
      {right ??
        (actionLabel && onAction ? (
          <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
            <Text className="text-sm font-medium text-primary">{actionLabel}</Text>
          </Pressable>
        ) : null)}
    </View>
  );
}
