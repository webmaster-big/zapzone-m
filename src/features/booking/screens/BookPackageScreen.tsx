import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarClock, Check } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import {
  Screen,
  Text,
  Button,
  Chip,
  Stepper,
  Spinner,
  ErrorState,
  Divider,
  Card,
  Badge,
} from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import { useAuthStore } from '@/store/authStore';
import { usePackageDetail } from '@/features/catalog/hooks/useCatalog';
import { usePackageAvailability } from '@/features/booking/hooks/usePackageAvailability';
import { DateStrip } from '@/features/booking/components/DateStrip';
import { CardForm } from '@/features/payment/components/CardForm';
import { GuestForm } from '@/features/payment/components/GuestForm';
import { OrderSummary } from '@/features/payment/components/OrderSummary';
import { PaymentTokenizer, type PaymentTokenizerHandle } from '@/features/payment/components/PaymentTokenizer';
import { usePublicKey } from '@/features/payment/hooks/usePayment';
import { useBookingCheckout } from '@/features/payment/hooks/useCheckoutFlows';
import { checkoutSchema, type CheckoutFormValues } from '@/features/payment/schema';
import type { PackageAvailabilitySlot } from '@/features/booking/types';
import { formatTime12h, toNumber } from '@/utils/format';
import { analytics, AnalyticsEvent } from '@/lib/analytics/analytics';

type Props = NativeStackScreenProps<RootStackParamList, 'BookPackage'>;

const STEPS = ['Date & time', 'Guests & extras', 'Pay'];

