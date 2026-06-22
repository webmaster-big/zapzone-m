import { ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Clock, Users, Check } from 'lucide-react-native';
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
import { usePackageDetail } from '@/features/catalog/hooks/useCatalog';
import { formatDuration } from '@/utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'PackageDetail'>;

export function PackageDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { packageId } = route.params;
  const { data: pkg, isLoading, error, refetch } = usePackageDetail(packageId);

  if (isLoading) return <Screen><Spinner fullscreen label="Loading package…" /></Screen>;
  if (error || !pkg) return <Screen><ErrorState error={error} onRetry={refetch} /></Screen>;

  const includedAddOns = (pkg.add_ons ?? []).filter((a) => a.is_active);
  const includedAttractions = pkg.attractions ?? [];

  return (
    <Screen edges={['bottom']}>
      <ScrollView contentContainerClassName="pb-4" showsVerticalScrollIndicator={false}>
        <NetworkImage source={pkg.image} className="h-56 w-full" />
        <View className="px-4 pt-4">
          {pkg.category ? <Badge label={pkg.category} tone="primary" /> : null}
          <Text variant="title" className="mt-2">
            {pkg.name}
          </Text>

          <View className="mt-3 flex-row items-center gap-4">
            <View className="flex-row items-center gap-1.5">
              <Clock size={15} color={theme.colors.textSubtle} />
              <Text variant="bodyMuted">{formatDuration(pkg.duration, pkg.duration_unit)}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Users size={15} color={theme.colors.textSubtle} />
              <Text variant="bodyMuted">
                {pkg.min_participants ?? 1}–{pkg.max_participants} guests
              </Text>
            </View>
          </View>

          {pkg.description ? (
            <>
              <Divider className="my-4" />
              <Text variant="subheading" className="mb-1.5">
                About
              </Text>
              <Text variant="bodyMuted">{pkg.description}</Text>
            </>
          ) : null}

          {includedAttractions.length > 0 ? (
            <>
              <Divider className="my-4" />
              <Text variant="subheading" className="mb-2">
                Included attractions
              </Text>
              <View className="gap-2">
                {includedAttractions.map((a) => (
                  <View key={a.id} className="flex-row items-center gap-2">
                    <Check size={16} color={theme.colors.success} />
                    <Text variant="body">{a.name}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {includedAddOns.length > 0 ? (
            <>
              <Divider className="my-4" />
              <Text variant="subheading" className="mb-2">
                Available add-ons
              </Text>
              <View className="gap-2">
                {includedAddOns.map((a) => (
                  <View key={a.id} className="flex-row items-center justify-between">
                    <Text variant="body">{a.name}</Text>
                    {a.price ? <PriceTag amount={a.price} size="sm" /> : null}
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="flex-row items-center justify-between border-t border-border-subtle bg-card px-4 py-3">
        <View>
          <Text variant="caption">Starting from</Text>
          <PriceTag amount={pkg.price} size="lg" />
        </View>
        <Button
          label="Book now"
          size="lg"
          onPress={() => navigation.navigate('BookPackage', { packageId })}
          className="px-8"
        />
      </View>
    </Screen>
  );
}
