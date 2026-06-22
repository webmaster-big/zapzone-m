import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { PREF_KEYS, prefs } from '@/lib/storage/mmkv';
import { captureException } from '@/lib/sentry';

/**
 * Foreground presentation: show banners + play sound while the app is open so
 * customers see booking confirmations and reminders immediately.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Requests permission and returns the Expo push token. The token can be sent to
 * the backend to associate the device with the customer for push delivery.
 * Safe to call on every launch — it caches the token in MMKV.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    // Push tokens are not available on simulators/emulators.
    return null;
  }

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563eb',
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (existing !== 'granted') {
      const result = await Notifications.requestPermissionsAsync();
      status = result.status;
    }
    if (status !== 'granted') return null;

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    const token = tokenResponse.data;
    prefs.setString(PREF_KEYS.pushToken, token);
    return token;
  } catch (error) {
    captureException(error, { scope: 'registerForPushNotifications' });
    return null;
  }
}

export function getCachedPushToken(): string | undefined {
  return prefs.getString(PREF_KEYS.pushToken);
}
