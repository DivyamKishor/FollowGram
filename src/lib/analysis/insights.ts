import {
  RelationshipMetrics,
  RelationshipAgeMetrics,
  TimelineDataPoint,
  ObjectiveInsight,
  InstagramAccount,
} from '../../types/instagram';
import { formatTimestampDate } from '../utils/timestamps';

export function generateObjectiveInsights(params: {
  metrics: RelationshipMetrics;
  ageMetrics: RelationshipAgeMetrics;
  timelineYear: TimelineDataPoint[];
  hasFollowers: boolean;
  hasFollowing: boolean;
  recentlyUnfollowed: InstagramAccount[];
  pendingRequests: InstagramAccount[];
  incomingRequests: InstagramAccount[];
  blockedProfiles: InstagramAccount[];
}): ObjectiveInsight[] {
  const {
    metrics,
    ageMetrics,
    timelineYear,
    hasFollowers,
    hasFollowing,
    recentlyUnfollowed,
    pendingRequests,
    incomingRequests,
    blockedProfiles,
  } = params;

  const insights: ObjectiveInsight[] = [];

  // 1. Relationship Balance & Reciprocation
  if (hasFollowers && hasFollowing) {
    if (metrics.followBackRate >= 75) {
      insights.push({
        id: 'high-reciprocity',
        category: 'health',
        headline: 'Strong Mutual Connectivity',
        description: `${metrics.followBackRate.toFixed(1)}% of the accounts you follow (${metrics.mutualCount.toLocaleString()} out of ${metrics.totalFollowing.toLocaleString()}) also follow you back.`,
        badgeText: `${metrics.followBackRate.toFixed(0)}% Mutual`,
        tone: 'positive',
      });
    } else if (metrics.followBackRate >= 45) {
      insights.push({
        id: 'balanced-reciprocity',
        category: 'health',
        headline: 'Balanced Network Exchange',
        description: `Approximately ${metrics.followBackRate.toFixed(1)}% of your following connections are two-way mutual relationships.`,
        badgeText: 'Balanced',
        tone: 'neutral',
      });
    } else {
      insights.push({
        id: 'curated-feed',
        category: 'health',
        headline: 'Curated Content Distribution',
        description: `You follow ${metrics.totalFollowing.toLocaleString()} accounts, with ${metrics.followingOnlyCount.toLocaleString()} being one-way follows (accounts you follow that do not follow you back).`,
        badgeText: 'Curated',
        tone: 'informational',
      });
    }

    // Ratio comparison
    if (metrics.totalFollowers > metrics.totalFollowing) {
      const diff = metrics.totalFollowers - metrics.totalFollowing;
      insights.push({
        id: 'follower-lead',
        category: 'composition',
        headline: 'Net Follower Inflow',
        description: `You have ${diff.toLocaleString()} more followers than accounts you follow, with a follower-to-following ratio of ${(
          metrics.totalFollowers / Math.max(1, metrics.totalFollowing)
        ).toFixed(2)}.`,
        badgeText: 'Inflow',
        tone: 'positive',
      });
    } else if (metrics.totalFollowing > metrics.totalFollowers) {
      const diff = metrics.totalFollowing - metrics.totalFollowers;
      insights.push({
        id: 'following-lead',
        category: 'composition',
        headline: 'Expansive Following',
        description: `You follow ${diff.toLocaleString()} more accounts than follow you back. You currently have ${metrics.followerOnlyCount.toLocaleString()} accounts who follow you that you don't follow back.`,
        badgeText: 'Broad Scope',
        tone: 'neutral',
      });
    }
  }

  // 2. Activity Milestones & Timeline
  if (timelineYear.length > 0) {
    const peakYear = [...timelineYear].sort((a, b) => b.count - a.count)[0];
    if (peakYear && peakYear.count > 0) {
      insights.push({
        id: 'peak-activity-year',
        category: 'activity',
        headline: `Peak Following Growth in ${peakYear.label}`,
        description: `You established ${peakYear.count.toLocaleString()} following relationships during ${peakYear.label} (${peakYear.percentage.toFixed(1)}% of your current timestamped following).`,
        badgeText: `${peakYear.label} Peak`,
        tone: 'informational',
      });
    }
  }

  // 3. Oldest Current Follow
  if (ageMetrics.hasTimestampData && ageMetrics.oldestFollow?.timestamp) {
    const oldestDate = formatTimestampDate(ageMetrics.oldestFollow.timestamp);
    const yearsDuration = ageMetrics.averageAgeDays ? (ageMetrics.averageAgeDays / 365.25).toFixed(1) : undefined;

    insights.push({
      id: 'oldest-follow-insight',
      category: 'activity',
      headline: `Longest-Standing Follow: @${ageMetrics.oldestFollow.username}`,
      description: `Your earliest recorded continuous follow in this dataset began on ${oldestDate}. Your average following relationship age is ${yearsDuration ? `${yearsDuration} years` : 'recorded'}.`,
      badgeText: oldestDate,
      tone: 'neutral',
    });
  }

  // 4. Follow Requests Status
  if (pendingRequests.length > 0 || incomingRequests.length > 0) {
    insights.push({
      id: 'requests-insight',
      category: 'requests',
      headline: 'Active Request Queue',
      description: `You currently have ${pendingRequests.length.toLocaleString()} outgoing pending follow requests and ${incomingRequests.length.toLocaleString()} incoming requests.`,
      badgeText: `${pendingRequests.length + incomingRequests.length} Total`,
      tone: 'informational',
    });
  }

  // 5. Unfollowed & Blocked Records
  if (recentlyUnfollowed.length > 0 || blockedProfiles.length > 0) {
    insights.push({
      id: 'maintenance-insight',
      category: 'activity',
      headline: 'Account Moderation History',
      description: `This export includes ${recentlyUnfollowed.length.toLocaleString()} accounts you recently unfollowed and ${blockedProfiles.length.toLocaleString()} blocked profiles on record.`,
      badgeText: 'Audit Records',
      tone: 'neutral',
    });
  }

  return insights;
}
