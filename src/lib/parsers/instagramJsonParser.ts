import { InstagramAccount, DatasetType } from '../../types/instagram';
import { normalizeInstagramUsername } from '../utils/normalizeUsername';
import { parseInstagramTimestamp } from '../utils/timestamps';

export interface JsonParseResult {
  accounts: InstagramAccount[];
  detectedType: DatasetType;
  invalidCount: number;
}

/**
 * Dedicated parser for Instagram FOLLOWERS JSON structure.
 * Instagram structure:
 * [
 *   {
 *     "timestamp": 1690000000,
 *     "label_values": [
 *       { "label": "URL", "value": "https://www.instagram.com/username" },
 *       { "label": "Name", "value": "User Name" },
 *       { "label": "Username", "value": "username" }
 *     ],
 *     "fbid": "..."
 *   }
 * ]
 * Extracts username primarily from label_values[label="Username"].value.
 */
export function parseFollowersJson(
  jsonData: unknown,
  filenameHint: string = ''
): JsonParseResult {
  const seenMap = new Map<string, InstagramAccount>();
  let invalidCount = 0;

  if (!jsonData) {
    return { accounts: [], detectedType: 'followers', invalidCount: 0 };
  }

  let itemsToProcess: unknown[] = [];

  if (Array.isArray(jsonData)) {
    itemsToProcess = jsonData;
  } else if (typeof jsonData === 'object' && jsonData !== null) {
    const root = jsonData as Record<string, unknown>;

    // Check if root itself is a single follower record (e.g. has label_values or fbid or string_list_data)
    if (
      Array.isArray(root['label_values']) ||
      typeof root['fbid'] === 'string' ||
      ('timestamp' in root && ('username' in root || 'title' in root || 'name' in root)) ||
      (Array.isArray(root['string_list_data']) && root['string_list_data'].length > 0)
    ) {
      itemsToProcess = [root];
    } else {
      const knownKeys = ['followers', 'data', 'relationships_followers', 'accounts', 'users'];
      let foundList = false;
      for (const key of knownKeys) {
        if (Array.isArray(root[key])) {
          itemsToProcess = root[key] as unknown[];
          foundList = true;
          break;
        }
      }

      if (!foundList) {
        for (const val of Object.values(root)) {
          if (Array.isArray(val) && val.length > 0) {
            itemsToProcess = val;
            foundList = true;
            break;
          }
        }
      }
    }
  }

  for (const item of itemsToProcess) {
    if (!item) {
      invalidCount++;
      continue;
    }

    let rawUsername: string = '';
    let rawTimestamp: unknown = undefined;
    let rawHref: string = '';

    if (typeof item === 'string') {
      rawUsername = item;
    } else if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;

      // 1. PRIMARY: Extract username from label_values array [label="Username"].value
      if (Array.isArray(obj['label_values'])) {
        for (const entry of obj['label_values'] as Record<string, unknown>[]) {
          if (!entry || typeof entry !== 'object') continue;
          const label = String(entry['label'] ?? '').trim().toLowerCase();
          const val = String(entry['value'] ?? '').trim();

          if (
            label === 'username' ||
            label.includes('username') ||
            label.includes('handle') ||
            label === 'user' ||
            label === 'account'
          ) {
            rawUsername = val;
          } else if (label === 'url' || label.includes('profile')) {
            rawHref = val;
          }
        }
        if (obj['timestamp'] !== undefined) {
          rawTimestamp = obj['timestamp'];
        }
      }

      // 2. FALLBACK: Check string_list_data (older/alternate export format)
      if (!rawUsername && Array.isArray(obj['string_list_data']) && obj['string_list_data'].length > 0) {
        const firstEntry = obj['string_list_data'][0] as Record<string, unknown>;
        if (firstEntry) {
          if (typeof firstEntry['value'] === 'string' && firstEntry['value'].trim()) {
            rawUsername = firstEntry['value'];
          }
          if (typeof firstEntry['href'] === 'string') {
            rawHref = firstEntry['href'];
          }
          if (firstEntry['timestamp'] !== undefined) {
            rawTimestamp = firstEntry['timestamp'];
          }
        }
      }

      // 3. FALLBACK: Direct properties (title, username, name, etc.)
      if (!rawUsername) {
        const candidateKeys = ['title', 'username', 'userName', 'user_name', 'name', 'value'];
        for (const k of candidateKeys) {
          if (typeof obj[k] === 'string' && (obj[k] as string).trim()) {
            rawUsername = obj[k] as string;
            break;
          }
        }
      }

      // Fallback timestamp from obj direct keys
      if (rawTimestamp === undefined) {
        rawTimestamp = obj['timestamp'] || obj['date'] || obj['time'] || obj['created_at'];
      }
    }

    const normalized = normalizeInstagramUsername(rawUsername || rawHref);
    if (!normalized.isValid) {
      invalidCount++;
      continue;
    }

    const timestampSeconds = parseInstagramTimestamp(rawTimestamp);
    const account: InstagramAccount = {
      username: normalized.username,
      normalizedUsername: normalized.normalizedUsername,
      profileUrl: rawHref && rawHref.startsWith('https://www.instagram.com/') ? rawHref : normalized.profileUrl,
      timestamp: timestampSeconds,
      sourceDataset: 'followers',
      sourceFilename: filenameHint || 'followers_1.json',
    };

    // Deduplicate by normalizedUsername
    if (!seenMap.has(normalized.normalizedUsername)) {
      seenMap.set(normalized.normalizedUsername, account);
    } else if (timestampSeconds && !seenMap.get(normalized.normalizedUsername)?.timestamp) {
      seenMap.set(normalized.normalizedUsername, account);
    }
  }

  return {
    accounts: Array.from(seenMap.values()),
    detectedType: 'followers',
    invalidCount,
  };
}

