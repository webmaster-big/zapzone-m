import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { WifiOff } from 'lucide-react-native';
import { useNetworkStatus } from '@/lib/network/network';
import { Text } from './Text';

/**
 * Self-contained offline indicator. Renders as a floating pill near the bottom
 * of the screen (above the tab bar) so it never disrupts navigation layout.
 */
export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const offline = !isConnected || isInternetReachable === false;

  if (!offline) return null;

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 70 }}
      className="items-center"
    >
      <View className="flex-row items-center gap-2 rounded-full bg-foreground px-3.5 py-2 shadow-md shadow-black/20">
        <WifiOff size={13} color="#ffffff" />
        <Text className="text-xs font-medium text-white">You&apos;re offline — showing saved data</Text>
      </View>
    </Animated.View>
  );
}
