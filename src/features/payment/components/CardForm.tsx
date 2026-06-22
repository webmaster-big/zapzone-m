import { View } from 'react-native';
import type { Control } from 'react-hook-form';
import { CreditCard, Lock } from 'lucide-react-native';
import { ControlledInput } from '@/components/form/ControlledInput';
import { Text } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import type { CheckoutFormValues } from '../schema';

/** Card entry fields. The values are tokenized client-side via Accept.js and
 * never sent to the ZapZone backend. */
export function CardForm({ control }: { control: Control<CheckoutFormValues> }) {
  const theme = useTheme();
  return (
    <View className="gap-4">
      <ControlledInput
        control={control}
        name="cardNumber"
        label="Card number"
        placeholder="1234 5678 9012 3456"
        keyboardType="number-pad"
        autoComplete="cc-number"
        maxLength={19}
        leftIcon={<CreditCard size={18} color={theme.colors.textSubtle} />}
      />
      <View className="flex-row gap-3">
        <ControlledInput
          control={control}
          name="month"
          label="Exp. month"
          placeholder="MM"
          keyboardType="number-pad"
          maxLength={2}
          containerClassName="flex-1"
        />
        <ControlledInput
          control={control}
          name="year"
          label="Exp. year"
          placeholder="YYYY"
          keyboardType="number-pad"
          maxLength={4}
          containerClassName="flex-1"
        />
        <ControlledInput
          control={control}
          name="cardCode"
          label="CVV"
          placeholder="123"
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          containerClassName="flex-1"
        />
      </View>
      <View className="flex-row items-center gap-1.5">
        <Lock size={12} color={theme.colors.textSubtle} />
        <Text variant="caption">Encrypted &amp; processed securely by Authorize.Net</Text>
      </View>
    </View>
  );
}