export function BookPackageScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { packageId } = route.params;
  const customer = useAuthStore((s) => s.customer);

  const pkgQuery = usePackageDetail(packageId);
  const pkg = pkgQuery.data;

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<PackageAvailabilitySlot | null>(null);
  const [participants, setParticipants] = useState(1);
  const [addOnQty, setAddOnQty] = useState<Record<number, number>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const tokenizerRef = useRef<PaymentTokenizerHandle>(null);
  const availability = usePackageAvailability(packageId, selectedDate);
  const publicKey = usePublicKey(pkg?.location_id ?? null);
  const checkout = useBookingCheckout();

  const { control, handleSubmit } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      guest_name: customer ? `${customer.first_name} ${customer.last_name}`.trim() : '',
      guest_email: customer?.email ?? '',
      guest_phone: customer?.phone ?? '',
      cardNumber: '',
      month: '',
      year: '',
      cardCode: '',
    },
  });

  useEffect(() => {
    if (pkg) {
      navigation.setOptions({ title: pkg.name });
      setParticipants(pkg.min_participants ?? 1);
    }
  }, [pkg, navigation]);

  // Reset slot when the date changes.
  useEffect(() => {
    setSlot(null);
  }, [selectedDate]);

  const activeAddOns = useMemo(
    () => (pkg?.add_ons ?? []).filter((a) => a.is_active),
    [pkg],
  );

  const pricing = useMemo(() => {
    if (!pkg) return { base: 0, extra: 0, addOns: 0, total: 0 };
    const base = toNumber(pkg.price);
    const minGuests = pkg.min_participants ?? 1;
    const perAdditional = toNumber(pkg.price_per_additional);
    const extra = Math.max(0, participants - minGuests) * perAdditional;
    const addOns = activeAddOns.reduce((sum, a) => {
      const qty = addOnQty[a.id] ?? 0;
      return sum + qty * toNumber(a.price);
    }, 0);
    return { base, extra, addOns, total: base + extra + addOns };
  }, [pkg, participants, addOnQty, activeAddOns]);

  if (pkgQuery.isLoading) return <Screen><Spinner fullscreen label="Loading…" /></Screen>;
  if (pkgQuery.error || !pkg) return <Screen><ErrorState error={pkgQuery.error} onRetry={pkgQuery.refetch} /></Screen>;

  const slots = availability.data?.available_slots ?? [];
  const isClosed = availability.data?.is_blocked;

  const canContinueStep0 = Boolean(selectedDate && slot);
  const canContinueStep1 = participants >= (pkg.min_participants ?? 1);

  const orderLines = [
    { label: `Package base`, amount: pricing.base },
    ...(pricing.extra > 0
      ? [{ label: `Extra guests`, amount: pricing.extra, muted: true }]
      : []),
    ...(pricing.addOns > 0 ? [{ label: 'Add-ons', amount: pricing.addOns, muted: true }] : []),
  ];

  const submit = (values: CheckoutFormValues) => {
    setFormError(null);
    if (!slot || !selectedDate) {
      setStep(0);
      return;
    }
    if (!publicKey.data) {
      setFormError('Payment is not available for this location right now.');
      return;
    }
    if (!tokenizerRef.current) return;

    checkout.mutate(
      {
        tokenizer: tokenizerRef.current,
        publicKey: publicKey.data,
        card: {
          cardNumber: values.cardNumber,
          month: values.month,
          year: values.year.length === 2 ? `20${values.year}` : values.year,
          cardCode: values.cardCode,
        },
        customer: {
          first_name: customer?.first_name,
          last_name: customer?.last_name,
          email: values.guest_email,
          phone: values.guest_phone,
        },
        customerId: customer?.id,
        locationId: pkg.location_id,
        amount: pricing.total,
        payload: {
          customer_id: customer?.id,
          guest_name: values.guest_name,
          guest_email: values.guest_email,
          guest_phone: values.guest_phone,
          package_id: pkg.id,
          location_id: pkg.location_id,
          room_id: slot.room_id,
          type: 'package',
          booking_date: selectedDate,
          booking_time: slot.start_time,
          participants,
          duration: slot.duration,
          duration_unit: slot.duration_unit,
          total_amount: pricing.total,
          amount_paid: 0,
          payment_method: 'card',
          payment_status: 'pending',
          status: 'pending',
          additional_addons: activeAddOns
            .filter((a) => (addOnQty[a.id] ?? 0) > 0)
            .map((a) => ({
              addon_id: a.id,
              quantity: addOnQty[a.id] ?? 0,
              price_at_booking: toNumber(a.price),
            })),
          send_email: true,
        },
      },
      {
        onSuccess: (booking) =>
          navigation.replace('CheckoutSuccess', {
            kind: 'booking',
            referenceNumber: booking.reference_number,
            title: pkg.name,
          }),
        onError: (err) => setFormError(err.message),
      },
    );
  };

  const goNext = () => {
    if (step === 0 && canContinueStep0) {
      analytics.logEvent(AnalyticsEvent.BeginCheckout, { kind: 'booking', package_id: pkg.id });
      setStep(1);
    } else if (step === 1 && canContinueStep1) {
      analytics.logEvent(AnalyticsEvent.AddPaymentInfo, { kind: 'booking' });
      setStep(2);
    }
  };

  return (
    <Screen edges={['bottom']}>
      <PaymentTokenizer ref={tokenizerRef} />
      {/* Step progress */}
      <View className="flex-row items-center gap-2 px-4 py-3">
        {STEPS.map((label, i) => (
          <View key={label} className="flex-1 flex-row items-center gap-2">
            <View
              className={`h-6 w-6 items-center justify-center rounded-full ${i <= step ? 'bg-primary' : 'bg-bg-secondary'}`}
            >
              {i < step ? (
                <Check size={13} color={theme.colors.primaryForeground} />
              ) : (
                <Text className={`text-2xs font-bold ${i <= step ? 'text-primary-foreground' : 'text-subtle'}`}>
                  {i + 1}
                </Text>
              )}
            </View>
            {i < STEPS.length - 1 ? (
              <View className={`h-0.5 flex-1 ${i < step ? 'bg-primary' : 'bg-bg-secondary'}`} />
            ) : null}
          </View>
        ))}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerClassName="pb-4" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {step === 0 ? (
            <View>
              <Text variant="subheading" className="mb-2 px-4">
                {STEPS[0]}
              </Text>
              <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />

              <View className="px-4 pt-5">
                <Text variant="label" className="mb-2">
                  Available times
                </Text>
                {!selectedDate ? (
                  <Text variant="bodyMuted">Pick a date to see available times.</Text>
                ) : availability.isLoading ? (
                  <Spinner label="Checking availability…" className="py-6" />
                ) : isClosed ? (
                  <Card className="bg-warning/10">
                    <Text className="text-warning">This location is closed on this date.</Text>
                  </Card>
                ) : slots.length === 0 ? (
                  <Text variant="bodyMuted">No times available. Try another date.</Text>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {slots.map((s, idx) => (
                      <Chip
                        key={`${s.start_time}-${s.room_id}-${idx}`}
                        label={formatTime12h(s.start_time)}
                        selected={slot?.start_time === s.start_time && slot?.room_id === s.room_id}
                        onPress={() => setSlot(s)}
                      />
                    ))}
                  </View>
                )}
                {slot ? (
                  <View className="mt-3 flex-row items-center gap-2">
                    <CalendarClock size={15} color={theme.colors.primary} />
                    <Text variant="caption">
                      {formatTime12h(slot.start_time)}–{formatTime12h(slot.end_time)} · {slot.room_name}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          {step === 1 ? (
            <View className="px-4">
              <Text variant="subheading" className="mb-3">
                How many guests?
              </Text>
              <Card className="flex-row items-center justify-between">
                <View>
                  <Text variant="body">Participants</Text>
                  <Text variant="caption">
                    {pkg.min_participants ?? 1}–{pkg.max_participants} allowed
                  </Text>
                </View>
                <Stepper
                  value={participants}
                  onChange={setParticipants}
                  min={pkg.min_participants ?? 1}
                  max={pkg.max_participants}
                />
              </Card>

              {activeAddOns.length > 0 ? (
                <>
                  <Text variant="subheading" className="mb-3 mt-5">
                    Add-ons
                  </Text>
                  <View className="gap-2">
                    {activeAddOns.map((a) => (
                      <Card key={a.id} className="flex-row items-center justify-between">
                        <View className="flex-1 pr-3">
                          <Text variant="body" numberOfLines={1}>
                            {a.name}
                          </Text>
                          <Text variant="caption">${toNumber(a.price).toFixed(2)} each</Text>
                        </View>
                        <Stepper
                          value={addOnQty[a.id] ?? 0}
                          onChange={(v) => setAddOnQty((prev) => ({ ...prev, [a.id]: v }))}
                          min={0}
                          max={a.max_quantity ?? 20}
                        />
                      </Card>
                    ))}
                  </View>
                </>
              ) : null}
            </View>
          ) : null}

          {step === 2 ? (
            <View className="px-4">
              <Card className="mb-4">
                <View className="flex-row items-center justify-between">
                  <Text variant="caption">When</Text>
                  <Text variant="label">
                    {selectedDate} · {slot ? formatTime12h(slot.start_time) : ''}
                  </Text>
                </View>
                <Divider className="my-2" />
                <View className="flex-row items-center justify-between">
                  <Text variant="caption">Guests</Text>
                  <Text variant="label">{participants}</Text>
                </View>
              </Card>

              <Text variant="subheading" className="mb-3">
                Your details
              </Text>
              <GuestForm control={control} />

              <Text variant="subheading" className="mb-3 mt-5">
                Payment
              </Text>
              <CardForm control={control} />

              <View className="mt-5">
                <OrderSummary lines={orderLines} total={pricing.total} />
              </View>

              {formError ? (
                <View className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5">
                  <Text className="text-sm text-danger">{formError}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom action bar */}
      <View className="flex-row items-center gap-3 border-t border-border-subtle bg-card px-4 py-3">
        {step > 0 ? (
          <Button label="Back" variant="outline" size="lg" onPress={() => setStep(step - 1)} className="px-6" />
        ) : null}
        {step < 2 ? (
          <View className="flex-1 flex-row items-center justify-between">
            <View>
              <Text variant="caption">Total</Text>
              <Text variant="subheading" className="text-primary">
                ${pricing.total.toFixed(2)}
              </Text>
            </View>
            <Button
              label="Continue"
              size="lg"
              disabled={step === 0 ? !canContinueStep0 : !canContinueStep1}
              onPress={goNext}
              className="px-8"
            />
          </View>
        ) : (
          <Button
            label={`Pay $${pricing.total.toFixed(2)}`}
            size="lg"
            fullWidth
            loading={checkout.isPending}
            onPress={handleSubmit(submit)}
            className="flex-1"
          />
        )}
      </View>
    </Screen>
  );
}
