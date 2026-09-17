/**
 * Safe Instagram Timestamp handling.
 * Accurately parses Unix seconds vs milliseconds vs ISO dates.
 */

export function parseInstagramTimestamp(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  // If number
  if (typeof value === 'number' && !isNaN(value) && value > 0) {
    // If > 1e11, it's milliseconds (13 digits), convert to seconds
    if (value > 100000000000) {
      return Math.floor(value / 1000);
    }
    // Unix seconds (reasonable range: 2010 to 2035: ~1.26e9 to ~2.05e9)
    if (value > 1000000000 && value < 3000000000) {
      return Math.floor(value);
    }
    return undefined;
  }

  // If string
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const num = Number(trimmed);
    if (!isNaN(num) && num > 0) {
      return parseInstagramTimestamp(num);
    }

    // Try parsing date string
    const parsedDate = Date.parse(trimmed);
    if (!isNaN(parsedDate) && parsedDate > 0) {
      return Math.floor(parsedDate / 1000);
    }
  }

  return undefined;
}

export function formatTimestampDate(timestampSeconds: number | undefined): string {
  if (!timestampSeconds) return 'Unknown date';
  try {
    const date = new Date(timestampSeconds * 1000);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

export function formatRelationshipAge(timestampSeconds: number | undefined): string {
  if (!timestampSeconds) return 'Unknown';
  const now = Math.floor(Date.now() / 1000);
  const diffSeconds = Math.max(0, now - timestampSeconds);
  const days = Math.floor(diffSeconds / 86400);

  if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  const months = Math.floor(days / 30.4375);
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  const years = (days / 365.25).toFixed(1);
  return `${years} years ago`;
}
