import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/utils/cn';

export interface SkeletonProps {
  className?: string;
}

/** Animated shimmer placeholder used in place of spinners during loads. */
export function Skeleton({ className }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={style} className={cn('rounded-md bg-skeleton', className)} />;
}

/** Common skeleton arrangement for a catalog card. */
export function CardSkeleton() {
  return (
    <View className="rounded-xl bg-card border border-border-subtle p-3">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <Skeleton className="mt-3 h-7 w-24 rounded-lg" />
    </View>
  );
}

/** Common skeleton arrangement for a list row. */
export function ListRowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 rounded-xl bg-card border border-border-subtle p-3">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <View className="flex-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-2 h-3 w-1/3" />
      </View>
      <Skeleton className="h-6 w-16 rounded-full" />
    </View>
  );
}
