import { type ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '@/utils/cn';

export interface CardProps extends ViewProps {
  className?: string;
  children: ReactNode;
  /** Renders an elevated surface with a subtle shadow. */
  elevated?: boolean;
  /** Makes the whole card pressable. */
  onPress?: () => void;
  padded?: boolean;
}

/** Themed surface container used across lists and detail screens. */
export function Card({
  className,
  children,
  elevated = false,
  onPress,
  padded = true,
  ...props
}: CardProps) {
  const classes = cn(
    'rounded-xl bg-card border border-border-subtle',
    padded && 'p-4',
    elevated && 'shadow-sm shadow-black/5',
    className,
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={cn(classes, 'active:opacity-90')}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={classes} {...props}>
      {children}
    </View>
  );
}
