import type { NavigatorScreenParams } from '@react-navigation/native';

/** Unauthenticated stack. */
export type AuthStackParamList = {
  Login: { redirectReason?: string } | undefined;
  Register: undefined;
};

/** Bottom tab navigator (authenticated home surface). */
export type TabParamList = {
  HomeTab: undefined;
  ReservationsTab: undefined;
  MembershipTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

/** Root stack for the authenticated experience; detail/checkout screens push
 * above the tab bar to keep the user focused during multi-step flows. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  PackageDetail: { packageId: number; name?: string };
  AttractionDetail: { attractionId: number; name?: string };
  EventDetail: { eventId: number; name?: string };
  BookPackage: { packageId: number };
  PurchaseEvent: { eventId: number };
  PurchaseAttraction: { attractionId: number };
  PurchaseMembership: { planId?: number } | undefined;
  BookingDetail: { bookingId: number };
  LocationPicker: undefined;
  CheckoutSuccess: {
    kind: 'booking' | 'event' | 'attraction' | 'membership';
    referenceNumber?: string;
    title?: string;
  };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
