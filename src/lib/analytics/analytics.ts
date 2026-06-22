import { IS_DEV } from '@/config/env';
import { addBreadcrumb } from '@/lib/sentry';

/**
 * Analytics abstraction.
 *
 * The booking platform mirrors the web app's conversion funnel (view ->
 * initiate -> complete). We expose a provider-agnostic API so the underlying
 * vendor can be swapped without touching feature code.
 *
 * Current providers:
 *  - `ConsoleAnalyticsProvider` (dev logging + Sentry breadcrumbs)
 *
 * To enable Firebase Analytics:
 *  1. `npx expo install @react-native-firebase/app @react-native-firebase/analytics`
 *  2. Add the config plugin + `google-services.json` / `GoogleService-Info.plist`.
 *  3. Implement `FirebaseAnalyticsProvider` below and register it in `analytics`.
 * Firebase requires a custom dev build (it does not run in Expo Go).
 */

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/** Canonical event names — keep in sync with the web funnel semantics. */
export const AnalyticsEvent = {
  ScreenView: 'screen_view',
  Login: 'login',
  SignUp: 'sign_up',
  ViewPackage: 'view_package',
  ViewAttraction: 'view_attraction',
  ViewEvent: 'view_event',
  ViewItemList: 'view_item_list',
  BeginCheckout: 'begin_checkout',
  AddPaymentInfo: 'add_payment_info',
  Purchase: 'purchase',
  BookingCompleted: 'booking_completed',
  MembershipPurchased: 'membership_purchased',
  SelectLocation: 'select_location',
} as const;

export interface AnalyticsProvider {
  logEvent(name: string, params?: AnalyticsParams): void;
  logScreenView(screenName: string, screenClass?: string): void;
  setUserId(id: string | null): void;
  setUserProperties(props: Record<string, string>): void;
}

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  logEvent(name: string, params?: AnalyticsParams): void {
    addBreadcrumb({ category: 'analytics', message: name, data: params, level: 'info' });
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log('[analytics]', name, params ?? {});
    }
  }
  logScreenView(screenName: string, screenClass?: string): void {
    this.logEvent(AnalyticsEvent.ScreenView, {
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  }
  setUserId(id: string | null): void {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log('[analytics] setUserId', id);
    }
  }
  setUserProperties(props: Record<string, string>): void {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.log('[analytics] setUserProperties', props);
    }
  }
}

const provider: AnalyticsProvider = new ConsoleAnalyticsProvider();

export const analytics = {
  logEvent: (name: string, params?: AnalyticsParams) => provider.logEvent(name, params),
  logScreenView: (screenName: string, screenClass?: string) =>
    provider.logScreenView(screenName, screenClass),
  setUserId: (id: string | null) => provider.setUserId(id),
  setUserProperties: (props: Record<string, string>) => provider.setUserProperties(props),
};
