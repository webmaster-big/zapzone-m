import { ASSET_URL } from '@/config/env';

/**
 * Resolves an image path from the API into a fully-qualified URL.
 * Mirrors the web app's `getImageUrl`: absolute URLs and data URIs pass through,
 * otherwise the value is prefixed with the backend `/storage/` asset base.
 * Accepts the API's occasional array-of-paths shape and uses the first entry.
 */
export function getImageUrl(img?: string | string[] | null): string | undefined {
  if (!img) return undefined;
  let value = img;
  if (Array.isArray(value)) {
    if (value.length === 0) return undefined;
    value = value[0] as string;
  }
  if (typeof value !== 'string' || value.length === 0) return undefined;
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  if (value.startsWith(ASSET_URL)) return value;
  return ASSET_URL + value.replace(/^\/+/, '');
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Formats a numeric/string amount as USD currency. */
export function formatCurrency(amount: number | string | null | undefined): string {
  const value = typeof amount === 'string' ? Number.parseFloat(amount) : (amount ?? 0);
  if (Number.isNaN(value)) return '$0.00';
  return currencyFormatter.format(value);
}

/** Parses an API decimal-string/number into a safe number. */
export function toNumber(value: number | string | null | undefined): number {
  if (value == null) return 0;
  const n = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isNaN(n) ? 0 : n;
}

/** Converts a 24h `HH:mm` string to a 12h display string. */
export function formatTime12h(time24?: string | null): string {
  if (!time24) return '';
  const parts = time24.split(':');
  const hourPart = parts[0];
  const minutePart = parts[1] ?? '00';
  const hours = Number.parseInt(hourPart ?? '0', 10);
  if (Number.isNaN(hours)) return time24;
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutePart.padStart(2, '0')} ${period}`;
}

/** Title-cases a status/enum string for display (e.g. `checked-in` -> `Checked In`). */
export function humanize(value?: string | null): string {
  if (!value) return '';
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Full customer display name. */
export function fullName(first?: string | null, last?: string | null): string {
  return [first, last].filter(Boolean).join(' ').trim();
}

/** Initials for avatars. */
export function initials(first?: string | null, last?: string | null): string {
  const f = first?.trim()?.[0] ?? '';
  const l = last?.trim()?.[0] ?? '';
  return (f + l).toUpperCase() || '?';
}

/** Compact duration label, e.g. `2 hr` / `90 min`. */
export function formatDuration(duration?: number | null, unit?: string | null): string {
  if (!duration) return '';
  const u = (unit ?? 'hours').toString();
  if (u.startsWith('min')) return `${duration} min`;
  if (u === 'hours and minutes') return `${duration} hr`;
  return duration === 1 ? '1 hr' : `${duration} hr`;
}
