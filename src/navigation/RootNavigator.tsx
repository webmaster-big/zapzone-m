import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { RootTabs } from './RootTabs';
import { AuthNavigator } from './AuthNavigator';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/theme/useTheme';
import { fontFamily } from '@/theme/tokens';
import { PackageDetailScreen } from '@/features/catalog/screens/PackageDetailScreen';
import { AttractionDetailScreen } from '@/features/catalog/screens/AttractionDetailScreen';
import { EventDetailScreen } from '@/features/catalog/screens/EventDetailScreen';
import { BookPackageScreen } from '@/features/booking/screens/BookPackageScreen';
import { PurchaseEventScreen } from '@/features/purchases/screens/PurchaseEventScreen';
import { PurchaseAttractionScreen } from '@/features/purchases/screens/PurchaseAttractionScreen';
import { PurchaseMembershipScreen } from '@/features/memberships/screens/PurchaseMembershipScreen';
import { CheckoutSuccessScreen } from '@/features/shared/screens/CheckoutSuccessScreen';
import { LocationPickerScreen } from '@/features/locations/screens/LocationPickerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();
  const status = useAuthStore((s) => s.status);

  // Auth gate: show the auth flow until a session is restored/created.
  if (status !== 'authenticated') {
    return <AuthNavigator />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.nav },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontFamily: fontFamily.semibold, fontSize: 16 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen name="Tabs" component={RootTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PackageDetail" component={PackageDetailScreen} options={{ title: 'Package', headerBackTitle: 'Back' }} />
      <Stack.Screen name="AttractionDetail" component={AttractionDetailScreen} options={{ title: 'Attraction', headerBackTitle: 'Back' }} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Event', headerBackTitle: 'Back' }} />
      <Stack.Screen name="BookPackage" component={BookPackageScreen} options={{ title: 'Book', headerBackTitle: 'Back' }} />
      <Stack.Screen name="PurchaseEvent" component={PurchaseEventScreen} options={{ title: 'Tickets', headerBackTitle: 'Back' }} />
      <Stack.Screen name="PurchaseAttraction" component={PurchaseAttractionScreen} options={{ title: 'Tickets', headerBackTitle: 'Back' }} />
      <Stack.Screen name="PurchaseMembership" component={PurchaseMembershipScreen} options={{ title: 'Membership', headerBackTitle: 'Back' }} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} options={{ title: 'Locations', presentation: 'modal' }} />
      <Stack.Screen
        name="CheckoutSuccess"
        component={CheckoutSuccessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
