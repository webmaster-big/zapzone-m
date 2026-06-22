import type { Location } from './models';

export type BillingInterval = 'monthly' | 'quarterly' | 'annual' | 'one_time' | 'custom';

export type MembershipStatus =
  | 'pending'
  | 'active'
  | 'past_due'
  | 'suspended'
  | 'frozen'
  | 'canceled'
  | 'expired';

export type BenefitType =
  | 'package_discount'
  | 'attraction_discount'
  | 'event_discount'
  | 'addon_discount'
  | 'free_entry_pass'
  | 'guest_pass'
  | 'priority_booking'
  | 'member_only_access'
  | 'birthday_reward';

export interface MembershipPlanBenefit {
  id: number;
  membership_plan_id: number;
  benefit_type: BenefitType;
  label?: string | null;
  scope_type: 'any' | 'package' | 'attraction' | 'event' | 'addon' | 'category' | 'location';
  scope_id?: number | null;
  value_mode: 'percent' | 'fixed' | 'free' | 'count' | 'flag';
  value: number;
  period?: 'per_term' | 'per_day' | 'per_visit' | 'lifetime' | 'once' | null;
  priority: number;
  is_stackable: boolean;
  is_active: boolean;
  requires_manual_redemption: boolean;
}

export interface MembershipPlan {
  id: number;
  company_id: number;
  name: string;
  slug?: string | null;
  description?: string | null;
  tier?: string | null;
  price: number;
  billing_interval: BillingInterval;
  billing_cycle?: BillingInterval | null;
  custom_billing_days?: number | null;
  trial_days: number;
  usage_type: 'unlimited' | 'limited' | 'limited_visits' | 'punch_card';
  unlimited_uses: boolean;
  unlimited_visits: boolean;
  included_visits_per_term?: number | null;
  max_visits_per_day?: number | null;
  punch_card_total?: number | null;
  location_access_mode: 'single' | 'multi' | 'all';
  location?: Location | null;
  location_access_label?: string | null;
  grace_period_days: number;
  cancellation_mode: 'immediate' | 'end_of_term' | 'staff_only';
  discount_percent?: number | null;
  benefits?: string[] | null;
  plan_benefits?: MembershipPlanBenefit[];
  requires_photo: boolean;
  is_family_or_group: boolean;
  max_family_size?: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: number;
  customer_id: number;
  membership_plan_id: number;
  home_location_id?: number | null;
  status: MembershipStatus;
  qr_token: string;
  started_at?: string | null;
  current_term_start?: string | null;
  current_term_end?: string | null;
  grace_period_ends_at?: string | null;
  frozen_until?: string | null;
  canceled_at?: string | null;
  cancellation_effective_at?: string | null;
  expires_at?: string | null;
  visits_remaining?: number | null;
  visits_used_this_term: number;
  last_visit_at?: string | null;
  payment_method_label?: string | null;
  recurring_billing_authorized: boolean;
  terms_accepted: boolean;
  billing_amount?: number | null;
  plan?: MembershipPlan;
  home_location?: { id: number; name?: string };
  valid_locations?: string[];
  location_access_label?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembershipBenefitQuoteItem {
  type: 'package' | 'attraction' | 'event' | 'addon';
  id?: number;
  category?: string;
  unit_price: number;
  quantity?: number;
}

export interface MembershipBenefitQuoteRequest {
  location_id?: number;
  membership_id?: number;
  items: MembershipBenefitQuoteItem[];
}

export interface MembershipBenefitQuote {
  eligible: boolean;
  reason?: string | null;
  membership_id?: number | null;
  plan_name?: string | null;
  currency_discount: number;
  applied: Array<{
    membership_plan_benefit_id?: number | null;
    benefit_type: string;
    value_mode: string;
    value_applied: number;
  }>;
}

export interface PurchaseMembershipPayload {
  membership_plan_id: number;
  home_location_id: number;
  opaque_data: { dataDescriptor: string; dataValue: string };
  terms_accepted: boolean;
  recurring_billing_authorized: boolean;
}

export type CancellationEffective = 'immediate' | 'end_of_term';
