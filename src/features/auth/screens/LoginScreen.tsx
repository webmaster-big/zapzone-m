import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Lock, Mail } from 'lucide-react-native';
import type { AuthStackParamList } from '@/navigation/types';
import { Button, Screen, Text } from '@/components/ui';
import { ControlledInput } from '@/components/form/ControlledInput';
import { loginSchema, type LoginFormValues } from '../schema';
import { useLogin } from '../hooks/useAuthMutations';
import { useTheme } from '@/theme/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    setFormError(null);
    login.mutate(values, {
      onError: (error) => setFormError(error.message),
    });
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Text className="text-3xl font-bold text-primary-foreground">Z</Text>
            </View>
            <Text variant="title">Welcome back</Text>
            <Text variant="bodyMuted" className="mt-1 text-center">
              Sign in to book and manage your visits
            </Text>
          </View>

          {formError ? (
            <View className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5">
              <Text className="text-sm text-danger">{formError}</Text>
            </View>
          ) : null}

          <View className="gap-4">
            <ControlledInput
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              leftIcon={<Mail size={18} color={theme.colors.textSubtle} />}
            />
            <ControlledInput
              control={control}
              name="password"
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              leftIcon={<Lock size={18} color={theme.colors.textSubtle} />}
            />
          </View>

          <Button
            label="Sign in"
            size="lg"
            fullWidth
            loading={login.isPending}
            onPress={handleSubmit(onSubmit)}
            className="mt-6"
          />

          <View className="mt-6 flex-row items-center justify-center gap-1">
            <Text variant="bodyMuted">New to ZapZone?</Text>
            <Text
              className="text-base font-semibold text-primary"
              onPress={() => navigation.navigate('Register')}
            >
              Create account
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
