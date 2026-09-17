import React from 'react';
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Percent,
  Clock,
  ArrowRight,
  ExternalLink,
  Send,
  Sparkles,
} from 'lucide-react';
import { AnalysisResult, ActivePage } from '../types/instagram';
import { MetricCard } from '../components/common/MetricCard';
import { DonutChart } from '../components/common/DonutChart';
import { ActivityChart } from '../components/common/ActivityChart';
import { ValidationPanel } from '../components/common/ValidationPanel';

interface OverviewPageProps {
  analysis: AnalysisResult;
  onNavigate: (page: ActivePage) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  analysis,
  onNavigate,
}) => {
  const {
    metrics,
    hasFollowers,
    hasFollowing,
    hasRelationshipComparison,
    followingOnly,
    followerOnly,
    recentlyUnfollowed,
    pendingRequests,
    timelineYear,
    timelineMonth,
    insights,
    validation,
  } = analysis;

  // Hero narrative generation based entirely on calculated real data
  let heroHeadline = 'Relationship Overview';
  let heroDescription = 'Explore your network composition and connection balance.';

  if (hasRelationshipComparison) {
    heroHeadline = `Your network has ${metrics.mutualCount.toLocaleString()} mutual relationships.`;
    heroDescription = `You follow ${metrics.totalFollowing.toLocaleString()} accounts and ${metrics.mutualCount.toLocaleString()} of those relationships are mutual. ${metrics.followingOnlyCount.toLocaleString()} accounts you follow don't currently follow you back, and ${metrics.followerOnlyCount.toLocaleString()} people follow you that you don't currently follow back.`;
  } else if (hasFollowing && !hasFollowers) {
    heroHeadline = `You are currently following ${metrics.totalFollowing.toLocaleString()} accounts.`;
    heroDescription = `Upload your followers export to cross-reference which accounts follow you back.`;
  } else if (hasFollowers && !hasFollowing) {
    heroHeadline = `You have ${metrics.totalFollowers.toLocaleString()} followers on record.`;
    heroDescription = `Upload your following export to discover mutual follows and reciprocation rates.`;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
            Instagram Relationship Insights
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Factual analytics derived strictly from your uploaded export files.
          </p>
        </div>
      </div>

      {/* Developer / Data Validation Verification Panel */}
      {validation && <ValidationPanel validation={validation} />}

      {/* Row 1 Metrics: Core counts */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <MetricCard
          label="Followers"
          value={hasFollowers ? metrics.totalFollowers : 'N/A'}
          subValue={hasFollowers ? 'Source: followers export' : 'Upload followers file'}
          icon={Users}
          badge={hasFollowers ? { text: 'Audited', variant: 'neutral' } : undefined}
          onClick={hasFollowers ? () => onNavigate('people') : undefined}
        />

        <MetricCard
          label="Following"
          value={hasFollowing ? metrics.totalFollowing : 'N/A'}
          subValue={hasFollowing ? 'Source: following export' : 'Upload following file'}
          icon={UserCheck}
          badge={hasFollowing ? { text: 'Audited', variant: 'neutral' } : undefined}
          onClick={hasFollowing ? () => onNavigate('people') : undefined}
        />

        <MetricCard
          label="Mutual Relationships"
          value={hasRelationshipComparison ? metrics.mutualCount : 'N/A'}
          subValue={
            hasRelationshipComparison
              ? `${metrics.coverageRate.toFixed(1)}% of total network`
              : 'Requires both files'
          }
          icon={UserCheck}
          badge={
            hasRelationshipComparison
              ? { text: `${metrics.mutualCount} mutual`, variant: 'emerald' }
              : undefined
          }
          onClick={hasRelationshipComparison ? () => onNavigate('people') : undefined}
        />

        <MetricCard
          label="Follow-Back Rate"
          value={hasRelationshipComparison ? `${metrics.followBackRate.toFixed(1)}%` : 'N/A'}
          subValue={
            hasRelationshipComparison
              ? `${metrics.mutualCount} of ${metrics.totalFollowing} followed`
              : 'Requires both files'
          }
          icon={Percent}
          badge={
            hasRelationshipComparison
              ? {
                  text: metrics.followBackRate >= 50 ? 'High' : 'Moderate',
                  variant: metrics.followBackRate >= 50 ? 'emerald' : 'amber',
                }
              : undefined
          }
        />
      </div>

      {/* Row 2 Metrics: Secondary relationships with strict user labels */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {hasRelationshipComparison && (
          <MetricCard
            label="They Don't Follow Me Back"
            value={metrics.followingOnlyCount}
            subValue="Accounts you follow who don't follow you back."
            icon={UserX}
            badge={{ text: 'Following only', variant: 'rose' }}
            onClick={() => onNavigate('people')}
          />
        )}

        {hasRelationshipComparison && (
          <MetricCard
            label="I Don't Follow Back"
            value={metrics.followerOnlyCount}
            subValue="Accounts who follow you but you don't follow back."
            icon={UserMinus}
            badge={{ text: 'Follower only', variant: 'indigo' }}
            onClick={() => onNavigate('people')}
          />
        )}

        {recentlyUnfollowed.length > 0 && (
          <MetricCard
            label="Recently Unfollowed"
            value={recentlyUnfollowed.length}
            subValue="Accounts you unfollowed recently"
            icon={Clock}
            badge={{ text: 'Unfollowed by you', variant: 'neutral' }}
            onClick={() => onNavigate('people')}
          />
        )}

        {pendingRequests.length > 0 && (
          <MetricCard
            label="Pending Requests"
            value={pendingRequests.length}
            subValue="Sent requests waiting for approval"
            icon={Send}
            badge={{ text: 'Outgoing', variant: 'amber' }}
            onClick={() => onNavigate('requests')}
          />
        )}
      </div>

      {/* Hero Insight Banner */}
      <div className="rounded-3xl border border-neutral-200/80 bg-gradient-to-br from-white to-neutral-50 p-6 sm:p-8 shadow-2xs dark:border-neutral-800/80 dark:from-neutral-900 dark:to-neutral-950">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Network Assessment
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                Objective Analysis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              {heroHeadline}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-3xl">
              {heroDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analysis Grid: Donut + Follow-Back Progress Card */}
      {hasRelationshipComparison && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Donut Chart Card */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
            <div className="mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Relationship Composition
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Breakdown of all unique accounts across your followers and following lists.
              </p>
            </div>
            <DonutChart
              mutualCount={metrics.mutualCount}
              followingOnlyCount={metrics.followingOnlyCount}
              followerOnlyCount={metrics.followerOnlyCount}
            />
          </div>

          {/* Follow-Back Analysis Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Follow-back Overview
                </h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  {metrics.followBackRate.toFixed(1)}% Reciprocal
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                How many of the accounts you have chosen to follow also follow your account.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Accounts you follow:
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {metrics.totalFollowing.toLocaleString()}
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="h-4 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800 flex">
                  <div
                    style={{ width: `${Math.min(100, metrics.followBackRate)}%` }}
                    className="h-full bg-emerald-500 transition-all duration-500"
                    title={`Mutuals: ${metrics.mutualCount}`}
                  />
                  <div
                    style={{
                      width: `${Math.max(0, 100 - metrics.followBackRate)}%`,
                    }}
                    className="h-full bg-indigo-500 transition-all duration-500"
                    title={`They don't follow back: ${metrics.followingOnlyCount}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 dark:border-emerald-950 dark:bg-emerald-950/20">
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                      Mutual Relationships
                    </span>
                    <p className="mt-0.5 text-lg font-extrabold text-emerald-900 dark:text-emerald-100">
                      {metrics.mutualCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-950 dark:bg-indigo-950/20">
                    <span className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300">
                      They Don't Follow Me Back
                    </span>
                    <p className="mt-0.5 text-lg font-extrabold text-indigo-900 dark:text-indigo-100">
                      {metrics.followingOnlyCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-neutral-50 p-3.5 text-xs text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400">
              <span className="font-semibold text-neutral-900 dark:text-white">
                {metrics.followBackRate.toFixed(1)}%
              </span>{' '}
              of the accounts you follow follow you back.
            </div>
          </div>
        </div>
      )}

      {/* Activity Timeline Preview */}
      {(timelineYear.length > 0 || timelineMonth.length > 0) && (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Following Activity History
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Timestamps from your following export showing when you followed your accounts.
              </p>
            </div>
            <button
              onClick={() => onNavigate('activity')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              <span>Full Activity & Age Details</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <ActivityChart
            timelineYear={timelineYear}
            timelineMonth={timelineMonth}
          />
        </div>
      )}

      {/* Quick Lists Section */}
      {hasRelationshipComparison && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Quick List 1: They Don't Follow Me Back */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    They Don't Follow Me Back
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Accounts you follow who don't follow you back.
                  </p>
                </div>
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                  {followingOnly.length.toLocaleString()}
                </span>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {followingOnly.slice(0, 5).map((acc) => (
                  <div
                    key={acc.normalizedUsername}
                    className="flex items-center justify-between py-2.5 text-xs"
                  >
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate pr-2">
                      @{acc.username}
                    </span>
                    <a
                      href={acc.profileUrl || `https://www.instagram.com/${acc.normalizedUsername}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => onNavigate('people')}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <span>View all {followingOnly.length.toLocaleString()} accounts</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Quick List 2: I Don't Follow Back */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    I Don't Follow Back
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Accounts who follow you but you don't follow back.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                  {followerOnly.length.toLocaleString()}
                </span>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {followerOnly.slice(0, 5).map((acc) => (
                  <div
                    key={acc.normalizedUsername}
                    className="flex items-center justify-between py-2.5 text-xs"
                  >
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate pr-2">
                      @{acc.username}
                    </span>
                    <a
                      href={acc.profileUrl || `https://www.instagram.com/${acc.normalizedUsername}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => onNavigate('people')}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <span>View all {followerOnly.length.toLocaleString()} accounts</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snapshot of Top Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Data Insights
            </h3>
            <button
              onClick={() => onNavigate('insights')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              View all insights
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insights.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    {item.category}
                  </span>
                  {item.badgeText && (
                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {item.badgeText}
                    </span>
                  )}
                </div>
                <h4 className="mt-2 text-sm font-bold text-neutral-900 dark:text-white">
                  {item.headline}
                </h4>
                <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
