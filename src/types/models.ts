/**
 * Customer-facing domain models. Field shapes mirror the Laravel API responses
 * and the web app's TypeScript interfaces so the mobile client stays a faithful
 * extension of the existing product.
 */

export type DurationUnit = 'hours' | 'minutes' | 'hours and minutes';
export type Gender = 'male' | 'female' | 'other';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked-in'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'refunded' | 'voided';
export type PaymentMethod = 'card' | 'in-store' | 'paylater' | 'authorize.net' | 'cash';

export interface Location {
  id: number;
  company_id?: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  timezone?: string;
  booking_window_days?: number | null;
}

export interface AppliedFee {
  fee_name: string;
  fee_amount: number;
  fee_application_type: 'additive' | 'inclusive';
}

export interface AppliedDiscount {
  discount_name: string;
  discount_amount: number;
  discount_type: 'fixed' | 'percentage';
  original_price: number;
  special_pricing_id: number | null;
}

export interface MembershipAppliedLine {
  membership_plan_benefit_id: number | null;
  benefit_type: string;
  value_mode: string;
  value_applied: number;
}

export interface AddOn {
  id: number;
  location_id: number;
  name: string;
  price: string | null;
  description?: string;
  image?: string;
  is_active: boolean;
  min_quantity?: number;
  max_quantity?: number;
  is_force_add_on?: boolean;
}

export interface RoomOption {
  id: number;
  location_id: number;
  name: string;
  capacity: number | null;
  is_available: boolean;
}

export interface PackageAttraction {
  id: number;
  location_id: number;
  name: string;
  price: string;
  description?: string;
  image?: string;
  is_active: boolean;
  min_quantity?: number;
  max_quantity?: number;
}

export interface AvailabilitySchedule {
  id: number;
  package_id: number;
  availability_type: 'daily' | 'weekly' | 'monthly';
  day_configuration: string[] | null;
  time_slot_start: string;
  time_slot_end: string;
  time_slot_interval: number;
  priority: number;
  is_active: boolean;
}

export interface Package {
  id: number;
  location_id: number;
  name: string;
  description: string;
  category: string;
  features?: string;
  price: string;
  price_per_additional?: string;
  min_participants?: number;
  max_participants: number;
  duration: number;
  duration_unit: DurationUnit;
  availability_schedules?: AvailabilitySchedule[];
  image?: string | string[];
  is_active: boolean;
  partial_payment_percentage?: number | null;
  partial_payment_fixed?: number | null;
  has_guest_of_honor?: boolean;
  customer_notes?: string;
  booking_window_days?: number | null;
  min_booking_notice_hours?: number | null;
  location?: Location;
  attractions?: PackageAttraction[];
  add_ons?: AddOn[];
  rooms?: RoomOption[];
}

/** A package grouped across locations (from `/packages/grouped-by-name`). */
export interface GroupedPackage {
  name: string;
  description?: string;
  category?: string;
  image?: string | string[];
  price?: string;
  packages: Package[];
}

export interface Attraction {
  id: number;
  location_id: number;
  name: string;
  description: string;
  price: number | string;
  pricing_type?: string;
  max_capacity?: number;
  category: string;
  unit?: string;
  duration?: number;
  duration_unit?: DurationUnit;
  image?: string | string[];
  rating?: number;
  min_age?: number;
  is_active: boolean;
  min_quantity?: number;
  max_quantity?: number;
  add_ons?: AddOn[];
  display_capacity_to_customers?: boolean;
  display_order?: number;
  location?: Location;
}

export interface GroupedAttraction {
  name: string;
  description?: string;
  category?: string;
  image?: string | string[];
  attractions: Attraction[];
}

export interface EventAddOn {
  id: number;
  name: string;
  price: string;
  description?: string;
  image?: string;
  is_active?: boolean;
  min_quantity?: number;
  max_quantity?: number;
}

export interface AppEvent {
  id: number;
  location_id: number;
  name: string;
  description: string | null;
  image: string | null;
  date_type: 'one_time' | 'date_range';
  start_date: string;
  end_date: string | null;
  time_start: string;
  time_end: string;
  interval_minutes: number;
  max_bookings_per_slot: number | null;
  price: string;
  features: string[] | null;
  is_active: boolean;
  location?: Location;
  add_ons?: EventAddOn[];
}

export interface GroupedEvent {
  name: string;
  description?: string | null;
  image?: string | null;
  events: AppEvent[];
}

export interface Booking {
  id: number;
  reference_number: string;
  customer_id?: number;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  package_id?: number;
  location_id: number;
  room_id?: number;
  type: 'package';
  booking_date: string;
  booking_time: string;
  participants: number;
  duration: number;
  duration_unit: DurationUnit;
  total_amount: string | number;
  amount_paid: string | number;
  discount_amount?: string | number;
  payment_method?: PaymentMethod;
  payment_status: PaymentStatus;
  status: BookingStatus;
  notes?: string;
  special_requests?: string;
  guest_of_honor_name?: string;
  guest_of_honor_age?: number;
  guest_of_honor_gender?: Gender;
  checked_in_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  qr_code_path?: string | null;
  package?: Package;
  location?: Location;
  room?: RoomOption;
  applied_fees?: AppliedFee[] | null;
}

export interface AttractionPurchase {
  id: number;
  reference_number: string;
  attraction_id: number;
  customer_id: number | null;
  location_id: number;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  purchase_date?: string | null;
  purchase_time?: string | null;
  quantity: number;
  total_amount: string;
  amount_paid: string;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  status: BookingStatus;
  transaction_id: string | null;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
  qr_code_path?: string | null;
  attraction?: Attraction;
  location?: Location;
}

export interface EventPurchase {
  id: number;
  reference_number: string;
  event_id: number;
  customer_id: number | null;
  location_id: number;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  purchase_date: string;
  purchase_time: string;
  quantity: number;
  total_amount: string;
  amount_paid: string;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  status: BookingStatus;
  transaction_id: string | null;
  checked_in_at: string | null;
  created_at: string;
  updated_at: string;
  qr_code_path?: string | null;
  event?: AppEvent;
  location?: Location;
}

export interface GiftCard {
  id: number;
  code: string;
  type: 'fixed' | 'percentage';
  initial_value: number;
  balance: number;
  max_usage?: number;
  description?: string;
  status: 'active' | 'inactive' | 'expired' | 'redeemed' | 'cancelled' | 'deleted';
  expiry_date?: string | null;
  location_id?: number;
  created_at: string;
  updated_at: string;
}

export type NotificationType =
  | 'booking'
  | 'payment'
  | 'promotion'
  | 'gift_card'
  | 'reminder'
  | 'general'
  | 'attraction';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface CustomerNotification {
  id: number;
  customer_id: number;
  location_id?: number | null;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  priority: NotificationPriority;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}
