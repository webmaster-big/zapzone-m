import { Alert, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';
import { Crown, Snowflake, XCircle, RefreshCw } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import {
  Screen,
  Text,
  Card,
  Button,
  Badge,
  Spinner,
  ErrorState,
  EmptyState,
  Divider,
  statusTone,
} from '@/components/ui';
import {
  useCancelMembership,
  useFreezeMembership,
  useMyMembership,
  useRetryMembershipPayment,
} from '../hooks/useMemberships';
import { useTheme } from '@/theme/useTheme';
import { formatLongDate, toISODate } from '@/utils/date';
import { humanize, formatCurrency } from '@/utils/format';
import { addDays } from 'date-fns';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MembershipScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<Nav>();
  const { data: membership, isLoading, error, refetch } = useMyMembership();
  const freeze = useFreezeMembership();
  const cancel = useCancelMembership();
  const retry = useRetryMembershipPayment();

  if (isLoading) return <Screen><Spinner fullscreen label={t('common.loading')} /></Screen>;
  if (error) return <Screen><ErrorState error={error} onRetry={refetch} /></Screen>;

  if (!membership) {
    return (
      <Screen edges={['top']}>
        <View className="px-4 pb-2 pt-1">
          <Text variant="title">{t('membership.title')}</Text>
        </View>
        <EmptyState
          icon={<Crown size={28} color={theme.colors.primary} />}
          title={t('membership.none')}
          description={t('membership.noneDesc')}
          actionLabel={t('membership.viewPlans')}
          onAction={() => navigation.navigate('PurchaseMembership')}
        />
      </Screen>
    );
  }

  const plan = membership.plan;
  const isPastDue = membership.status === 'past_due' || membership.status === 'suspended';

  const confirmFreeze = () => {
    Alert.alert('Freeze membership', 'Freeze your membership for 30 days?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Freeze',
        onPress: () =>
          freeze.mutate({ id: membership.id, until: toISODate(addDays(new Date(), 30)) }),
      },
    ]);
  };

  const confirmCancel = () => {
    Alert.alert('Cancel membership', 'Your membership will end at the end of the current term.', [
      { text: 'Keep membership', style: 'cancel' },
      {
        text: 'Cancel membership',
        style: 'destructive',
        onPress: () => cancel.mutate({ id: membership.id, effective: 'end_of_term' }),
      },
    ]);
  };

  return (
    <Screen edges={['top']}>
      <View className="px-4 pb-2 pt-1">
        <Text variant="title">{t('membership.title')}</Text>
      </View>
      <ScrollView contentContainerClassName="px-4 pb-8" showsVerticalScrollIndicator={false}>
        {/* Membership card */}
        <Card elevated className="overflow-hidden bg-primary">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-sm font-medium text-primary-foreground/80">
                {plan?.tier ?? 'Member'}
              </Text>
              <Text className="mt-0.5 text-2xl font-bold text-primary-foreground">
                {plan?.name ?? 'Membership'}
              </Text>
            </View>
            <Badge label={humanize(membership.status)} tone={statusTone(membership.status)} className="bg-white/20" />
          </View>
        </Card>

        {/* QR check-in */}
        <Card className="mt-4 items-center">
          <Text variant="subheading">Member check-in</Text>
          <Text variant="caption" className="mb-3 mt-0.5">
            Show this at the front desk
          </Text>
          <View className="rounded-xl bg-white p-4">
            <QRCode value={membership.qr_token} size={180} />
          </View>
        </Card>

        {/* Details */}
        <Card className="mt-4">
          {membership.current_term_end ? (
            <>
              <Row label="Renews / ends" value={formatLongDate(membership.current_term_end)} />
              <Divider className="my-2" />
            </>
          ) : null}
          {membership.billing_amount != null ? (
            <>
              <Row label="Billing" value={formatCurrency(membership.billing_amount)} />
              <Divider className="my-2" />
            </>
          ) : null}
          {membership.visits_remaining != null ? (
            <>
              <Row label="Visits remaining" value={String(membership.visits_remaining)} />
              <Divider className="my-2" />
            </>
          ) : null}
          {membership.location_access_label ? (
            <Row label="Access" value={membership.location_access_label} />
          ) : null}
        </Card>

        {/* Actions */}
        <View className="mt-5 gap-3">
          {isPastDue ? (
            <Button
              label="Retry payment"
              size="lg"
              fullWidth
              loading={retry.isPending}
              leftIcon={<RefreshCw size={16} color={theme.colors.primaryForeground} />}
              onPress={() => retry.mutate({ id: membership.id })}
            />
          ) : null}
          {membership.status === 'active' ? (
            <Button
              label="Freeze membership"
              variant="outline"
              size="lg"
              fullWidth
              loading={freeze.isPending}
              leftIcon={<Snowflake size={16} color={theme.colors.text} />}
              onPress={confirmFreeze}
            />
          ) : null}
          {membership.status !== 'canceled' ? (
            <Button
              label="Cancel membership"
              variant="ghost"
              size="lg"
              fullWidth
              loading={cancel.isPending}
              leftIcon={<XCircle size={16} color={theme.colors.danger} />}
              onPress={confirmCancel}
            />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text variant="bodyMuted">{label}</Text>
      <Text variant="label">{value}</Text>
    </View>
  );
}
