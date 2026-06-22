import type { DurationUnit } from '@/types/models';

/** A bookable time slot returned by the mobile availability endpoint. */
export interface PackageAvailabilitySlot {
  start_time: string;
  end_time: string;
  duration: number;
  duration_unit: DurationUnit;
  room_id: number;
  room_name: string;
  available_rooms_count: number;
  total_rooms: number;
}

export interface PackageAvailability {
  package_name: string;
  location_name: string;
  date: string;
  is_blocked: boolean;
  available_slots: PackageAvailabilitySlot[];
}

/** Add-on selection state during checkout. */
export interface SelectedAddOn {
  addon_id: number;
  name: string;
  quantity: number;
  price_at_booking: number;
}