/**
 * Dedicated parser for Instagram FOLLOWING JSON structure.
 * Instagram structure:
 * {
 *   "relationships_following": [
 *     {
 *       "title": "username",
 *       "string_list_data": [
 *         {
 *           "href": "https://www.instagram.com/_u/username",
 *           "timestamp": 1690000000
 *         }
 *       ]
 *     }
 *   ]
 * }
 * Extracts username primarily from title, and uses string_list_data[].href and timestamp as metadata.
 */
export function parseFollowingJson(
  jsonData: unknown,
  filenameHint: string = ''
): JsonParseResult {
  const seenMap = new Map<string, InstagramAccount>();
  let invalidCount = 0;

  if (!jsonData) {
    return { accounts: [], detectedType: 'following', invalidCount: 0 };
  }

  let itemsToProcess: unknown[] = [];

  if (typeof jsonData === 'object' && jsonData !== null && !Array.isArray(jsonData)) {
    const root = jsonData as Record<string, unknown>;
    // Primary: relationships_following key
    if (Array.isArray(root['relationships_following'])) {
      itemsToProcess = root['relationships_following'] as unknown[];
    } else if (
      Array.isArray(root['string_list_data']) ||
      typeof root['title'] === 'string' ||
      Array.isArray(root['label_values']) ||
      typeof root['fbid'] === 'string'
    ) {
      // Single following item object!
      itemsToProcess = [root];
    } else {
      const candidates = ['following', 'relationships_following', 'users', 'accounts', 'data'];
      let foundList = false;
      for (const k of candidates) {
        if (Array.isArray(root[k])) {
          itemsToProcess = root[k] as unknown[];
          foundList = true;
          break;
        }
      }
      if (!foundList) {
        for (const val of Object.values(root)) {
          if (Array.isArray(val) && val.length > 0) {
            itemsToProcess = val;
            foundList = true;
            break;
          }
        }
      }
    }
  } else if (Array.isArray(jsonData)) {
    itemsToProcess = jsonData;
  }

  for (const item of itemsToProcess) {
    if (!item) {
      invalidCount++;
      continue;
    }

    let rawUsername: string = '';
    let rawTimestamp: unknown = undefined;
    let rawHref: string = '';

    if (typeof item === 'string') {
      rawUsername = item;
    } else if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;

      // 1. PRIMARY FOR FOLLOWING: extract username primarily from `title`
      if (typeof obj['title'] === 'string' && obj['title'].trim()) {
        rawUsername = obj['title'].trim();
      }

      // 2. Metadata from string_list_data array: href and timestamp
      if (Array.isArray(obj['string_list_data']) && obj['string_list_data'].length > 0) {
        const firstEntry = obj['string_list_data'][0] as Record<string, unknown>;
        if (firstEntry) {
          if (typeof firstEntry['href'] === 'string') {
            rawHref = firstEntry['href'].trim();
          }
          if (firstEntry['timestamp'] !== undefined) {
            rawTimestamp = firstEntry['timestamp'];
          }
          // If title was missing, fall back to value in string_list_data
          if (!rawUsername && typeof firstEntry['value'] === 'string' && firstEntry['value'].trim()) {
            rawUsername = firstEntry['value'].trim();
          }
        }
      }

      // 3. Fallback: label_values array if present
      if (!rawUsername && Array.isArray(obj['label_values'])) {
        for (const entry of obj['label_values'] as Record<string, unknown>[]) {
          if (!entry || typeof entry !== 'object') continue;
          const label = String(entry['label'] ?? '').trim().toLowerCase();
          const val = String(entry['value'] ?? '').trim();
          if (
            label === 'username' ||
            label.includes('username') ||
            label.includes('handle') ||
            label === 'user' ||
            label === 'account'
          ) {
            rawUsername = val;
          } else if (label === 'url' || label.includes('profile')) {
            rawHref = val;
          }
        }
      }

      // 4. Fallbacks if title, string_list_data, and label_values were missing
      if (!rawUsername) {
        const candidateKeys = ['username', 'userName', 'user_name', 'name', 'handle'];
        for (const k of candidateKeys) {
          if (typeof obj[k] === 'string' && (obj[k] as string).trim()) {
            rawUsername = obj[k] as string;
            break;
          }
        }
      }

      if (!rawUsername && rawHref) {
        rawUsername = rawHref;
      }

      if (rawTimestamp === undefined) {
        rawTimestamp = obj['timestamp'] || obj['date'] || obj['time'] || obj['created_at'];
      }
    }

    const normalized = normalizeInstagramUsername(rawUsername || rawHref);
    if (!normalized.isValid) {
      invalidCount++;
      continue;
    }

    const timestampSeconds = parseInstagramTimestamp(rawTimestamp);
    const account: InstagramAccount = {
      username: normalized.username,
      normalizedUsername: normalized.normalizedUsername,
      profileUrl: rawHref && rawHref.startsWith('https://www.instagram.com/') ? rawHref : normalized.profileUrl,
      timestamp: timestampSeconds,
      sourceDataset: 'following',
      sourceFilename: filenameHint || 'following(1).json',
    };

    if (!seenMap.has(normalized.normalizedUsername)) {
      seenMap.set(normalized.normalizedUsername, account);
    } else if (timestampSeconds && !seenMap.get(normalized.normalizedUsername)?.timestamp) {
      seenMap.set(normalized.normalizedUsername, account);
    }
  }

  return {
    accounts: Array.from(seenMap.values()),
    detectedType: 'following',
    invalidCount,
  };
}

