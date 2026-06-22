import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';
import { cn } from '@/utils/cn';

export interface SpinnerProps {
  size?: 'small' | 'large';
  label?: string;
  className?: string;
  fullscreen?: boolean;
}

export function Spinner({ size = 'small', label, className, fullscreen = false }: SpinnerProps) {
  const theme = useTheme();
  return (
    <View
      className={cn(
        'items-center justify-center gap-2',
        fullscreen && 'flex-1',
        className,
      )}
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {label ? <Text variant="caption">{label}</Text> : null}
    </View>
  );
}
