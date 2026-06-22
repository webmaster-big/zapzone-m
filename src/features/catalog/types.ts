import type { AvailabilitySchedule, DurationUnit } from '@/types/models';

/** Normalized catalog item for package list rendering. */
export interface PackageCatalogItem {
  packageId: number;
  name: string;
  description?: string;
  category?: string;
  price: string;
  pricePerAdditional?: string;
  image?: string | string[] | null;
  duration: number;
  durationUnit: DurationUnit;
  minParticipants?: number;
  maxParticipants?: number;
  locationId: number;
  locationName: string;
  availabilitySchedules?: AvailabilitySchedule[];
}

/** Raw shape of a single location entry within a grouped package. */
export interface GroupedPackageLocation {
  location_id: number;
  location_name: string;
  package_id: number;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  availability_schedules?: AvailabilitySchedule[];
}

/** Raw shape returned by `/packages/grouped-by-name`. */
export interface GroupedPackageRaw {
  name: string;
  description?: string;
  price: string;
  category?: string;
  max_guests?: number;
  duration: number;
  duration_unit: DurationUnit;
  image?: string | string[] | null;
  locations: GroupedPackageLocation[];
  min_participants?: number;
  price_per_additional?: string;
  availability_schedules?: AvailabilitySchedule[];
}
