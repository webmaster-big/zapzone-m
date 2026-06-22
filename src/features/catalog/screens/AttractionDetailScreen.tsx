import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Tag, Users, Baby } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import {
  Screen,
  Text,
  Button,
  NetworkImage,
  PriceTag,
  Spinner,
  ErrorState,
  Divider,
  Badge,
} from '@/components/ui';
import { useTheme } from '@/theme/useTheme';
import { useAttractionDetail } from '@/features/catalog/hooks/useCatalog';

type Props = NativeStackScreenProps<RootStackParamList, 'AttractionDetail'>;

export function AttractionDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { attractionId } = route.params;
  const { data, isLoading, error, refetch } = useAttractionDetail(attractionId);

  if (isLoading) return <Screen><Spinner fullscreen label="Loading…" /></Screen>;
  if (error || !data) return <Screen><ErrorState error={error} onRetry={refetch} /></Screen>;

  return (
    <Screen edges={['bottom']}>
      <ScrollView contentContainerClassName="pb-4" showsVerticalScrollIndicator={false}>
        <NetworkImage source={data.image} className="h-56 w-full" />
        <View className="px-4 pt-4">
          {data.category ? <Badge label={data.category} tone="primary" /> : null}
          <Text variant="title" className="mt-2">
            {data.name}
          </Text>

          <View className="mt-3 flex-row flex-wrap items-center gap-4">
            {data.min_age ? (
              <View className="flex-row items-center gap-1.5">
                <Baby size={15} color={theme.colors.textSubtle} />
                <Text variant="bodyMuted">Ages {data.min_age}+</Text>
              </View>
            ) : null}
            {data.max_capacity && data.display_capacity_to_customers ? (
              <View className="flex-row items-center gap-1.5">
                <Users size={15} color={theme.colors.textSubtle} />
                <Text variant="bodyMuted">Up to {data.max_capacity}</Text>
              </View>
            ) : null}
            {data.pricing_type ? (
              <View className="flex-row items-center gap-1.5">
                <Tag size={15} color={theme.colors.textSubtle} />
                <Text variant="bodyMuted">{data.pricing_type}</Text>
              </View>
            ) : null}
          </View>

          {data.description ? (
            <>
              <Divider className="my-4" />
              <Text variant="subheading" className="mb-1.5">
                About
              </Text>
              <Text variant="bodyMuted">{data.description}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between border-t border-border-subtle bg-card px-4 py-3">
        <View>
          <Text variant="caption">Price</Text>
          <PriceTag amount={data.price} size="lg" />
        </View>
        <Button
          label="Buy ticket"
          size="lg"
          onPress={() => navigation.navigate('PurchaseAttraction', { attractionId })}
          className="px-8"
        />
      </View>
    </Screen>
  );
}
