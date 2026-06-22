import { forwardRef, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';
import { useTheme } from '@/theme/useTheme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  className?: string;
}

/** Themed text field with label, helper text and error state. */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, containerClassName, className, ...props },
  ref,
) {
  const theme = useTheme();
  const hasError = Boolean(error);

  return (
    <View className={cn('w-full', containerClassName)}>
      {label ? <Text variant="label" className="mb-1.5">{label}</Text> : null}
      <View
        className={cn(
          'h-11 flex-row items-center rounded-lg border bg-input px-3',
          hasError ? 'border-danger' : 'border-border',
        )}
      >
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
        <TextInput
          ref={ref}
          className={cn('h-full flex-1 font-sans text-base text-foreground', className)}
          placeholderTextColor={theme.colors.textSubtle}
          {...props}
        />
        {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text className="mt-1 text-xs text-danger">{error}</Text>
      ) : hint ? (
        <Text className="mt-1 text-xs text-subtle">{hint}</Text>
      ) : null}
    </View>
  );
});
