import * as Sentry from '@sentry/react-native';
import { IS_DEV, SENTRY_DSN } from '@/config/env';

/**
 * Error tracking + logging via Sentry.
 *
 * Sentry only initializes when a DSN is provided (`EXPO_PUBLIC_SENTRY_DSN`),
 * so local development and CI run without sending events. All helpers below are
 * safe no-ops when Sentry is not initialized.
 */
let initialized = false;

export function initSentry(): void {
  if (initialized || !SENTRY_DSN) return;
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: false,
    enableNative: true,
    // Lower trace sampling in production to control cost.
    tracesSampleRate: IS_DEV ? 1.0 : 0.2,
    environment: IS_DEV ? 'development' : 'production',
  });
  initialized = true;
}

export function setSentryUser(user: { id: number; email?: string } | null): void {
  if (!initialized) return;
  Sentry.setUser(user ? { id: String(user.id), email: user.email } : null);
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.error('[capture]', error, context);
  }
  if (!initialized) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  if (!initialized) return;
  Sentry.captureMessage(message, level);
}

export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  if (!initialized) return;
  Sentry.addBreadcrumb(breadcrumb);
}
