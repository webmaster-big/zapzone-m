import { type ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { cn } from '@/utils/cn';

export interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode;
  className?: string;
  /** Visual treatment. */
  variant?: 'plain' | 'surface';
  accessibilityLabel: string;
}

/** Compact pressable wrapper for icons in headers, cards and list rows. */
export function IconButton({
  children,
  className,
  variant = 'plain',
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={10}
      className={cn(
        'h-9 w-9 items-center justify-center rounded-full active:opacity-70',
        variant === 'surface' && 'bg-bg-secondary',
        className,
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}
