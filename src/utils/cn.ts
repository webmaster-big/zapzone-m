type ClassValue = string | number | null | false | undefined;

/**
 * Minimal className joiner (clsx-style) without extra dependencies.
 * Later classes are emitted after earlier ones; with NativeWind's last-wins
 * resolution this lets callers override base component styles via `className`.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
