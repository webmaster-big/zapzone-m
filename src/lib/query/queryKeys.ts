/**
 * Centralized, hierarchical query keys. Using a factory keeps invalidation
 * precise (e.g. invalidate all of `bookings` or a single booking) and avoids
 * stringly-typed drift between queries and mutations.
 */
export const queryKeys = {
  locations: () => ['locations'] as const,

  packages: {
    all: () => ['packages'] as const,
    grouped: (search?: string, date?: string) => ['packages', 'grouped', { search, date }] as const,
    byLocation: (locationId: number, date?: string) =>
      ['packages', 'location', locationId, { date }] as const,
    detail: (id: number) => ['packages', 'detail', id] as const,
    availability: (packageId: number, date: string) =>
      ['packages', 'availability', packageId, date] as const,
  },

  attractions: {
    all: () => ['attractions'] as const,
    grouped: (search?: string, date?: string) =>
      ['attractions', 'grouped', { search, date }] as const,
    byLocation: (locationId: number) => ['attractions', 'location', locationId] as const,
    detail: (id: number) => ['attractions', 'detail', id] as const,
  },

  events: {
    all: () => ['events'] as const,
    grouped: (search?: string) => ['events', 'grouped', { search }] as const,
    byLocation: (locationId: number) => ['events', 'location', locationId] as const,
    detail: (id: number) => ['events', 'detail', id] as const,
    availableDates: (id: number) => ['events', id, 'available-dates'] as const,
    availableSlots: (id: number, date: string) => ['events', id, 'slots', date] as const,
  },

  bookings: {
    all: () => ['bookings'] as const,
    mine: (customerId?: number, email?: string) =>
      ['bookings', 'mine', { customerId, email }] as const,
  },

  attractionPurchases: {
    mine: (customerId?: number, email?: string) =>
      ['attraction-purchases', 'mine', { customerId, email }] as const,
  },

  eventPurchases: {
    mine: (customerId?: number, email?: string) =>
      ['event-purchases', 'mine', { customerId, email }] as const,
  },

  giftCards: {
    available: () => ['gift-cards', 'available'] as const,
    mine: (customerId: number) => ['gift-cards', 'mine', customerId] as const,
  },

  memberships: {
    plans: () => ['membership-plans', 'public'] as const,
    me: () => ['memberships', 'me'] as const,
  },

  notifications: {
    list: (customerId: number) => ['notifications', customerId] as const,
    unreadCount: (customerId: number) => ['notifications', 'unread', customerId] as const,
  },
} as const;
