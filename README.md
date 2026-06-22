# ZapZone Mobile

The customer-facing mobile app for the ZapZone booking platform — a native mobile
extension of the existing React web booking system (`zappoint`), backed by the same
Laravel 12 API. Built for iOS and Android with Expo.

> Scope: **customer experience only** (browse, book, pay, manage). No admin/staff features.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | React Native + Expo (SDK 56) |
| Language | TypeScript (strict) |
| Navigation | React Navigation (native-stack + bottom-tabs) + deep linking |
| Server state | TanStack Query (+ MMKV persistence for offline) |
| Global state | Zustand |
| Forms / validation | React Hook Form + Zod |
| Networking | Axios (typed API layer, retry + 401 handling) |
| Storage | MMKV (cache/prefs) · Expo Secure Store (auth token) |
| Styling | NativeWind (Tailwind) + centralized design tokens |
| UI | Custom design system, Lucide icons, Reanimated, Gesture Handler, FlashList, Bottom Sheet |
| Payments | Authorize.Net Accept.js via a hidden WebView (PCI-safe tokenization) |
| Notifications | Expo Notifications | 
| Errors / analytics | Sentry · provider-agnostic analytics (console; Firebase-ready) |
| i18n | i18next |

## Project structure

```
src/
  config/        # runtime env/config
  lib/           # api client, storage, query, network, sentry, analytics, i18n, push
  theme/         # design tokens + ThemeProvider + useTheme
  store/         # zustand stores (auth, theme, location)
  components/    # design-system primitives (ui/) + form helpers
  navigation/    # navigators, linking, navigation theme
  providers/     # AppProviders composition root
  features/      # feature-isolated modules:
    auth/  catalog/  booking/  purchases/  memberships/
    giftcards/  notifications/  reservations/  locations/  payment/  profile/  shared/
  utils/         # formatting + date helpers
```

Each feature owns its `api/`, `hooks/`, `screens/`, `components/` — business logic stays
out of UI; API calls never happen inside components.

## Getting started

```bash
npm install
cp .env.example .env       # configure API base URL / Sentry DSN
npx expo start             # then press i (iOS) or a (Android)
```

Payments (Accept.js) and push tokens require a device or a config-dev build; some native
modules (MMKV, Reanimated worklets) do not run in the web target.

## Backend integration

- Base URL from `EXPO_PUBLIC_API_BASE_URL` (falls back to the production backend).
- Customer auth via Sanctum bearer tokens (`/customer-login`, `/customer-register`).
- Catalog: grouped/location endpoints; availability via the mobile endpoints.
- Checkout: create the payable (pending) → tokenize the card in a WebView →
  `POST /payments/charge` with `payable_id`/`payable_type` (backend rolls back on decline).
- Memberships: `POST /memberships/purchase` with the Accept.js opaque token.

## Quality gates

```bash
npx tsc --noEmit                                   # type-check
npx expo export --platform ios --output-dir dist   # production bundle
```
# zapzone-m
