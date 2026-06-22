import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Gift, Search } from 'lucide-react-native';
import { Screen, Text, Card, Spinner, ErrorState, EmptyState, Input, Button, Badge, PriceTag } from '@/components/ui';
import { useAvailableGiftCards, useMyGiftCards } from '../hooks/useGiftCards';
import { giftCardApi, type GiftCardValidation } from '../api/giftCardApi';
import { useTheme } from '@/theme/useTheme';
import { formatLongDate } from '@/utils/date';
import { normalizeError } from '@/lib/api/errors';
import type { GiftCard } from '@/types/models';

export function GiftCardsScreen() {
  const theme = useTheme();
  const mine = useMyGiftCards();
  const available = useAvailableGiftCards();

  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<GiftCardValidation | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const onCheck = async () => {
    if (!code.trim()) return;
    setChecking(true);
    setCheckError(null);
    setResult(null);
    try {
      const res = await giftCardApi.validateCode(code.trim());
      setResult(res);
    } catch (error) {
      setCheckError(normalizeError(error).message);
    } finally {
      setChecking(false);
    }
  };

  const refreshing = mine.isRefetching || available.isRefetching;
  const onRefresh = () => {
    void mine.refetch();
    void available.refetch();
  };

  return (
    <Screen edges={['top']}>
      <View className="px-4 pb-2 pt-1">
        <Text variant="title">Gift Cards</Text>
      </View>

      <ScrollView
        contentContainerClassName="px-4 pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
      >
        {/* Check balance */}
        <Card>
          <Text variant="subheading">Check a gift card</Text>
          <Text variant="caption" className="mt-0.5">
            Enter a code to see its balance.
          </Text>
          <View className="mt-3 flex-row items-end gap-2">
            <Input
              containerClassName="flex-1"
              placeholder="Gift card code"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              leftIcon={<Search size={18} color={theme.colors.textSubtle} />}
            />
            <Button label="Check" size="lg" loading={checking} onPress={onCheck} />
          </View>
          {checkError ? <Text className="mt-2 text-sm text-danger">{checkError}</Text> : null}
          {result ? (
            <View className="mt-3 rounded-lg bg-bg-secondary p-3">
              {result.valid && result.gift_card ? (
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text variant="caption">Balance</Text>
                    <PriceTag amount={result.gift_card.balance} size="lg" />
                  </View>
                  <Badge label="Valid" tone="success" />
                </View>
              ) : (
                <Text className="text-sm text-danger">{result.message ?? 'This code is not valid.'}</Text>
              )}
            </View>
          ) : null}
        </Card>

        {/* My gift cards */}
        <Text variant="subheading" className="mb-3 mt-6">
          My gift cards
        </Text>
        {mine.isLoading ? (
          <Spinner className="py-6" />
        ) : mine.error ? (
          <ErrorState error={mine.error} onRetry={mine.refetch} />
        ) : (mine.data?.length ?? 0) === 0 ? (
          <EmptyState
            icon={<Gift size={26} color={theme.colors.primary} />}
            title="No gift cards yet"
            description="Gift cards you purchase or receive will appear here."
            className="py-8"
          />
        ) : (
          <View className="gap-2.5">
            {mine.data?.map((card) => <GiftCardItem key={card.id} card={card} />)}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

function GiftCardItem({ card }: { card: GiftCard }) {
  return (
    <Card elevated className="overflow-hidden">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text variant="overline">Gift Card</Text>
          <Text variant="subheading" className="mt-0.5">
            {card.code}
          </Text>
          {card.expiry_date ? (
            <Text variant="caption" className="mt-1">
              Expires {formatLongDate(card.expiry_date)}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          <Text variant="caption">Balance</Text>
          <PriceTag amount={card.balance} size="md" />
        </View>
      </View>
    </Card>
  );
}
