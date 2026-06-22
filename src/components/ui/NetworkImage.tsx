import { Image, type ImageContentFit } from 'expo-image';
import { View } from 'react-native';
import { ImageOff } from 'lucide-react-native';
import { cn } from '@/utils/cn';
import { getImageUrl } from '@/utils/format';
import { useTheme } from '@/theme/useTheme';

const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export interface NetworkImageProps {
  source?: string | string[] | null;
  className?: string;
  contentFit?: ImageContentFit;
  /** Rounded corners radius preset via className is preferred; this is a fallback. */
  rounded?: boolean;
}

/**
 * Cached, progressive image backed by expo-image. Resolves API storage paths to
 * absolute URLs and shows a graceful placeholder when no image is available.
 */
export function NetworkImage({
  source,
  className,
  contentFit = 'cover',
  rounded = false,
}: NetworkImageProps) {
  const theme = useTheme();
  const uri = getImageUrl(source);

  if (!uri) {
    return (
      <View
        className={cn(
          'items-center justify-center bg-bg-secondary',
          rounded && 'rounded-lg',
          className,
        )}
      >
        <ImageOff size={22} color={theme.colors.textSubtle} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      placeholder={{ blurhash: BLURHASH }}
      contentFit={contentFit}
      transition={200}
      cachePolicy="memory-disk"
      className={cn(rounded && 'rounded-lg', className)}
    />
  );
}
