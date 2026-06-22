import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import {
  Screen,
  Text,
  Button,
  Chip,
  Stepper,
  Spinner,
  ErrorState,
  Card,
} from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import {
  useEventAvailableDates,
  useEventDetail,
  useEventTimeSlots,
} from '@/features/catalog/hooks/useCatalog';
import { CardForm } from '@/features/payment/components/CardForm';
import { GuestForm } from '@/features/payment/components/GuestForm';
import { OrderSummary } from '@/features/payment/components/OrderSummary';
import { PaymentTokenizer, type PaymentTokenizerHandle } from '@/features/payment/components/PaymentTokenizer';
import { usePublicKey } from '@/features/payment/hooks/usePayment';
import { useEventCheckout } from '@/features/payment/hooks/useCheckoutFlows';
import { checkoutSchema, type CheckoutFormValues } from '@/features/payment/schema';
import { formatShortDate } from '@/utils/date';
import { formatTime12h, toNumber } from '@/utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseEvent'>;

export function PurchaseEventScreen({ route, navigation }: Props) {
  const { eventId } = route.params;
  const customer = useAuthStore((s) => s.customer);

  const eventQuery = useEventDetail(eventId);
  const event = eventQuery.data;

  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addOnQty, setAddOnQty] = useState<Record<number, number>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const tokenizerRef = useRef<PaymentTokenizerHandle>(null);
  const dates = useEventAvailableDates(eventId);
  const slots = useEventTimeSlots(eventId, date);
  const publicKey = usePublicKey(event?.location_id ?? null);
  const checkout = useEventCheckout();

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
    if (event) navigation.setOptions({ title: event.name });
  }, [event, navigation]);

  useEffect(() => setTime(null), [date]);

  const activeAddOns = useMemo(
    () => (event?.add_ons ?? []).filter((a) => a.is_active !== false),
    [event],
  );

  const pricing = useMemo(() => {
    if (!event) return { tickets: 0, addOns: 0, total: 0 };
    const tickets = toNumber(event.price) * quantity;
    const addOns = activeAddOns.reduce(
      (sum, a) => sum + (addOnQty[a.id] ?? 0) * toNumber(a.price),
      0,
    );
    return { tickets, addOns, total: tickets + addOns };
  }, [event, quantity, activeAddOns, addOnQty]);

  if (eventQuery.isLoading) return <Screen><Spinner fullscreen label="Loading…" /></Screen>;
  if (eventQuery.error || !event) return <Screen><ErrorState error={eventQuery.error} onRetry={eventQuery.refetch} /></Screen>;

  const maxQty = event.max_bookings_per_slot ?? 20;
  const canPay = Boolean(date && time && quantity > 0);

  const orderLines = [
    { label: `Tickets × ${quantity}`, amount: pricing.tickets },
    ...(pricing.addOns > 0 ? [{ label: 'Add-ons', amount: pricing.addOns, muted: true }] : []),
  ];

  const submit = (values: CheckoutFormValues) => {
    setFormError(null);
    if (!date || !time) return;
    if (!publicKey.data) {
      setFormError('Payment is not available for this event right now.');
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
        locationId: event.location_id,
        amount: pricing.total,
        payload: {
          event_id: event.id,
          customer_id: customer?.id,
          guest_name: values.guest_name,
          guest_email: values.guest_email,
          guest_phone: values.guest_phone,
          purchase_date: date,
          purchase_time: time,
          quantity,
          total_amount: pricing.total,
          amount_paid: 0,
          payment_method: 'card',
          status: 'pending',
          send_email: true,
          add_ons: activeAddOns
            .filter((a) => (addOnQty[a.id] ?? 0) > 0)
            .map((a) => ({
              add_on_id: a.id,
              quantity: addOnQty[a.id] ?? 0,
              price_at_purchase: toNumber(a.price),
            })),
        },
      },
      {
        onSuccess: (purchase) =>
          navigation.replace('CheckoutSuccess', {
            kind: 'event',
            referenceNumber: purchase.reference_number,
            title: event.name,
          }),
        onError: (err) => setFormError(err.message),
      },
    );
  };

  return (
    <Screen edges={['bottom']}>
      <PaymentTokenizer ref={tokenizerRef} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerClassName="px-4 pb-4 pt-3" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text variant="subheading" className="mb-2">
            Select date
          </Text>
          {dates.isLoading ? (
            <Spinner label="Loading dates…" className="py-4" />
          ) : (dates.data?.length ?? 0) === 0 ? (
            <Text variant="bodyMuted">No upcoming dates available.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
              {dates.data?.map((d) => (
                <Chip key={d} label={formatShortDate(d)} selected={date === d} onPress={() => setDate(d)} />
              ))}
            </ScrollView>
          )}

          {date ? (
            <>
              <Text variant="subheading" className="mb-2 mt-5">
                Select time
              </Text>
              {slots.isLoading ? (
                <Spinner label="Loading times…" className="py-4" />
              ) : (slots.data?.length ?? 0) === 0 ? (
                <Text variant="bodyMuted">No times available for this date.</Text>
              ) : (
                <View className="flex-row flex-wrap gap-2">
                  {slots.data?.map((s) => (
                    <Chip key={s} label={formatTime12h(s)} selected={time === s} onPress={() => setTime(s)} />
                  ))}
                </View>
              )}
            </>
          ) : null}

          <Text variant="subheading" className="mb-3 mt-5">
            Tickets
          </Text>
          <Card className="flex-row items-center justify-between">
            <View>
              <Text variant="body">Quantity</Text>
              <Text variant="caption">Up to {maxQty} per order</Text>
            </View>
            <Stepper value={quantity} onChange={setQuantity} min={1} max={maxQty} />
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

          <Text variant="subheading" className="mb-3 mt-5">
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
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="border-t border-border-subtle bg-card px-4 py-3">
        <Button
          label={`Pay $${pricing.total.toFixed(2)}`}
          size="lg"
          fullWidth
          disabled={!canPay}
          loading={checkout.isPending}
          onPress={handleSubmit(submit)}
        />
      </View>
    </Screen>
  );
}
