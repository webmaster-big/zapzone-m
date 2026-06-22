import { View } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';
import { initials } from '@/utils/format';

export interface AvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
};

const textSize = {
  sm: 'text-xs',
  md: 'text-base',
  lg: 'text-xl',
};

/** Initials avatar in the brand color. */
export function Avatar({ firstName, lastName, size = 'md', className }: AvatarProps) {
  return (
    <View
      className={cn(
        'items-center justify-center rounded-full bg-primary/15',
        sizeClasses[size],
        className,
      )}
    >
      <Text className={cn('font-semibold text-primary', textSize[size])}>
        {initials(firstName, lastName)}
      </Text>
    </View>
  );
}
