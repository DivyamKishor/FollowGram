import React, { useState } from 'react';
import { AnalysisResult } from '../types/instagram';
import { AccountList } from '../components/common/AccountList';
import { UserX, UserMinus, UserCheck, Users } from 'lucide-react';

interface PeoplePageProps {
  analysis: AnalysisResult;
}

type PeopleTab =
  | 'they_dont_follow_me_back'
  | 'i_dont_follow_back'
  | 'mutuals'
  | 'all_following'
  | 'all_followers';

export const PeoplePage: React.FC<PeoplePageProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<PeopleTab>('they_dont_follow_me_back');

  const {
    followingOnly,
    followerOnly,
    mutuals,
    following,
    followers,
    hasFollowers,
    hasFollowing,
  } = analysis;

  const tabs = [
    {
      id: 'they_dont_follow_me_back' as PeopleTab,
      label: "They Don't Follow Me Back",
      count: followingOnly.length,
      icon: UserX,
      color: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
      visible: hasFollowing && hasFollowers,
    },
    {
      id: 'i_dont_follow_back' as PeopleTab,
      label: "I Don't Follow Back",
      count: followerOnly.length,
      icon: UserMinus,
      color: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400',
      visible: hasFollowing && hasFollowers,
    },
    {
      id: 'mutuals' as PeopleTab,
      label: 'Mutual Relationships',
      count: mutuals.length,
      icon: UserCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
      visible: hasFollowing && hasFollowers,
    },
    {
      id: 'all_following' as PeopleTab,
      label: 'All Following',
      count: following.length,
      icon: Users,
      color: 'text-neutral-600 dark:text-neutral-400',
      badgeBg: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      visible: hasFollowing,
    },
    {
      id: 'all_followers' as PeopleTab,
      label: 'All Followers',
      count: followers.length,
      icon: Users,
      color: 'text-neutral-600 dark:text-neutral-400',
      badgeBg: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      visible: hasFollowers,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Account Directory & Relationships
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Search, sort, filter, and export specific relationship segments directly to CSV.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        {tabs
          .filter((t) => t.visible)
          .map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100/70 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800/70 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? '' : tab.color}`} />
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900'
                      : tab.badgeBg
                  }`}
                >
                  {tab.count.toLocaleString()}
                </span>
              </button>
            );
          })}
      </div>

      {/* Tab Panels with strict set definitions */}
      <div>
        {/* Following - Followers */}
        {activeTab === 'they_dont_follow_me_back' && (
          <AccountList
            title="They Don't Follow Me Back"
            description="Accounts you follow who don't follow you back."
            accounts={followingOnly}
            defaultCsvFilename="they_dont_follow_me_back.csv"
            emptyMessage="All accounts you follow are mutual followers."
            showTimestamps={true}
          />
        )}

        {/* Followers - Following */}
        {activeTab === 'i_dont_follow_back' && (
          <AccountList
            title="I Don't Follow Back"
            description="Accounts who follow you but you don't follow back."
            accounts={followerOnly}
            defaultCsvFilename="i_dont_follow_back.csv"
            emptyMessage="You follow back all accounts who follow you."
            showTimestamps={true}
          />
        )}

        {/* Followers ∩ Following */}
        {activeTab === 'mutuals' && (
          <AccountList
            title="Mutual Relationships"
            description="Accounts that follow you and that you follow back."
            accounts={mutuals}
            defaultCsvFilename="mutual_relationships.csv"
            emptyMessage="No mutual relationships identified in this dataset."
            showTimestamps={true}
          />
        )}

        {/* All Following */}
        {activeTab === 'all_following' && (
          <AccountList
            title="All Following"
            description="All accounts you currently follow."
            accounts={following}
            defaultCsvFilename="all_following.csv"
            emptyMessage="No following records found."
            showTimestamps={true}
          />
        )}

        {/* All Followers */}
        {activeTab === 'all_followers' && (
          <AccountList
            title="All Followers"
            description="All accounts that follow you."
            accounts={followers}
            defaultCsvFilename="all_followers.csv"
            emptyMessage="No followers records found."
            showTimestamps={true}
          />
        )}
      </div>
    </div>
  );
};
