import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .transform((v) => v.replace(/\s+/g, ''))
    .refine((v) => /^\d{13,19}$/.test(v), 'Enter a valid card number'),
  month: z
    .string()
    .min(1, 'Required')
    .refine((v) => /^(0?[1-9]|1[0-2])$/.test(v), 'MM'),
  year: z
    .string()
    .min(2, 'YYYY')
    .refine((v) => {
      const year = v.length === 2 ? 2000 + Number(v) : Number(v);
      return year >= currentYear && year <= currentYear + 20;
    }, 'YYYY'),
  cardCode: z
    .string()
    .refine((v) => /^\d{3,4}$/.test(v), 'CVV'),
});

export type CardFormValues = z.infer<typeof cardSchema>;

/** Guest/contact details shared by all checkout flows. */
export const guestSchema = z.object({
  guest_name: z.string().min(1, 'Name is required'),
  guest_email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  guest_phone: z.string().min(7, 'Enter a valid phone number'),
});

export type GuestFormValues = z.infer<typeof guestSchema>;

export const checkoutSchema = guestSchema.and(cardSchema);
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
