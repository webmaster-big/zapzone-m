import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cn } from '@/utils/cn';

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyMuted'
  | 'caption'
  | 'label'
  | 'overline';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
  /** Convenience color overrides. */
  tone?: 'default' | 'muted' | 'subtle' | 'primary' | 'danger' | 'success' | 'inverse';
}

const variantClasses: Record<TextVariant, string> = {
  display: 'font-bold text-4xl text-foreground',
  title: 'font-bold text-2xl text-foreground',
  heading: 'font-semibold text-xl text-foreground',
  subheading: 'font-semibold text-base text-foreground',
  body: 'font-sans text-base text-foreground',
  bodyMuted: 'font-sans text-base text-muted',
  caption: 'font-sans text-xs text-subtle',
  label: 'font-medium text-sm text-foreground',
  overline: 'font-semibold text-2xs uppercase tracking-wide text-subtle',
};

const toneClasses: Record<NonNullable<TextProps['tone']>, string> = {
  default: 'text-foreground',
  muted: 'text-muted',
  subtle: 'text-subtle',
  primary: 'text-primary',
  danger: 'text-danger',
  success: 'text-success',
  inverse: 'text-primary-foreground',
};

/** Themed typography primitive. Defaults to Poppins via the `font-*` classes. */
export function Text({ variant = 'body', tone, className, ...props }: TextProps) {
  return (
    <RNText
      className={cn(variantClasses[variant], tone && toneClasses[tone], className)}
      {...props}
    />
  );
}
