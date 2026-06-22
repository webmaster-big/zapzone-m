/**
 * Unwraps the various response envelopes the Laravel API uses. Some endpoints
 * return `{ success, data }`, others return the resource directly. This helper
 * normalizes both so service code stays clean.
 */
export function unwrapData<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}
