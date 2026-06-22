import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CheckCircle2 } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { Screen, Text, Button, Card } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckoutSuccess'>;

const COPY: Record<Props['route']['params']['kind'], { title: string; body: string; cta: string; tab: 'ReservationsTab' | 'HomeTab' }> = {
  booking: {
    title: "You're booked!",
    body: 'Your booking is confirmed. A confirmation email with your QR code is on its way.',
    cta: 'View my bookings',
    tab: 'ReservationsTab',
  },
  event: {
    title: 'Tickets confirmed!',
    body: 'Your event tickets are confirmed. Check your email for the details and QR code.',
    cta: 'View my tickets',
    tab: 'ReservationsTab',
  },
  attraction: {
    title: 'Purchase complete!',
    body: 'Your attraction tickets are ready. A receipt with your QR code has been emailed to you.',
    cta: 'View my tickets',
    tab: 'ReservationsTab',
  },
  membership: {
    title: 'Welcome to the club!',
    body: 'Your membership is now active. Enjoy member pricing and perks on your next visit.',
    cta: 'View membership',
    tab: 'HomeTab',
  },
};

export function CheckoutSuccessScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { kind, referenceNumber, title } = route.params;
  const copy = COPY[kind];

  return (
    <Screen padded>
      <View className="flex-1 items-center justify-center">
        <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 size={44} color={theme.colors.success} />
        </View>
        <Text variant="title" className="text-center">
          {copy.title}
        </Text>
        {title ? (
          <Text variant="bodyMuted" className="mt-1 text-center">
            {title}
          </Text>
        ) : null}
        <Text variant="bodyMuted" className="mt-3 px-4 text-center">
          {copy.body}
        </Text>

        {referenceNumber ? (
          <Card className="mt-6 w-full items-center">
            <Text variant="caption">Reference</Text>
            <Text variant="heading" className="mt-1">
              {referenceNumber}
            </Text>
          </Card>
        ) : null}
      </View>

      <View className="gap-3 pb-4">
        <Button
          label={copy.cta}
          size="lg"
          fullWidth
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Tabs', params: { screen: copy.tab } }],
            })
          }
        />
        <Button
          label="Back to home"
          variant="ghost"
          size="lg"
          fullWidth
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Tabs', params: { screen: 'HomeTab' } }],
            })
          }
        />
      </View>
    </Screen>
  );
}
