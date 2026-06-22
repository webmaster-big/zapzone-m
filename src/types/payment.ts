import type { AppliedDiscount, AppliedFee, PaymentMethod, PaymentStatus } from './models';

/** Opaque payment nonce returned by Authorize.Net Accept.js. */
export interface PaymentOpaqueData {
  dataDescriptor: string;
  dataValue: string;
}

/** Per-location Accept.js credentials from `/authorize-net/public-key/{id}`. */
export interface AuthorizeNetPublicKey {
  api_login_id: string;
  client_key: string;
  environment: 'sandbox' | 'production';
}

export interface PaymentCustomerInfo {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

/** Request body for `POST /payments/charge`. */
export interface PaymentChargeRequest {
  location_id: number;
  opaqueData: PaymentOpaqueData;
  amount: number;
  order_id?: string;
  customer_id?: number;
  description?: string;
  customer?: PaymentCustomerInfo;
  signature_image?: string;
  terms_accepted?: boolean;
  payable_id?: number;
  payable_type?: 'booking' | 'attraction_purchase' | 'event_purchase';
  send_email?: boolean;
  qr_code?: string;
}

export interface Payment {
  id: number;
  payable_id?: number;
  payable_type?: 'booking' | 'attraction_purchase' | 'event_purchase';
  customer_id?: number;
  location_id: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus | 'completed' | 'failed';
  transaction_id: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  card_last_four?: string | null;
}

export interface PaymentChargeResponse {
  success: boolean;
  message: string;
  transaction_id?: string;
  auth_code?: string;
  payment?: Payment;
}

/** Card details collected in the in-app payment form (never sent to our API). */
export interface CardInput {
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
}

export interface BookingCreatePayload {
  customer_id?: number;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  package_id: number;
  location_id: number;
  room_id?: number;
  type: 'package';
  booking_date: string;
  booking_time: string;
  participants: number;
  duration: number;
  duration_unit: 'hours' | 'minutes' | 'hours and minutes';
  total_amount: number;
  amount_paid?: number;
  discount_amount?: number;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  status?: 'pending' | 'confirmed';
  notes?: string;
  special_requests?: string;
  guest_of_honor_name?: string;
  guest_of_honor_age?: number;
  guest_of_honor_gender?: 'male' | 'female' | 'other';
  addon_ids?: number[];
  additional_addons?: Array<{ addon_id: number; quantity: number; price_at_booking: number }>;
  applied_fees?: AppliedFee[] | null;
  applied_discounts?: AppliedDiscount[] | null;
  membership_id?: number | null;
  promo_code?: string | null;
  gift_card_code?: string | null;
  sms_consent?: boolean;
  send_email?: boolean;
}

export interface EventPurchaseCreatePayload {
  event_id: number;
  customer_id?: number;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  purchase_date: string;
  purchase_time: string;
  quantity: number;
  total_amount?: number;
  amount_paid?: number;
  payment_method?: PaymentMethod;
  status?: 'pending' | 'confirmed';
  send_email?: boolean;
  applied_fees?: AppliedFee[] | null;
  add_ons?: Array<{ add_on_id: number; quantity: number; price_at_purchase: number }>;
}

export interface AttractionPurchaseCreatePayload {
  attraction_id: number;
  customer_id?: number;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  location_id: number;
  purchase_date?: string;
  purchase_time?: string;
  quantity: number;
  total_amount?: number;
  amount_paid?: number;
  payment_method?: PaymentMethod;
  status?: 'pending' | 'confirmed';
  send_email?: boolean;
}
