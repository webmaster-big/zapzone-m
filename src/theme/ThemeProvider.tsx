import { useEffect, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useThemeStore } from '@/store/themeStore';

/**
 * Bridges the app's theme preference (Zustand) into NativeWind's color scheme so
 * `dark:` classNames and CSS-variable tokens resolve correctly, and keeps the
 * resolved scheme in sync with OS appearance changes when in `system` mode.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const scheme = useThemeStore((s) => s.scheme);
  const syncSystemScheme = useThemeStore((s) => s.syncSystemScheme);

  // Apply the resolved scheme to NativeWind.
  useEffect(() => {
    setColorScheme(scheme);
  }, [scheme, setColorScheme]);

  // React to OS-level appearance changes (only affects `system` mode).
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      syncSystemScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, [syncSystemScheme]);

  return <>{children}</>;
}
