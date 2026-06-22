/**
 * Centralized endpoint paths for the ZapZone API (paths are relative to
 * `API_BASE_URL`, which already includes `/api`). Keeping these in one place
 * makes the typed service layer the single source of truth for the contract.
 */
export const endpoints = {
  auth: {
    customerLogin: '/customer-login',
    customerRegister: '/customer-register',
    register: '/customers',
    logout: '/logout',
    me: '/user',
  },

  locations: {
    list: '/locations',
    mobileList: '/mobile/locations',
    mobilePackages: (locationId: number) => `/mobile/locations/${locationId}/packages`,
    mobilePackageAvailability: (packageId: number) => `/mobile/packages/${packageId}/availability`,
  },

  catalog: {
    groupedPackages: '/packages/grouped-by-name',
    packagesByLocation: (locationId: number) => `/packages/location/${locationId}`,
    package: (id: number) => `/packages/${id}`,
    groupedAttractions: '/attractions/grouped',
    attractionsByLocation: (locationId: number) => `/attractions/location/${locationId}`,
    attraction: (id: number) => `/attractions/${id}`,
    popularAttractions: '/attractions/popular',
    groupedEvents: '/events/grouped-by-name',
    events: '/events',
    event: (id: number) => `/events/${id}`,
    eventsByLocation: (locationId: number) => `/events/location/${locationId}`,
    eventAvailableDates: (id: number) => `/events/${id}/available-dates`,
    eventAvailableTimeSlots: (id: number, date: string) =>
      `/events/${id}/available-time-slots/${date}`,
  },

  availability: {
    packageSlots: (packageId: number, date: string) =>
      `/package-time-slots/available-slots/${packageId}/${date}`,
    dayOffsByLocation: (locationId: number) => `/day-offs/location/${locationId}`,
    specialPricingForEntity: '/special-pricings/for-entity',
    specialPricingCheckDate: '/special-pricings/check-date',
    feeSupportsForEntity: '/fee-supports/for-entity',
  },

  bookings: {
    create: '/bookings',
    customerBookings: '/customers/bookings',
    storeQrCode: (bookingId: number) => `/bookings/${bookingId}/qrcode`,
  },

  attractionPurchases: {
    create: '/attraction-purchases',
    customer: '/attraction-purchases/customer',
    byCustomer: (customerId: number) => `/attraction-purchases/customer/${customerId}`,
    storeQrCode: (id: number) => `/attraction-purchases/${id}/qrcode`,
  },

  eventPurchases: {
    create: '/event-purchases',
    customer: '/event-purchases/customer',
  },

  payments: {
    charge: '/payments/charge',
    publicKey: (locationId: number) => `/authorize-net/public-key/${locationId}`,
  },

  giftCards: {
    list: '/gift-cards',
    validateCode: '/gift-cards/validate-code',
    redeem: (id: number) => `/gift-cards/${id}/redeem`,
  },

  promos: {
    validateCode: '/promos/validate-code',
  },

  memberships: {
    publicPlans: '/membership-plans/public',
    plan: (id: number) => `/membership-plans/${id}`,
    me: '/memberships/me',
    mine: '/memberships/mine/all',
    purchase: '/memberships/purchase',
    benefitsQuote: '/memberships/benefits/quote',
    paymentMethod: (id: number) => `/memberships/${id}/payment-method`,
    upgradePlan: (id: number) => `/memberships/${id}/upgrade-plan`,
    retryPayment: (id: number) => `/memberships/${id}/retry-payment`,
    freeze: (id: number) => `/memberships/${id}/freeze`,
    cancel: (id: number) => `/memberships/${id}/cancel`,
    redeemPass: (id: number) => `/memberships/${id}/redeem-pass`,
  },

  notifications: {
    list: '/customer-notifications',
    markRead: (id: number) => `/customer-notifications/${id}/mark-as-read`,
    markAllRead: (customerId: number) => `/customer-notifications/mark-all-as-read/${customerId}`,
    remove: (id: number) => `/customer-notifications/${id}`,
    unreadCount: (customerId: number) => `/customer-notifications/unread-count/${customerId}`,
  },
} as const;
