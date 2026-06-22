import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Deep linking configuration. Supports the custom `zapzone://` scheme and
 * universal/app links from `https://booking.zap-zone.com`, mapping web-style
 * customer paths onto the native screens so notifications and shared links open
 * the right place.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'zapzone://', 'https://booking.zap-zone.com'],
  config: {
    screens: {
      Tabs: {
        screens: {
          HomeTab: 'home',
          ReservationsTab: 'reservations',
          MembershipTab: 'membership',
          NotificationsTab: 'notifications',
          ProfileTab: 'profile',
        },
      },
      PackageDetail: 'package/:packageId',
      AttractionDetail: 'attraction/:attractionId',
      EventDetail: 'event/:eventId',
      BookPackage: 'book/package/:packageId',
      PurchaseEvent: 'purchase/event/:eventId',
      PurchaseAttraction: 'purchase/attraction/:attractionId',
      PurchaseMembership: 'membership/purchase',
      LocationPicker: 'locations',
    },
  },
};
