import { Alert, ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Phone,
  Smartphone,
  Sun,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, Text, Card, Avatar, Button, Divider, SegmentedControl } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore, type ThemeMode } from '@/store/themeStore';
import { useLocationStore } from '@/store/locationStore';
import { useTheme } from '@/theme/useTheme';
import { fullName } from '@/utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProfileScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const customer = useAuthStore((s) => s.customer);
  const signOut = useAuthStore((s) => s.signOut);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const selectedLocation = useLocationStore((s) => s.selectedLocation);

  const confirmSignOut = () => {
    Alert.alert(t('auth.signOut'), 'Are you sure you want to sign out?', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('auth.signOut'), style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  return (
    <Screen edges={['top']} secondary>
      <ScrollView contentContainerClassName="px-4 pb-8 pt-1" showsVerticalScrollIndicator={false}>
        <Text variant="title" className="mb-4">
          {t('tabs.profile')}
        </Text>

        {/* Identity */}
        <Card elevated>
          <View className="flex-row items-center">
            <Avatar firstName={customer?.first_name} lastName={customer?.last_name} size="lg" />
            <View className="ml-3 flex-1">
              <Text variant="heading" numberOfLines={1}>
                {fullName(customer?.first_name, customer?.last_name) || 'Guest'}
              </Text>
              {customer?.email ? (
                <Text variant="caption" numberOfLines={1}>
                  {customer.email}
                </Text>
              ) : null}
            </View>
          </View>

          <Divider className="my-3" />
          <View className="gap-2.5">
            {customer?.email ? <InfoRow icon={<Mail size={15} color={theme.colors.textSubtle} />} text={customer.email} /> : null}
            {customer?.phone ? <InfoRow icon={<Phone size={15} color={theme.colors.textSubtle} />} text={customer.phone} /> : null}
            {selectedLocation ? (
              <InfoRow icon={<MapPin size={15} color={theme.colors.textSubtle} />} text={selectedLocation.name} />
            ) : null}
          </View>
        </Card>

        {/* Location */}
        <Card className="mt-4" onPress={() => navigation.navigate('LocationPicker')}>
          <View className="flex-row items-center">
            <MapPin size={18} color={theme.colors.primary} />
            <View className="ml-3 flex-1">
              <Text variant="caption">Preferred location</Text>
              <Text variant="label">{selectedLocation?.name ?? 'Choose a location'}</Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textSubtle} />
          </View>
        </Card>

        {/* Appearance */}
        <Card className="mt-4">
          <Text variant="subheading" className="mb-3">
            Appearance
          </Text>
          <SegmentedControl<ThemeMode>
            value={mode}
            onChange={setMode}
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
          />
          <View className="mt-3 flex-row items-center gap-2">
            {mode === 'dark' ? (
              <Moon size={14} color={theme.colors.textSubtle} />
            ) : mode === 'light' ? (
              <Sun size={14} color={theme.colors.textSubtle} />
            ) : (
              <Smartphone size={14} color={theme.colors.textSubtle} />
            )}
            <Text variant="caption">
              {mode === 'system' ? 'Following your device setting' : `Using ${mode} theme`}
            </Text>
          </View>
        </Card>

        <Button
          label={t('auth.signOut')}
          variant="outline"
          size="lg"
          fullWidth
          className="mt-6"
          leftIcon={<LogOut size={16} color={theme.colors.danger} />}
          onPress={confirmSignOut}
        />
      </ScrollView>
    </Screen>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View className="flex-row items-center gap-2">
      {icon}
      <Text variant="bodyMuted" numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}
