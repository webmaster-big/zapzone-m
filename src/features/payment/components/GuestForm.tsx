import { View } from 'react-native';
import type { Control } from 'react-hook-form';
import { ControlledInput } from '@/components/form/ControlledInput';
import type { CheckoutFormValues } from '../schema';

/** Guest/contact fields shared across checkout flows. */
export function GuestForm({ control }: { control: Control<CheckoutFormValues> }) {
  return (
    <View className="gap-4">
      <ControlledInput
        control={control}
        name="guest_name"
        label="Full name"
        placeholder="Jordan Lee"
        autoCapitalize="words"
        autoComplete="name"
      />
      <ControlledInput
        control={control}
        name="guest_email"
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <ControlledInput
        control={control}
        name="guest_phone"
        label="Phone"
        placeholder="(555) 123-4567"
        keyboardType="phone-pad"
        autoComplete="tel"
      />
    </View>
  );
}
