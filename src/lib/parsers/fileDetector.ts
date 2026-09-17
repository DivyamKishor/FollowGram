import { DetectedFile, DatasetType, InstagramAccount } from '../../types/instagram';
import {
  parseInstagramJson,
  parseFollowersJson,
  parseFollowingJson,
  parseByDatasetType,
} from './instagramJsonParser';
import { parseInstagramCsv } from './instagramCsvParser';

/**
 * Inspects file name and JSON data to detect specific Instagram dataset type.
 */
function identifyJsonDataset(
  json: unknown,
  fileName: string
): { accounts: InstagramAccount[]; detectedType: DatasetType } {
  const lowerName = fileName.toLowerCase();

  // Explicit Following indicators:
  // e.g. following(1).json, following_1.json, following.json, or relationships_following in JSON
  const isFollowingName = lowerName.includes('following');
  const hasFollowingKey =
    Boolean(json && typeof json === 'object' && !Array.isArray(json) && 'relationships_following' in (json as Record<string, unknown>));

  if (isFollowingName || hasFollowingKey) {
    const res = parseFollowingJson(json, fileName);
    return { accounts: res.accounts, detectedType: 'following' };
  }

  // Explicit Followers indicators:
  // e.g. followers_1.json, followers(1).json, followers.json, or label_values/fbid structure
  const isFollowersName = lowerName.includes('follower');
  const hasFollowersStructure =
    (Array.isArray(json) &&
      json.length > 0 &&
      typeof json[0] === 'object' &&
      json[0] !== null &&
      ('label_values' in (json[0] as Record<string, unknown>) || 'fbid' in (json[0] as Record<string, unknown>))) ||
    (typeof json === 'object' &&
      json !== null &&
      !Array.isArray(json) &&
      ('label_values' in (json as Record<string, unknown>) || 'fbid' in (json as Record<string, unknown>)));

  if (isFollowersName || hasFollowersStructure) {
    const res = parseFollowersJson(json, fileName);
    return { accounts: res.accounts, detectedType: 'followers' };
  }

  // General dispatcher for auxiliary or other structures
  const res = parseInstagramJson(json, fileName);
  return { accounts: res.accounts, detectedType: res.detectedType };
}

/**
 * Re-parses a file with a manually specified dataset type.
 */
export async function reparseFileAsType(
  detectedFile: DetectedFile,
  newType: DatasetType
): Promise<DetectedFile> {
  if (newType === detectedFile.detectedType) {
    return detectedFile;
  }

  try {
    let accounts: InstagramAccount[] = [];
    if (detectedFile.file && detectedFile.file.size > 0) {
      const text = await detectedFile.file.text();
      const isJson = detectedFile.name.toLowerCase().endsWith('.json');
      const isCsv = detectedFile.name.toLowerCase().endsWith('.csv');

      if (isJson) {
        const json = JSON.parse(text);
        const res = parseByDatasetType(json, newType, detectedFile.name);
        accounts = res.accounts;
      } else if (isCsv) {
        const res = parseInstagramCsv(text, detectedFile.name);
        accounts = res.accounts.map((a) => ({ ...a, sourceDataset: newType }));
      } else {
        try {
          const json = JSON.parse(text);
          const res = parseByDatasetType(json, newType, detectedFile.name);
          accounts = res.accounts;
        } catch {
          const res = parseInstagramCsv(text, detectedFile.name);
          accounts = res.accounts.map((a) => ({ ...a, sourceDataset: newType }));
        }
      }
    } else {
      // Demo dataset or in-memory fallback
      accounts = detectedFile.rawAccounts.map((a) => ({
        ...a,
        sourceDataset: newType,
      }));
    }

    return {
      ...detectedFile,
      detectedType: newType,
      recordCount: accounts.length,
      rawAccounts: accounts,
      error: undefined,
    };
  } catch (err: unknown) {
    return {
      ...detectedFile,
      detectedType: newType,
      error: err instanceof Error ? err.message : 'Error reparsing file',
    };
  }
}

export async function processUploadedFile(file: File): Promise<DetectedFile> {
  const fileName = file.name;
  const isJson = fileName.toLowerCase().endsWith('.json');
  const isCsv = fileName.toLowerCase().endsWith('.csv');

  try {
    const text = await file.text();

    let accounts: InstagramAccount[] = [];
    let detectedType: DatasetType = 'unknown';

    if (isJson) {
      const json = JSON.parse(text);
      const parsed = identifyJsonDataset(json, fileName);
      accounts = parsed.accounts;
      detectedType = parsed.detectedType;
    } else if (isCsv) {
      const parsed = parseInstagramCsv(text, fileName);
      accounts = parsed.accounts;
      detectedType = parsed.detectedType;
    } else {
      // Try JSON first, then CSV
      try {
        const json = JSON.parse(text);
        const parsed = identifyJsonDataset(json, fileName);
        accounts = parsed.accounts;
        detectedType = parsed.detectedType;
      } catch {
        const parsed = parseInstagramCsv(text, fileName);
        accounts = parsed.accounts;
        detectedType = parsed.detectedType;
      }
    }

    return {
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      detectedType,
      recordCount: accounts.length,
      rawAccounts: accounts,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to parse file';
    return {
      id: `${file.name}-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      detectedType: 'unknown',
      recordCount: 0,
      rawAccounts: [],
      error: errorMsg,
    };
  }
}
