import {
  DetectedFile,
  InstagramAccount,
  RelationshipMetrics,
  RelationshipValidation,
  DataQualityStats,
} from '../../types/instagram';

export interface RelationshipEngineResult {
  followers: InstagramAccount[];
  following: InstagramAccount[];
  mutuals: InstagramAccount[];
  followingOnly: InstagramAccount[]; // Following - Followers ("They Don't Follow Me Back")
  followerOnly: InstagramAccount[]; // Followers - Following ("I Don't Follow Back")
  dontFollowMeBack: InstagramAccount[]; // legacy alias to followingOnly
  iDontFollowBack: InstagramAccount[]; // legacy alias to followerOnly
  recentlyUnfollowed: InstagramAccount[];
  incomingRequests: InstagramAccount[];
  pendingRequests: InstagramAccount[];
  blockedProfiles: InstagramAccount[];
  removedSuggestions: InstagramAccount[];
  metrics: RelationshipMetrics;
  validation: RelationshipValidation;
  dataQuality: DataQualityStats;
}

/**
 * Deduplicates a list of accounts by normalizedUsername, keeping the one with timestamp if available.
 */
function deduplicateAccounts(
  accounts: InstagramAccount[]
): { uniqueAccounts: InstagramAccount[]; duplicatesCount: number } {
  const accountMap = new Map<string, InstagramAccount>();
  let duplicatesCount = 0;

  for (const acc of accounts) {
    if (!acc.normalizedUsername) continue;
    const existing = accountMap.get(acc.normalizedUsername);
    if (!existing) {
      accountMap.set(acc.normalizedUsername, acc);
    } else {
      duplicatesCount++;
      // If current acc has timestamp and existing doesn't, upgrade existing
      if (!existing.timestamp && acc.timestamp) {
        accountMap.set(acc.normalizedUsername, {
          ...existing,
          timestamp: acc.timestamp,
        });
      }
    }
  }

  return {
    uniqueAccounts: Array.from(accountMap.values()),
    duplicatesCount,
  };
}

/**
 * Primary relationship comparison engine.
 * Computes exact Set intersections and differences in linear time O(N).
 * 
 * Strict Definitions:
 * mutuals = Followers ∩ Following
 * followingOnly = Following - Followers ("They Don't Follow Me Back")
 * followerOnly = Followers - Following ("I Don't Follow Back")
 */
