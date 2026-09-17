import React from 'react';
import { AnalysisResult } from '../types/instagram';
import {
  Sparkles,
  HeartHandshake,
  Activity,
  Layers,
  ShieldCheck,
  Percent,
  Calendar,
  Clock,
  UserCheck,
} from 'lucide-react';
import { formatTimestampDate, formatRelationshipAge } from '../lib/utils/timestamps';

interface InsightsPageProps {
  analysis: AnalysisResult;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({ analysis }) => {
  const { metrics, ageMetrics, timelineYear, insights, recentlyUnfollowed, blockedProfiles } =
    analysis;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Calculated Intelligence</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Network Dynamics & Deep Insights
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Mathematical relationships, network coverage ratios, and tenure breakdown.
        </p>
      </div>

      {/* Primary Dynamic Insight Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {insight.category}
                </span>
                {insight.badgeText && (
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {insight.badgeText}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-base font-bold text-neutral-900 dark:text-white">
                {insight.headline}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {insight.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified local calculation</span>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Dive Section 1: Relationship Health */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <HeartHandshake className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Relationship Reciprocity & Health
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Precise ratios between your inbound audience and outbound interest.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Follow-Back Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-neutral-900 dark:text-white">
                {metrics.followBackRate.toFixed(1)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              {metrics.mutualCount.toLocaleString()} out of {metrics.totalFollowing.toLocaleString()} accounts you follow follow you back.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Reciprocation Rate
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-neutral-900 dark:text-white">
                {metrics.reciprocationRate.toFixed(1)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              {metrics.mutualCount.toLocaleString()} out of {metrics.totalFollowers.toLocaleString()} followers are followed by you.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Total Network Overlap
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-neutral-900 dark:text-white">
                {metrics.coverageRate.toFixed(1)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">
              Mutual connection proportion across your entire connected orbit.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Section 2: Network Composition */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Network Distribution
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Partitioning of your total accounts into mutual vs one-way sets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
          <div className="rounded-2xl border border-pink-100 bg-pink-50/40 p-4 dark:border-pink-950 dark:bg-pink-950/20">
            <span className="text-xs font-bold text-pink-700 dark:text-pink-400">
              Mutual Relationships
            </span>
            <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
              {metrics.mutualCount.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Accounts that follow you and that you follow back.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-950 dark:bg-indigo-950/20">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
              They Don't Follow Me Back
            </span>
            <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
              {metrics.followingOnlyCount.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Accounts you follow who don't follow you back.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-950 dark:bg-emerald-950/20">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              I Don't Follow Back
            </span>
            <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
              {metrics.followerOnlyCount.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">
              Accounts who follow you but you don't follow back.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Section 3: Tenure & Timeline Milestones */}
      {ageMetrics.hasTimestampData && (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Relationship Tenure & Longevity
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Duration metrics for how long you have maintained connections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2 text-xs">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <span className="text-neutral-500">Oldest Recorded Follow</span>
              <p className="mt-1 font-bold text-neutral-900 dark:text-white truncate">
                @{ageMetrics.oldestFollow?.username}
              </p>
              <span className="mt-1 inline-block text-[11px] text-neutral-400">
                {formatTimestampDate(ageMetrics.oldestFollow?.timestamp)}
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <span className="text-neutral-500">Newest Recorded Follow</span>
              <p className="mt-1 font-bold text-neutral-900 dark:text-white truncate">
                @{ageMetrics.newestFollow?.username}
              </p>
              <span className="mt-1 inline-block text-[11px] text-neutral-400">
                {formatTimestampDate(ageMetrics.newestFollow?.timestamp)}
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <span className="text-neutral-500">Average Duration</span>
              <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                {ageMetrics.averageAgeDays
                  ? `${(ageMetrics.averageAgeDays / 365.25).toFixed(1)} years`
                  : 'N/A'}
              </p>
              <span className="mt-1 inline-block text-[11px] text-neutral-400">
                ~{ageMetrics.averageAgeDays?.toLocaleString()} days
              </span>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <span className="text-neutral-500">Median Duration</span>
              <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                {ageMetrics.medianAgeDays
                  ? `${(ageMetrics.medianAgeDays / 365.25).toFixed(1)} years`
                  : 'N/A'}
              </p>
              <span className="mt-1 inline-block text-[11px] text-neutral-400">
                ~{ageMetrics.medianAgeDays?.toLocaleString()} days
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