/**
 * Parser for auxiliary dataset types (recently unfollowed, requests, blocked, etc.)
 */
function parseAuxiliaryJson(
  jsonData: unknown,
  detectedType: DatasetType,
  containerKey: string,
  filenameHint: string
): JsonParseResult {
  const seenMap = new Map<string, InstagramAccount>();
  let invalidCount = 0;

  if (!jsonData || typeof jsonData !== 'object') {
    return { accounts: [], detectedType, invalidCount: 0 };
  }

  const root = jsonData as Record<string, unknown>;
  let itemsToProcess: unknown[] = [];

  if (Array.isArray(root[containerKey])) {
    itemsToProcess = root[containerKey] as unknown[];
  } else if (Array.isArray(jsonData)) {
    itemsToProcess = jsonData;
  }

  for (const item of itemsToProcess) {
    if (!item) {
      invalidCount++;
      continue;
    }

    let rawUsername = '';
    let rawTimestamp: unknown = undefined;
    let rawHref = '';

    if (typeof item === 'string') {
      rawUsername = item;
    } else if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      if (typeof obj['title'] === 'string' && obj['title'].trim()) {
        rawUsername = obj['title'].trim();
      }
      if (Array.isArray(obj['string_list_data']) && obj['string_list_data'].length > 0) {
        const first = obj['string_list_data'][0] as Record<string, unknown>;
        if (first) {
          if (typeof first['href'] === 'string') rawHref = first['href'];
          if (first['timestamp'] !== undefined) rawTimestamp = first['timestamp'];
          if (!rawUsername && typeof first['value'] === 'string') rawUsername = first['value'];
        }
      }
      if (!rawUsername && typeof obj['username'] === 'string') rawUsername = obj['username'];
      if (!rawUsername && rawHref) rawUsername = rawHref;
      if (rawTimestamp === undefined) rawTimestamp = obj['timestamp'];
    }

    const normalized = normalizeInstagramUsername(rawUsername || rawHref);
    if (!normalized.isValid) {
      invalidCount++;
      continue;
    }

    const account: InstagramAccount = {
      username: normalized.username,
      normalizedUsername: normalized.normalizedUsername,
      profileUrl: rawHref && rawHref.startsWith('https://www.instagram.com/') ? rawHref : normalized.profileUrl,
      timestamp: parseInstagramTimestamp(rawTimestamp),
      sourceDataset: detectedType,
      sourceFilename: filenameHint,
    };

    if (!seenMap.has(normalized.normalizedUsername)) {
      seenMap.set(normalized.normalizedUsername, account);
    }
  }

  return {
    accounts: Array.from(seenMap.values()),
    detectedType,
    invalidCount,
  };
}

