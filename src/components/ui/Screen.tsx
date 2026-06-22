import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

export interface ScreenProps extends ViewProps {
  children: ReactNode;
  className?: string;
  /** Apply horizontal screen padding. */
  padded?: boolean;
  /** Which safe-area edges to inset. Defaults to top + bottom. */
  edges?: readonly Edge[];
  /** Use the secondary (slightly tinted) background. */
  secondary?: boolean;
}

/** Root screen wrapper that handles safe-area insets and the themed background. */
export function Screen({
  children,
  className,
  padded = false,
  edges = ['top', 'bottom'],
  secondary = false,
  ...props
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1', secondary ? 'bg-bg-secondary' : 'bg-bg')}>
      <View className={cn('flex-1', padded && 'px-4', className)} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}
