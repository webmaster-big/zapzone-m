/**
 * JavaScript design tokens — the source of truth for values that cannot be
 * expressed as Tailwind classNames (navigation theme, status bar, charts,
 * skeleton shimmer, bottom-sheet handles, etc.). These mirror the CSS variables
 * declared in `global.css` and the web app's light/dark palettes.
 */

export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  card: string;
  input: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderSubtle: string;
  nav: string;
  navActive: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  skeleton: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  bg: '#ffffff',
  bgSecondary: '#f8fafc',
  card: '#ffffff',
  input: '#ffffff',
  text: '#0f172a',
  textMuted: '#475569',
  textSubtle: '#64748b',
  border: '#e2e8f0',
  borderSubtle: '#f1f5f9',
  nav: '#ffffff',
  navActive: '#2563eb',
  primary: '#2563eb',
  primaryForeground: '#ffffff',
  secondary: '#8b5cf6',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#2563eb',
  skeleton: '#e2e8f0',
  overlay: 'rgba(15, 23, 42, 0.45)',
};

export const darkColors: ThemeColors = {
  bg: '#0f0f11',
  bgSecondary: '#1f1f23',
  card: '#18181b',
  input: '#27272a',
  text: '#fafafa',
  textMuted: '#d4d4d8',
  textSubtle: '#a1a1aa',
  border: '#3f3f46',
  borderSubtle: '#27272a',
  nav: '#18181b',
  navActive: '#60a5fa',
  primary: '#60a5fa',
  primaryForeground: '#09090b',
  secondary: '#a78bfa',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#f87171',
  info: '#60a5fa',
  skeleton: '#27272a',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

/** 4px base spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

export const fontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export type ColorSchemeName = 'light' | 'dark';

export function getColors(scheme: ColorSchemeName): ThemeColors {
  return scheme === 'dark' ? darkColors : lightColors;
}
