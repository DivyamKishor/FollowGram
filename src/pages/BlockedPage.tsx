import React, { useState } from 'react';
import { AnalysisResult } from '../types/instagram';
import { AccountList } from '../components/common/AccountList';
import { Ban, UserCheck, XCircle } from 'lucide-react';

interface BlockedPageProps {
  analysis: AnalysisResult;
}

export const BlockedPage: React.FC<BlockedPageProps> = ({ analysis }) => {
  const { blockedProfiles, removedSuggestions } = analysis;
  const [activeTab, setActiveTab] = useState<'blocked' | 'suggestions'>('blocked');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Account Moderation & Privacy
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Neutral audit of accounts you have blocked and suggestions you dismissed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('blocked')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === 'blocked'
              ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <Ban className="h-4 w-4" />
          <span>Blocked Profiles</span>
          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
            {blockedProfiles.length}
          </span>
        </button>

        {removedSuggestions.length > 0 && (
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === 'suggestions'
                ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <XCircle className="h-4 w-4" />
            <span>Removed Suggestions</span>
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
              {removedSuggestions.length}
            </span>
          </button>
        )}
      </div>

      {/* Panels */}
      {activeTab === 'blocked' ? (
        <AccountList
          title="Blocked Profiles"
          description="Accounts currently blocked on your Instagram account."
          accounts={blockedProfiles}
          defaultCsvFilename="blocked_profiles.csv"
          emptyMessage="No blocked profiles recorded in this export."
          showTimestamps={true}
        />
      ) : (
        <AccountList
          title="Removed Suggested Accounts"
          description="Suggested profiles you previously dismissed from your feed suggestions."
          accounts={removedSuggestions}
          defaultCsvFilename="removed_suggestions.csv"
          emptyMessage="No removed suggestions recorded."
          showTimestamps={false}
        />
      )}
    </div>
  );
};