/**
 * Top-level dispatcher that detects dataset type and invokes the dedicated parser.
 */
export function parseInstagramJson(
  jsonData: unknown,
  filenameHint: string = ''
): JsonParseResult {
  if (!jsonData || typeof jsonData !== 'object') {
    return { accounts: [], detectedType: 'unknown', invalidCount: 0 };
  }

  const root = jsonData as Record<string, unknown>;
  const lowerName = filenameHint.toLowerCase();

  // 1. Check for specific auxiliary keys
  if (Array.isArray(root['relationships_unfollowed']) || lowerName.includes('unfollow')) {
    return parseAuxiliaryJson(jsonData, 'recently_unfollowed', 'relationships_unfollowed', filenameHint);
  }
  if (
    Array.isArray(root['relationships_follow_requests_sent']) ||
    Array.isArray(root['relationships_permanent_follow_requests']) ||
    lowerName.includes('pending') ||
    lowerName.includes('sent')
  ) {
    const key = Array.isArray(root['relationships_follow_requests_sent'])
      ? 'relationships_follow_requests_sent'
      : 'relationships_permanent_follow_requests';
    return parseAuxiliaryJson(jsonData, 'pending_requests', key, filenameHint);
  }
  if (Array.isArray(root['relationships_follow_requests_received']) || lowerName.includes('received') || lowerName.includes('incoming')) {
    return parseAuxiliaryJson(jsonData, 'incoming_requests', 'relationships_follow_requests_received', filenameHint);
  }
  if (Array.isArray(root['relationships_blocked_users']) || lowerName.includes('blocked')) {
    return parseAuxiliaryJson(jsonData, 'blocked_profiles', 'relationships_blocked_users', filenameHint);
  }
  if (Array.isArray(root['relationships_dismissed_suggested_users']) || lowerName.includes('suggest')) {
    return parseAuxiliaryJson(jsonData, 'removed_suggestions', 'relationships_dismissed_suggested_users', filenameHint);
  }

  // 2. Distinguish between Followers and Following
  // Following checks: relationships_following key OR filename has following (e.g. following(1).json, following.json)
  if (Array.isArray(root['relationships_following']) || lowerName.includes('following')) {
    return parseFollowingJson(jsonData, filenameHint);
  }

  // Followers checks: filename has follower (e.g. followers_1.json, followers.json) OR has label_values structure
  if (lowerName.includes('follower')) {
    return parseFollowersJson(jsonData, filenameHint);
  }

  // Inspect content if filename didn't match:
  if (Array.isArray(jsonData) && jsonData.length > 0) {
    const first = jsonData[0] as Record<string, unknown>;
    if (first && Array.isArray(first['label_values'])) {
      return parseFollowersJson(jsonData, filenameHint);
    }
  }

  // If root has following key
  if (Array.isArray(root['following'])) {
    return parseFollowingJson(jsonData, filenameHint);
  }

  // If root has followers key
  if (Array.isArray(root['followers'])) {
    return parseFollowersJson(jsonData, filenameHint);
  }

  // Default fallback: if any item has label_values use followers parser, else following
  return parseFollowersJson(jsonData, filenameHint);
}

/**
 * Parses JSON explicitly based on user-selected or programmatically chosen dataset type.
 */
export function parseByDatasetType(
  jsonData: unknown,
  type: DatasetType,
  filenameHint: string = ''
): JsonParseResult {
  switch (type) {
    case 'followers':
      return parseFollowersJson(jsonData, filenameHint);
    case 'following':
      return parseFollowingJson(jsonData, filenameHint);
    case 'recently_unfollowed':
      return parseAuxiliaryJson(jsonData, 'recently_unfollowed', 'relationships_unfollowed', filenameHint);
    case 'pending_requests': {
      const root = jsonData as Record<string, unknown>;
      const key = Array.isArray(root?.['relationships_follow_requests_sent'])
        ? 'relationships_follow_requests_sent'
        : 'relationships_permanent_follow_requests';
      return parseAuxiliaryJson(jsonData, 'pending_requests', key, filenameHint);
    }
    case 'incoming_requests':
      return parseAuxiliaryJson(jsonData, 'incoming_requests', 'relationships_follow_requests_received', filenameHint);
    case 'blocked_profiles':
      return parseAuxiliaryJson(jsonData, 'blocked_profiles', 'relationships_blocked_users', filenameHint);
    case 'removed_suggestions':
      return parseAuxiliaryJson(jsonData, 'removed_suggestions', 'relationships_dismissed_suggested_users', filenameHint);
    default:
      return parseInstagramJson(jsonData, filenameHint);
  }
}

