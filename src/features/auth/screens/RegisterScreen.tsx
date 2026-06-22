import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, IconButton, Screen, Text } from '@/components/ui';
import { ControlledInput } from '@/components/form/ControlledInput';
import { registerSchema, type RegisterFormValues } from '../schema';
import { useRegister } from '../hooks/useAuthMutations';
import { useTheme } from '@/theme/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const register = useRegister();
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    setFormError(null);
    register.mutate(values, {
      onError: (error) => setFormError(error.message),
    });
  };

  return (
    <Screen>
      <View className="flex-row items-center px-4 pb-1 pt-1">
        <IconButton accessibilityLabel="Go back" onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </IconButton>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 pb-10 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text variant="title">Create your account</Text>
          <Text variant="bodyMuted" className="mb-6 mt-1">
            Join ZapZone to book parties, events and more
          </Text>

          {formError ? (
            <View className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5">
              <Text className="text-sm text-danger">{formError}</Text>
            </View>
          ) : null}

          <View className="gap-4">
            <View className="flex-row gap-3">
              <ControlledInput
                control={control}
                name="first_name"
                label="First name"
                placeholder="Jordan"
                containerClassName="flex-1"
                autoCapitalize="words"
              />
              <ControlledInput
                control={control}
                name="last_name"
                label="Last name"
                placeholder="Lee"
                containerClassName="flex-1"
                autoCapitalize="words"
              />
            </View>
            <ControlledInput
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <ControlledInput
              control={control}
              name="phone"
              label="Phone"
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
              autoComplete="tel"
            />
            <ControlledInput
              control={control}
              name="password"
              label="Password"
              placeholder="At least 8 characters"
              secureTextEntry
            />
            <ControlledInput
              control={control}
              name="password_confirmation"
              label="Confirm password"
              placeholder="Re-enter password"
              secureTextEntry
            />
          </View>

          <Button
            label="Create account"
            size="lg"
            fullWidth
            loading={register.isPending}
            onPress={handleSubmit(onSubmit)}
            className="mt-6"
          />

          <View className="mt-6 flex-row items-center justify-center gap-1">
            <Text variant="bodyMuted">Already have an account?</Text>
            <Text
              className="text-base font-semibold text-primary"
              onPress={() => navigation.navigate('Login')}
            >
              Sign in
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
