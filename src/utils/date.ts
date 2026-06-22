import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns';

/** Safely parse an API date (`YYYY-MM-DD` or ISO) into a Date. */
export function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  try {
    const d = value.length === 10 ? parseISO(`${value}T00:00:00`) : parseISO(value);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/** e.g. `Sat, Jun 21`. */
export function formatShortDate(value?: string | null): string {
  const d = parseDate(value);
  return d ? format(d, 'EEE, MMM d') : '';
}

/** e.g. `June 21, 2026`. */
export function formatLongDate(value?: string | null): string {
  const d = parseDate(value);
  return d ? format(d, 'MMMM d, yyyy') : '';
}

/** Friendly relative day label with fallback to short date. */
export function formatRelativeDay(value?: string | null): string {
  const d = parseDate(value);
  if (!d) return '';
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE, MMM d');
}

/** e.g. `3 hours ago`. */
export function formatTimeAgo(value?: string | null): string {
  const d = parseDate(value);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : '';
}

/** Today's date as `YYYY-MM-DD` in local time. */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Format a Date as `YYYY-MM-DD`. */
export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
