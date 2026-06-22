import { type ReactNode } from 'react';
import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';
import { useTheme } from '@/theme/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/*
 * Compact button system — intentionally smaller than typical mobile buttons
 * per the ZapZone spec, while keeping the tap area accessible via `hitSlop`.
 * Heights: sm 32px, md 38px (default), lg 44px.
 */
const containerBase =
  'flex-row items-center justify-center rounded-lg active:opacity-80';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 gap-1.5',
  md: 'h-[38px] px-4 gap-2',
  lg: 'h-11 px-5 gap-2',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'bg-transparent border border-border',
  ghost: 'bg-transparent',
  danger: 'bg-danger',
};

const labelSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const labelToneClasses: Record<ButtonVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-white',
  outline: 'text-foreground',
  ghost: 'text-primary',
  danger: 'text-white',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const spinnerColor =
    variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#ffffff';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      hitSlop={8}
      className={cn(
        containerBase,
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <>
          {leftIcon ? <View>{leftIcon}</View> : null}
          {label ? (
            <Text
              className={cn('font-semibold', labelSizeClasses[size], labelToneClasses[variant])}
            >
              {label}
            </Text>
          ) : (
            children
          )}
          {rightIcon ? <View>{rightIcon}</View> : null}
        </>
      )}
    </Pressable>
  );
}
