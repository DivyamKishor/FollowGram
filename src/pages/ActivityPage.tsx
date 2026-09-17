import React from 'react';
import { AnalysisResult } from '../types/instagram';
import { ActivityChart } from '../components/common/ActivityChart';
import {
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
  Flame,
  Hourglass,
  CalendarCheck,
} from 'lucide-react';
import { formatTimestampDate, formatRelationshipAge } from '../lib/utils/timestamps';
import { AccountList } from '../components/common/AccountList';

interface ActivityPageProps {
  analysis: AnalysisResult;
}

export const ActivityPage: React.FC<ActivityPageProps> = ({ analysis }) => {
  const { timelineYear, timelineMonth, ageMetrics, following, recentlyUnfollowed } =
    analysis;

  const hasTimestamps = ageMetrics.hasTimestampData;

  const peakYear = [...timelineYear].sort((a, b) => b.count - a.count)[0];
  const peakMonth = [...timelineMonth].sort((a, b) => b.count - a.count)[0];

  const averageAgeYears = ageMetrics.averageAgeDays
    ? (ageMetrics.averageAgeDays / 365.25).toFixed(1)
    : null;
  const medianAgeYears = ageMetrics.medianAgeDays
    ? (ageMetrics.medianAgeDays / 365.25).toFixed(1)
    : null;

  // Oldest 10 follows for activity leaderboard
  const oldestFollows = [...following]
    .filter((a) => typeof a.timestamp === 'number' && a.timestamp > 0)
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    .slice(0, 10);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Following Activity & Timeline
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Historical analysis of when you followed accounts, relationship age distribution, and growth trends.
        </p>
      </div>

      {!hasTimestamps ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-800">
          <Calendar className="h-10 w-10 text-neutral-400" />
          <h3 className="mt-3 text-base font-bold text-neutral-800 dark:text-neutral-200">
            Timeline unavailable for this dataset.
          </h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            Instagram exports do not always include timestamps for every account, or your export was generated without date headers.
          </p>
        </div>
      ) : (
        <>
          {/* Key Relationship Age Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Oldest Current Follow */}
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Oldest Current Follow
                </span>
                <Award className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-3">
                <p className="text-base font-extrabold text-neutral-900 dark:text-white truncate">
                  @{ageMetrics.oldestFollow?.username || 'N/A'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <CalendarCheck className="h-3.5 w-3.5 text-neutral-400" />
                  <span>
                    {formatTimestampDate(ageMetrics.oldestFollow?.timestamp)}
                  </span>
                </div>
                <span className="mt-2 inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                  {formatRelationshipAge(ageMetrics.oldestFollow?.timestamp)}
                </span>
              </div>
            </div>

            {/* Newest Current Follow */}
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Newest Current Follow
                </span>
                <Clock className="h-4 w-4 text-rose-500" />
              </div>
              <div className="mt-3">
                <p className="text-base font-extrabold text-neutral-900 dark:text-white truncate">
                  @{ageMetrics.newestFollow?.username || 'N/A'}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <CalendarCheck className="h-3.5 w-3.5 text-neutral-400" />
                  <span>
                    {formatTimestampDate(ageMetrics.newestFollow?.timestamp)}
                  </span>
                </div>
                <span className="mt-2 inline-block rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                  {formatRelationshipAge(ageMetrics.newestFollow?.timestamp)}
                </span>
              </div>
            </div>

            {/* Average Relationship Age */}
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Average Age of Follows
                </span>
                <Hourglass className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                    {averageAgeYears ? `${averageAgeYears} yrs` : 'N/A'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  ~{ageMetrics.averageAgeDays?.toLocaleString()} days average follow duration
                </p>
                <span className="mt-2 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                  Mean Duration
                </span>
              </div>
            </div>

            {/* Peak Activity Year */}
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Peak Following Period
                </span>
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                    {peakYear ? peakYear.label : 'N/A'}
                  </span>
                  {peakYear && (
                    <span className="text-xs font-semibold text-neutral-500">
                      ({peakYear.count} follows)
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {peakMonth ? `Top month: ${peakMonth.label} (${peakMonth.count})` : ''}
                </p>
                <span className="mt-2 inline-block rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-bold text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                  Most Active Growth
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
            <div className="mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Historical Following Trend
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Aggregated by year and month. Hover over bars to view exact follow counts.
              </p>
            </div>
            <ActivityChart
              timelineYear={timelineYear}
              timelineMonth={timelineMonth}
            />
          </div>

          {/* Longest-Standing Follows Table */}
          {oldestFollows.length > 0 && (
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Longest-Standing Current Follows
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Your earliest recorded continuous following relationships.
                  </p>
                </div>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  Top 10 Pioneers
                </span>
              </div>

              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {oldestFollows.map((acc, idx) => (
                  <div
                    key={acc.normalizedUsername}
                    className="flex items-center justify-between py-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-bold text-neutral-400">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          @{acc.username}
                        </span>
                        <div className="text-[11px] text-neutral-400">
                          Followed: {formatTimestampDate(acc.timestamp)} ({formatRelationshipAge(acc.timestamp)})
                        </div>
                      </div>
                    </div>

                    <a
                      href={acc.profileUrl || `https://www.instagram.com/${acc.normalizedUsername}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Unfollowed History if available */}
          {recentlyUnfollowed.length > 0 && (
            <AccountList
              title="Recently Unfollowed Accounts"
              description="Accounts you chose to unfollow recently (sorted newest first). Not accounts that unfollowed you."
              accounts={recentlyUnfollowed}
              defaultCsvFilename="recently_unfollowed.csv"
              showTimestamps={true}
            />
          )}
        </>
      )}
    </div>
  );
};
