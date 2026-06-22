import './global.css';
import 'react-native-gesture-handler';

import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { AppProviders } from '@/providers/AppProviders';
import { RootNavigator } from '@/navigation/RootNavigator';
import { linking } from '@/navigation/linking';
import { navigationDarkTheme, navigationLightTheme } from '@/navigation/navigationTheme';
import { OfflineBanner } from '@/components/ui';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { setUnauthorizedHandler } from '@/lib/api/client';
import { setupQueryPersistence } from '@/lib/query/queryClient';
import { configureOnlineManager } from '@/lib/network/network';
import { initSentry } from '@/lib/sentry';
import { initI18n } from '@/lib/i18n';
import { registerForPushNotifications } from '@/lib/notifications/push';

// Initialize cross-cutting concerns as early as possible.
initSentry();
initI18n();
setupQueryPersistence();
configureOnlineManager();

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const [bootstrapped, setBootstrapped] = useState(false);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const signOut = useAuthStore((s) => s.signOut);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    // On 401 anywhere, clear the session and return to the auth flow.
    setUnauthorizedHandler(() => {
      void signOut();
    });

    void (async () => {
      await bootstrap();
      setBootstrapped(true);
    })();

    return () => setUnauthorizedHandler(null);
  }, [bootstrap, signOut]);

  // Register for push once the user is known (best-effort, non-blocking).
  useEffect(() => {
    if (bootstrapped) {
      void registerForPushNotifications();
    }
  }, [bootstrapped]);

  const ready = fontsLoaded && bootstrapped;

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <AppProviders>
      <AppShell onLayout={onLayoutRootView} />
    </AppProviders>
  );
}

function AppShell({ onLayout }: { onLayout: () => void }) {
  const scheme = useThemeStore((s) => s.scheme);
  const isDark = scheme === 'dark';

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={isDark ? navigationDarkTheme : navigationLightTheme} linking={linking}>
        <RootNavigator />
      </NavigationContainer>
      <OfflineBanner />
    </View>
  );
}
