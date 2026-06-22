import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { darkColors, lightColors } from '@/theme/tokens';

/** React Navigation themes derived from the ZapZone design tokens. */
export const navigationLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.bg,
    card: lightColors.nav,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.danger,
  },
};

export const navigationDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.primary,
    background: darkColors.bg,
    card: darkColors.nav,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.danger,
  },
};
