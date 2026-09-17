/**
 * Centralized Instagram username normalization and sanitization layer.
 * Resolves @user, URLs, mixed casing, and trailing slashes to consistent keys.
 */

export interface NormalizedAccountInfo {
  username: string;
  normalizedUsername: string;
  profileUrl: string;
  isValid: boolean;
}

/**
 * Extracts clean username and Instagram profile URL.
 */
export function normalizeInstagramUsername(input: unknown): NormalizedAccountInfo {
  if (input === null || input === undefined) {
    return { username: '', normalizedUsername: '', profileUrl: '', isValid: false };
  }

  let raw = String(input).trim();
  if (!raw) {
    return { username: '', normalizedUsername: '', profileUrl: '', isValid: false };
  }

  // Check if input is a URL
  if (raw.includes('instagram.com/')) {
    try {
      // Remove protocol and query params
      const cleanUrl = raw.split('?')[0].split('#')[0];
      const parts = cleanUrl.split('instagram.com/').pop()?.split('/') || [];
      // Handle special instagram url prefixes like _u/username or /p/ (not a user)
      if (parts[0] === '_u' && parts[1]) {
        raw = parts[1];
      } else if (parts[0]) {
        raw = parts[0];
      }
    } catch {
      // fallback
    }
  }

  // Remove leading '@' or extra slashes
  raw = raw.replace(/^[@/]+/, '').replace(/[/]+$/, '').trim();

  // Basic validation: Instagram usernames are alphanumeric, periods, underscores, max 30 chars
  // and do not contain special control characters
  if (!raw || raw.length > 50 || raw.includes('/') || raw.includes(' ') || raw.includes('\n')) {
    // Check if it was malformed
    return { username: raw, normalizedUsername: '', profileUrl: '', isValid: false };
  }

  // Comparison key: strictly lowercased
  const normalizedUsername = raw.toLowerCase();
  
  // Safe profile URL
  const profileUrl = `https://www.instagram.com/${encodeURIComponent(normalizedUsername)}/`;

  return {
    username: raw,
    normalizedUsername,
    profileUrl,
    isValid: normalizedUsername.length > 0 && normalizedUsername.length <= 35,
  };
}

/**
 * Validates whether a normalized username is a valid IG handle format
 */
export function isValidUsername(normalized: string): boolean {
  return Boolean(normalized && /^[a-z0-9._]{1,30}$/.test(normalized));
}
