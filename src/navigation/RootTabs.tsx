import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Bell, CalendarCheck, Crown, Home, User } from 'lucide-react-native';
import type { TabParamList } from './types';
import { HomeScreen } from '@/features/catalog/screens/HomeScreen';
import { ReservationsScreen } from '@/features/reservations/screens/ReservationsScreen';
import { MembershipScreen } from '@/features/memberships/screens/MembershipScreen';
import { NotificationsScreen } from '@/features/notifications/screens/NotificationsScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { useTheme } from '@/theme/useTheme';
import { useUnreadCount } from '@/features/notifications/hooks/useNotifications';
import { fontFamily } from '@/theme/tokens';

const Tab = createBottomTabNavigator<TabParamList>();

export function RootTabs() {
  const { t } = useTranslation();
  const theme = useTheme();
  const unread = useUnreadCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.navActive,
        tabBarInactiveTintColor: theme.colors.textSubtle,
        tabBarStyle: {
          backgroundColor: theme.colors.nav,
          borderTopColor: theme.colors.border,
          // Compact, platform-aware tab bar height.
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.medium,
          fontSize: 11,
        },
        tabBarHideOnKeyboard: Platform.OS === 'android',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="ReservationsTab"
        component={ReservationsScreen}
        options={{
          title: t('tabs.reservations'),
          tabBarIcon: ({ color, size }) => <CalendarCheck size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="MembershipTab"
        component={MembershipScreen}
        options={{
          title: t('tabs.membership'),
          tabBarIcon: ({ color, size }) => <Crown size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          title: t('tabs.notifications'),
          tabBarIcon: ({ color, size }) => <Bell size={size - 2} color={color} />,
          tabBarBadge: unread.data && unread.data > 0 ? (unread.data > 9 ? '9+' : unread.data) : undefined,
          tabBarBadgeStyle: { backgroundColor: theme.colors.danger, fontSize: 10 },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => <User size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
