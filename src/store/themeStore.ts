import { create } from 'zustand';
import { Appearance } from 'react-native';
import { PREF_KEYS, prefs } from '@/lib/storage/mmkv';
import type { ColorSchemeName } from '@/theme/tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  /** User preference. */
  mode: ThemeMode;
  /** Resolved scheme actually applied to the UI. */
  scheme: ColorSchemeName;
  setMode: (mode: ThemeMode) => void;
  /** Called when the OS appearance changes (only matters in `system` mode). */
  syncSystemScheme: (system: ColorSchemeName) => void;
}

function resolveScheme(mode: ThemeMode, system: ColorSchemeName): ColorSchemeName {
  return mode === 'system' ? system : mode;
}

const initialMode = (prefs.getString(PREF_KEYS.themeMode) as ThemeMode | undefined) ?? 'system';
const initialSystem: ColorSchemeName = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: initialMode,
  scheme: resolveScheme(initialMode, initialSystem),
  setMode: (mode) => {
    prefs.setString(PREF_KEYS.themeMode, mode);
    const system: ColorSchemeName = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
    set({ mode, scheme: resolveScheme(mode, system) });
  },
  syncSystemScheme: (system) => {
    const { mode } = get();
    if (mode === 'system') {
      set({ scheme: system });
    }
  },
}));
