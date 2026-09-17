import Papa from 'papaparse';
import { InstagramAccount, DatasetType } from '../../types/instagram';
import { normalizeInstagramUsername } from '../utils/normalizeUsername';
import { parseInstagramTimestamp } from '../utils/timestamps';

export interface CsvParseResult {
  accounts: InstagramAccount[];
  detectedType: DatasetType;
  invalidCount: number;
}

export function parseInstagramCsv(
  csvText: string,
  filenameHint: string = ''
): CsvParseResult {
  const accounts: InstagramAccount[] = [];
  let invalidCount = 0;
  let detectedType: DatasetType = 'unknown';

  const lowerFilename = filenameHint.toLowerCase();
  if (lowerFilename.includes('follower')) {
    detectedType = 'followers';
  } else if (lowerFilename.includes('following')) {
    detectedType = 'following';
  } else if (lowerFilename.includes('unfollow')) {
    detectedType = 'recently_unfollowed';
  } else if (lowerFilename.includes('pending') || lowerFilename.includes('sent')) {
    detectedType = 'pending_requests';
  } else if (lowerFilename.includes('received') || lowerFilename.includes('incoming')) {
    detectedType = 'incoming_requests';
  } else if (lowerFilename.includes('blocked')) {
    detectedType = 'blocked_profiles';
  } else if (lowerFilename.includes('suggest')) {
    detectedType = 'removed_suggestions';
  }

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  // If header parsing succeeded and produced fields
  if (parsed.data && parsed.data.length > 0) {
    for (const rawRow of parsed.data) {
      if (!rawRow || typeof rawRow !== 'object') {
        invalidCount++;
        continue;
      }
      const row = rawRow as Record<string, unknown>;

      // Find username column
      let rawUsername = '';
      let rawTimestamp: unknown = undefined;
      let rawUrl = '';

      const keys = Object.keys(row);
      for (const k of keys) {
        const lk = k.toLowerCase().replace(/[^a-z0-9]/g, '');
        const val = row[k];
        if (typeof val === 'string' && val.trim()) {
          if (lk.includes('user') || lk.includes('handle') || lk === 'name' || lk === 'title') {
            if (!rawUsername) rawUsername = val;
          } else if (lk.includes('url') || lk.includes('href') || lk.includes('link') || lk.includes('profile')) {
            if (!rawUrl) rawUrl = val;
          } else if (lk.includes('time') || lk.includes('date')) {
            if (rawTimestamp === undefined) rawTimestamp = val;
          }
        }
      }

      // If no key matched, take first non-empty string column
      if (!rawUsername) {
        for (const k of keys) {
          const val = row[k];
          if (typeof val === 'string' && val.trim()) {
            rawUsername = val;
            break;
          }
        }
      }

      if (!rawUsername && rawUrl) {
        rawUsername = rawUrl;
      }

      const normalized = normalizeInstagramUsername(rawUsername);
      if (!normalized.isValid) {
        invalidCount++;
        continue;
      }

      const timestampSeconds = parseInstagramTimestamp(rawTimestamp);

      accounts.push({
        username: normalized.username,
        normalizedUsername: normalized.normalizedUsername,
        profileUrl: rawUrl || normalized.profileUrl,
        timestamp: timestampSeconds,
        sourceDataset: detectedType !== 'unknown' ? detectedType : undefined,
        sourceFilename: filenameHint,
      });
    }
  } else {
    // Try parsing without headers (pure rows)
    const rawParsed = Papa.parse(csvText, {
      header: false,
      skipEmptyLines: true,
    });

    if (Array.isArray(rawParsed.data)) {
      for (const row of rawParsed.data as unknown[][]) {
        if (Array.isArray(row) && row.length > 0) {
          const cell = row[0];
          const normalized = normalizeInstagramUsername(cell);
          if (normalized.isValid) {
            accounts.push({
              username: normalized.username,
              normalizedUsername: normalized.normalizedUsername,
              profileUrl: normalized.profileUrl,
              timestamp: row[1] ? parseInstagramTimestamp(row[1]) : undefined,
              sourceDataset: detectedType !== 'unknown' ? detectedType : undefined,
              sourceFilename: filenameHint,
            });
          } else {
            invalidCount++;
          }
        }
      }
    }
  }

  return {
    accounts,
    detectedType,
    invalidCount,
  };
}
