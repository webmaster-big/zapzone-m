import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, Text, Button, Stepper, Spinner, ErrorState, Card } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useAttractionDetail } from '@/features/catalog/hooks/useCatalog';
import { DateStrip } from '@/features/booking/components/DateStrip';
import { CardForm } from '@/features/payment/components/CardForm';
import { GuestForm } from '@/features/payment/components/GuestForm';
import { OrderSummary } from '@/features/payment/components/OrderSummary';
import { PaymentTokenizer, type PaymentTokenizerHandle } from '@/features/payment/components/PaymentTokenizer';
import { usePublicKey } from '@/features/payment/hooks/usePayment';
import { useAttractionCheckout } from '@/features/payment/hooks/useCheckoutFlows';
import { checkoutSchema, type CheckoutFormValues } from '@/features/payment/schema';
import { toNumber } from '@/utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'PurchaseAttraction'>;

export function PurchaseAttractionScreen({ route, navigation }: Props) {
  const { attractionId } = route.params;
  const customer = useAuthStore((s) => s.customer);

  const query = useAttractionDetail(attractionId);
  const attraction = query.data;

  const [quantity, setQuantity] = useState(1);
  const [visitDate, setVisitDate] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const tokenizerRef = useRef<PaymentTokenizerHandle>(null);
  const publicKey = usePublicKey(attraction?.location_id ?? null);
  const checkout = useAttractionCheckout();

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
    if (attraction) navigation.setOptions({ title: attraction.name });
  }, [attraction, navigation]);

  const total = useMemo(
    () => (attraction ? toNumber(attraction.price) * quantity : 0),
    [attraction, quantity],
  );

  if (query.isLoading) return <Screen><Spinner fullscreen label="Loading…" /></Screen>;
  if (query.error || !attraction) return <Screen><ErrorState error={query.error} onRetry={query.refetch} /></Screen>;

  const maxQty = attraction.max_quantity ?? 20;

  const submit = (values: CheckoutFormValues) => {
    setFormError(null);
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
        locationId: attraction.location_id,
        amount: total,
        payload: {
          attraction_id: attraction.id,
          location_id: attraction.location_id,
          customer_id: customer?.id,
          guest_name: values.guest_name,
          guest_email: values.guest_email,
          guest_phone: values.guest_phone,
          purchase_date: visitDate ?? undefined,
          quantity,
          total_amount: total,
          amount_paid: 0,
          payment_method: 'card',
          status: 'pending',
          send_email: true,
        },
      },
      {
        onSuccess: (purchase) =>
          navigation.replace('CheckoutSuccess', {
            kind: 'attraction',
            referenceNumber: purchase.reference_number,
            title: attraction.name,
          }),
        onError: (err) => setFormError(err.message),
      },
    );
  };

  return (
    <Screen edges={['bottom']}>
      <PaymentTokenizer ref={tokenizerRef} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerClassName="pb-4 pt-3" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text variant="subheading" className="mb-2 px-4">
            Visit date (optional)
          </Text>
          <DateStrip selectedDate={visitDate} onSelect={setVisitDate} />

          <View className="px-4">
            <Text variant="subheading" className="mb-3 mt-5">
              Tickets
            </Text>
            <Card className="flex-row items-center justify-between">
              <View>
                <Text variant="body">Quantity</Text>
                <Text variant="caption">${toNumber(attraction.price).toFixed(2)} each</Text>
              </View>
              <Stepper value={quantity} onChange={setQuantity} min={1} max={maxQty} />
            </Card>

            <Text variant="subheading" className="mb-3 mt-5">
              Your details
            </Text>
            <GuestForm control={control} />

            <Text variant="subheading" className="mb-3 mt-5">
              Payment
            </Text>
            <CardForm control={control} />

            <View className="mt-5">
              <OrderSummary lines={[{ label: `Tickets × ${quantity}`, amount: total }]} total={total} />
            </View>

            {formError ? (
              <View className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5">
                <Text className="text-sm text-danger">{formError}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="border-t border-border-subtle bg-card px-4 py-3">
        <Button
          label={`Pay $${total.toFixed(2)}`}
          size="lg"
          fullWidth
          loading={checkout.isPending}
          onPress={handleSubmit(submit)}
        />
      </View>
    </Screen>
  );
}
