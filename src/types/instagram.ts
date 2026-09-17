export type DatasetType =
  | 'followers'
  | 'following'
  | 'recently_unfollowed'
  | 'incoming_requests'
  | 'pending_requests'
  | 'blocked_profiles'
  | 'removed_suggestions'
  | 'unknown';

export interface InstagramAccount {
  username: string;
  normalizedUsername: string;
  profileUrl?: string;
  timestamp?: number; // Unix timestamp in seconds
  sourceDataset?: DatasetType;
  sourceFilename?: string;
}

export interface DetectedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  detectedType: DatasetType;
  recordCount: number;
  rawAccounts: InstagramAccount[];
  error?: string;
}

export interface RelationshipValidation {
  isValid: boolean;
  isFollowingMathValid: boolean;
  isFollowerMathValid: boolean;
  followersCount: number;
  followingCount: number;
  mutualsCount: number;
  followingOnlyCount: number;
  followerOnlyCount: number;
  warningMessage?: string;
  equation1: string; // e.g. "57 + 562 = 619"
  equation2: string; // e.g. "57 + 3 = 60"
}

export interface RelationshipMetrics {
  totalFollowers: number;
  totalFollowing: number;
  mutualCount: number;
  followingOnlyCount: number; // Following - Followers ("They Don't Follow Me Back")
  followerOnlyCount: number; // Followers - Following ("I Don't Follow Back")
  followBackRate: number; // mutuals / following * 100
  reciprocationRate: number; // mutuals / followers * 100
  coverageRate: number; // mutuals / (followers ∪ following) * 100
}

export interface TimelineDataPoint {
  label: string; // e.g. "2023" or "Oct 2023"
  periodKey: string; // e.g. "2023" or "2023-10"
  count: number;
  percentage: number;
}

export interface RelationshipAgeMetrics {
  oldestFollow?: InstagramAccount;
  newestFollow?: InstagramAccount;
  averageAgeDays?: number;
  medianAgeDays?: number;
  hasTimestampData: boolean;
  totalWithTimestamps: number;
}

export interface ObjectiveInsight {
  id: string;
  category: 'health' | 'activity' | 'composition' | 'requests';
  headline: string;
  description: string;
  badgeText?: string;
  tone?: 'neutral' | 'positive' | 'informational';
}

export interface DataQualityStats {
  filesProcessed: number;
  datasetsDetected: DatasetType[];
  totalRawRecords: number;
  duplicatesRemoved: number;
  invalidEntriesIgnored: number;
  followersFilesCount: number;
  uniqueFollowers: number;
  uniqueFollowing: number;
}

export interface AnalysisResult {
  hasFollowers: boolean;
  hasFollowing: boolean;
  hasRelationshipComparison: boolean;
  
  followers: InstagramAccount[];
  following: InstagramAccount[];
  mutuals: InstagramAccount[];
  followingOnly: InstagramAccount[]; // Following - Followers ("They Don't Follow Me Back")
  followerOnly: InstagramAccount[]; // Followers - Following ("I Don't Follow Back")
  
  // Legacy aliases to prevent any breaks:
  dontFollowMeBack: InstagramAccount[]; // Points to followingOnly
  iDontFollowBack: InstagramAccount[]; // Points to followerOnly
  
  recentlyUnfollowed: InstagramAccount[];
  incomingRequests: InstagramAccount[];
  pendingRequests: InstagramAccount[];
  blockedProfiles: InstagramAccount[];
  removedSuggestions: InstagramAccount[];

  metrics: RelationshipMetrics;
  validation: RelationshipValidation;
  timelineYear: TimelineDataPoint[];
  timelineMonth: TimelineDataPoint[];
  ageMetrics: RelationshipAgeMetrics;
  insights: ObjectiveInsight[];
  dataQuality: DataQualityStats;
}

export type ActivePage =
  | 'overview'
  | 'people'
  | 'activity'
  | 'requests'
  | 'blocked'
  | 'insights'
  | 'settings';