export function runRelationshipEngine(files: DetectedFile[]): RelationshipEngineResult {
  let totalRawRecords = 0;
  let totalDuplicatesRemoved = 0;
  let followersFilesCount = 0;

  const rawFollowers: InstagramAccount[] = [];
  const rawFollowing: InstagramAccount[] = [];
  const rawRecentlyUnfollowed: InstagramAccount[] = [];
  const rawIncomingRequests: InstagramAccount[] = [];
  const rawPendingRequests: InstagramAccount[] = [];
  const rawBlocked: InstagramAccount[] = [];
  const rawRemovedSuggestions: InstagramAccount[] = [];

  const datasetsDetectedSet = new Set<DetectedFile['detectedType']>();

  for (const file of files) {
    if (file.error || file.rawAccounts.length === 0) continue;
    totalRawRecords += file.rawAccounts.length;
    datasetsDetectedSet.add(file.detectedType);

    switch (file.detectedType) {
      case 'followers':
        followersFilesCount++;
        rawFollowers.push(...file.rawAccounts);
        break;
      case 'following':
        rawFollowing.push(...file.rawAccounts);
        break;
      case 'recently_unfollowed':
        rawRecentlyUnfollowed.push(...file.rawAccounts);
        break;
      case 'incoming_requests':
        rawIncomingRequests.push(...file.rawAccounts);
        break;
      case 'pending_requests':
        rawPendingRequests.push(...file.rawAccounts);
        break;
      case 'blocked_profiles':
        rawBlocked.push(...file.rawAccounts);
        break;
      case 'removed_suggestions':
        rawRemovedSuggestions.push(...file.rawAccounts);
        break;
      default:
        break;
    }
  }

  // Deduplicate each dataset cleanly
  const dedupFollowers = deduplicateAccounts(rawFollowers);
  totalDuplicatesRemoved += dedupFollowers.duplicatesCount;

  const dedupFollowing = deduplicateAccounts(rawFollowing);
  totalDuplicatesRemoved += dedupFollowing.duplicatesCount;

  const dedupRecentlyUnfollowed = deduplicateAccounts(rawRecentlyUnfollowed);
  totalDuplicatesRemoved += dedupRecentlyUnfollowed.duplicatesCount;

  const dedupIncoming = deduplicateAccounts(rawIncomingRequests);
  totalDuplicatesRemoved += dedupIncoming.duplicatesCount;

  const dedupPending = deduplicateAccounts(rawPendingRequests);
  totalDuplicatesRemoved += dedupPending.duplicatesCount;

  const dedupBlocked = deduplicateAccounts(rawBlocked);
  totalDuplicatesRemoved += dedupBlocked.duplicatesCount;

  const dedupSuggestions = deduplicateAccounts(rawRemovedSuggestions);
  totalDuplicatesRemoved += dedupSuggestions.duplicatesCount;

  const followers = dedupFollowers.uniqueAccounts;
  const following = dedupFollowing.uniqueAccounts;

  // Expected relationship logic using normalized usernames:
  // followerSet = Set of all normalized follower usernames
  // followingSet = Set of all normalized following usernames
  const followerSet = new Set(followers.map((a) => a.normalizedUsername));
  const followingSet = new Set(following.map((a) => a.normalizedUsername));

  // mutuals = Followers ∩ Following
  const mutuals = following.filter((a) => followerSet.has(a.normalizedUsername));

  // followingOnly = Following - Followers ("They Don't Follow Me Back")
  const followingOnly = following.filter((a) => !followerSet.has(a.normalizedUsername));

  // followerOnly = Followers - Following ("I Don't Follow Back")
  const followerOnly = followers.filter((a) => !followingSet.has(a.normalizedUsername));

  // Legacy aliases for backward compatibility
  const dontFollowMeBack = followingOnly;
  const iDontFollowBack = followerOnly;

  // Calculate counts and rates
  const totalFollowers = followers.length;
  const totalFollowing = following.length;
  const mutualCount = mutuals.length;
  const followingOnlyCount = followingOnly.length;
  const followerOnlyCount = followerOnly.length;

  const followBackRate = totalFollowing > 0 ? (mutualCount / totalFollowing) * 100 : 0;
  const reciprocationRate = totalFollowers > 0 ? (mutualCount / totalFollowers) * 100 : 0;
  const totalUnion = new Set([
    ...followers.map((a) => a.normalizedUsername),
    ...following.map((a) => a.normalizedUsername),
  ]).size;
  const coverageRate = totalUnion > 0 ? (mutualCount / totalUnion) * 100 : 0;

  const metrics: RelationshipMetrics = {
    totalFollowers,
    totalFollowing,
    mutualCount,
    followingOnlyCount,
    followerOnlyCount,
    followBackRate,
    reciprocationRate,
    coverageRate,
  };

  // Math validations:
  // mutuals + followingOnly === following
  // mutuals + followerOnly === followers
  const isFollowingMathValid = mutualCount + followingOnlyCount === totalFollowing;
  const isFollowerMathValid = mutualCount + followerOnlyCount === totalFollowers;
  const isValid = isFollowingMathValid && isFollowerMathValid;

  const equation1 = `${mutualCount} (Mutuals) + ${followingOnlyCount} (Following Only) = ${totalFollowing} (Following)`;
  const equation2 = `${mutualCount} (Mutuals) + ${followerOnlyCount} (Follower Only) = ${totalFollowers} (Followers)`;

  let warningMessage: string | undefined = undefined;
  if (!isValid) {
    warningMessage = `Data-processing warning: Relationship equations failed validation. Equation 1 (${equation1}) [${isFollowingMathValid ? 'PASS' : 'FAIL'}]; Equation 2 (${equation2}) [${isFollowerMathValid ? 'PASS' : 'FAIL'}].`;
  }

  // Debug console output during development
  if (typeof console !== 'undefined') {
    console.log(`[FollowGram Validation] Followers: ${totalFollowers}`);
    console.log(`[FollowGram Validation] Following: ${totalFollowing}`);
    console.log(`[FollowGram Validation] Mutuals: ${mutualCount}`);
    console.log(`[FollowGram Validation] Following Only (They Don't Follow Me Back): ${followingOnlyCount}`);
    console.log(`[FollowGram Validation] Follower Only (I Don't Follow Back): ${followerOnlyCount}`);
    console.log(`[FollowGram Validation] Validate Following: ${mutualCount} + ${followingOnlyCount} === ${totalFollowing} -> ${isFollowingMathValid ? 'PASS' : 'FAIL'}`);
    console.log(`[FollowGram Validation] Validate Followers: ${mutualCount} + ${followerOnlyCount} === ${totalFollowers} -> ${isFollowerMathValid ? 'PASS' : 'FAIL'}`);
    if (warningMessage) {
      console.warn(`[FollowGram Validation WARNING] ${warningMessage}`);
    }
  }

  const validation: RelationshipValidation = {
    isValid,
    isFollowingMathValid,
    isFollowerMathValid,
    followersCount: totalFollowers,
    followingCount: totalFollowing,
    mutualsCount: mutualCount,
    followingOnlyCount,
    followerOnlyCount,
    warningMessage,
    equation1,
    equation2,
  };

  const dataQuality: DataQualityStats = {
    filesProcessed: files.length,
    datasetsDetected: Array.from(datasetsDetectedSet),
    totalRawRecords,
    duplicatesRemoved: totalDuplicatesRemoved,
    invalidEntriesIgnored: 0,
    followersFilesCount,
    uniqueFollowers: totalFollowers,
    uniqueFollowing: totalFollowing,
  };

  return {
    followers,
    following,
    mutuals,
    followingOnly,
    followerOnly,
    dontFollowMeBack,
    iDontFollowBack,
    recentlyUnfollowed: dedupRecentlyUnfollowed.uniqueAccounts,
    incomingRequests: dedupIncoming.uniqueAccounts,
    pendingRequests: dedupPending.uniqueAccounts,
    blockedProfiles: dedupBlocked.uniqueAccounts,
    removedSuggestions: dedupSuggestions.uniqueAccounts,
    metrics,
    validation,
    dataQuality,
  };
}
