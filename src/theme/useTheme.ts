import { useMemo } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { getColors, radii, spacing, type ColorSchemeName, type ThemeColors } from './tokens';

export interface Theme {
  scheme: ColorSchemeName;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
}

/**
 * Active theme for imperative/JS styling needs (navigation, status bar, charts,
 * icon colors). For declarative styling prefer NativeWind classNames, which read
 * the same tokens via CSS variables.
 */
export function useTheme(): Theme {
  const scheme = useThemeStore((s) => s.scheme);
  return useMemo(
    () => ({
      scheme,
      isDark: scheme === 'dark',
      colors: getColors(scheme),
      spacing,
      radii,
    }),
    [scheme],
  );
}
