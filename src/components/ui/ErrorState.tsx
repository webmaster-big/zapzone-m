import { View } from 'react-native';
import { CloudOff, TriangleAlert } from 'lucide-react-native';
import type { NormalizedApiError } from '@/types/api';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';
import { Button } from './Button';

export interface ErrorStateProps {
  error?: NormalizedApiError | null;
  onRetry?: () => void;
  className?: string;
}

/** Full-area error view with retry, with distinct copy for offline failures. */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const theme = useTheme();
  const isNetwork = error?.isNetworkError;
  const title = isNetwork ? 'No connection' : 'Something went wrong';
  const message =
    error?.message ??
    'We hit a snag loading this. Please try again.';

  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        {isNetwork ? (
          <CloudOff size={28} color={theme.colors.danger} />
        ) : (
          <TriangleAlert size={28} color={theme.colors.danger} />
        )}
      </View>
      <Text variant="subheading" className="text-center">
        {title}
      </Text>
      <Text variant="bodyMuted" className="mt-1.5 text-center">
        {message}
      </Text>
      {onRetry ? (
        <Button label="Try again" onPress={onRetry} variant="outline" size="md" className="mt-5" />
      ) : null}
    </View>
  );
}
