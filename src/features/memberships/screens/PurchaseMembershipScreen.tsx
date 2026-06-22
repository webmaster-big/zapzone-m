import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, CreditCard, Lock } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import {
  Screen,
  Text,
  Button,
  Card,
  Spinner,
  ErrorState,
  Badge,
  PriceTag,
} from '@/components/ui';
import { ControlledInput } from '@/components/form/ControlledInput';
import { useTheme } from '@/theme/useTheme';
import { useLocationStore } from '@/store/locationStore';
import { useLocations } from '@/features/locations/hooks/useLocations';
import { useMembershipPlans, useMembershipPurchase } from '../hooks/useMemberships';
import { usePublicKey } from '@/features/payment/hooks/usePayment';
import { PaymentTokenizer, type PaymentTokenizerHandle } from '@/features/payment/components/PaymentTokenizer';
import { cardSchema, type CardFormValues } from '@/features/payment/schema';
import { humanize } from '@/utils/format';
import type { MembershipPlan } from '@/types/membership';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseMembership'>;

export function PurchaseMembershipScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const plansQuery = useMembershipPlans();
  const locations = useLocations();
  const storeLocationId = useLocationStore((s) => s.selectedLocationId);

  const homeLocationId = storeLocationId ?? locations.data?.[0]?.id ?? null;

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(route.params?.planId ?? null);
  const [terms, setTerms] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const tokenizerRef = useRef<PaymentTokenizerHandle>(null);
  const publicKey = usePublicKey(homeLocationId);
  const purchase = useMembershipPurchase();

  const { control, handleSubmit } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: { cardNumber: '', month: '', year: '', cardCode: '' },
  });

  const plans = plansQuery.data ?? [];
  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );

  useEffect(() => {
    if (!selectedPlanId && plans.length) setSelectedPlanId(plans[0]!.id);
  }, [plans, selectedPlanId]);

  if (plansQuery.isLoading) return <Screen><Spinner fullscreen label="Loading plans…" /></Screen>;
  if (plansQuery.error) return <Screen><ErrorState error={plansQuery.error} onRetry={plansQuery.refetch} /></Screen>;

  const canSubmit = Boolean(selectedPlan && homeLocationId && terms && recurring);

  const submit = (values: CardFormValues) => {
    setFormError(null);
    if (!selectedPlan || !homeLocationId) return;
    if (!publicKey.data) {
      setFormError('Payment is not available for this location right now.');
      return;
    }
    if (!terms || !recurring) {
      setFormError('Please accept the terms and authorize recurring billing.');
      return;
    }
    if (!tokenizerRef.current) return;

    purchase.mutate(
      {
        tokenizer: tokenizerRef.current,
        publicKey: publicKey.data,
        card: {
          cardNumber: values.cardNumber,
          month: values.month,
          year: values.year.length === 2 ? `20${values.year}` : values.year,
          cardCode: values.cardCode,
        },
        planId: selectedPlan.id,
        homeLocationId,
        termsAccepted: terms,
        recurringAuthorized: recurring,
      },
      {
        onSuccess: () =>
          navigation.replace('CheckoutSuccess', { kind: 'membership', title: selectedPlan.name }),
        onError: (err) => setFormError(err.message),
      },
    );
  };

  return (
    <Screen edges={['bottom']}>
      <PaymentTokenizer ref={tokenizerRef} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerClassName="px-4 pb-4 pt-3" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text variant="title">Choose a plan</Text>
          <Text variant="bodyMuted" className="mb-4 mt-1">
            Unlock member pricing, perks and priority booking.
          </Text>

          <View className="gap-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={plan.id === selectedPlanId}
                onPress={() => setSelectedPlanId(plan.id)}
              />
            ))}
          </View>

          <Text variant="subheading" className="mb-3 mt-6">
            Payment details
          </Text>
          <View className="gap-4">
            <ControlledInput
              control={control}
              name="cardNumber"
              label="Card number"
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={19}
              leftIcon={<CreditCard size={18} color={theme.colors.textSubtle} />}
            />
            <View className="flex-row gap-3">
              <ControlledInput control={control} name="month" label="Exp. month" placeholder="MM" keyboardType="number-pad" maxLength={2} containerClassName="flex-1" />
              <ControlledInput control={control} name="year" label="Exp. year" placeholder="YYYY" keyboardType="number-pad" maxLength={4} containerClassName="flex-1" />
              <ControlledInput control={control} name="cardCode" label="CVV" placeholder="123" keyboardType="number-pad" maxLength={4} secureTextEntry containerClassName="flex-1" />
            </View>
          </View>

          {/* Consent toggles */}
          <View className="mt-5 gap-3">
            <ConsentRow
              checked={terms}
              onToggle={() => setTerms((v) => !v)}
              label="I agree to the membership terms and conditions."
            />
            <ConsentRow
              checked={recurring}
              onToggle={() => setRecurring((v) => !v)}
              label="I authorize recurring billing for this membership."
            />
          </View>

          <View className="mt-4 flex-row items-center gap-1.5">
            <Lock size={12} color={theme.colors.textSubtle} />
            <Text variant="caption">Encrypted &amp; processed securely by Authorize.Net</Text>
          </View>

          {formError ? (
            <View className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5">
              <Text className="text-sm text-danger">{formError}</Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="border-t border-border-subtle bg-card px-4 py-3">
        <Button
          label={selectedPlan ? `Join for $${selectedPlan.price.toFixed(2)}` : 'Select a plan'}
          size="lg"
          fullWidth
          disabled={!canSubmit}
          loading={purchase.isPending}
          onPress={handleSubmit(submit)}
        />
      </View>
    </Screen>
  );
}

function PlanCard({
  plan,
  selected,
  onPress,
}: {
  plan: MembershipPlan;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card className={selected ? 'border-2 border-primary' : 'border border-border'}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center gap-2">
              <Text variant="subheading">{plan.name}</Text>
              {plan.tier ? <Badge label={plan.tier} tone="primary" /> : null}
            </View>
            {plan.description ? (
              <Text variant="caption" className="mt-1" numberOfLines={2}>
                {plan.description}
              </Text>
            ) : null}
            <View className="mt-2 flex-row items-baseline gap-1">
              <PriceTag amount={plan.price} size="md" />
              <Text variant="caption">/ {humanize(plan.billing_interval)}</Text>
            </View>
          </View>
          <View
            className={`h-6 w-6 items-center justify-center rounded-full border-2 ${selected ? 'border-primary bg-primary' : 'border-border'}`}
          >
            {selected ? <Check size={14} color="#fff" /> : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function ConsentRow({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Pressable onPress={onToggle} className="flex-row items-start gap-3">
      <View
        className={`mt-0.5 h-5 w-5 items-center justify-center rounded border-2 ${checked ? 'border-primary bg-primary' : 'border-border'}`}
      >
        {checked ? <Check size={13} color="#fff" /> : null}
      </View>
      <Text variant="bodyMuted" className="flex-1">
        {label}
      </Text>
    </Pressable>
  );
}
