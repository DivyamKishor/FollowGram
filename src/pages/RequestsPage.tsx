import React, { useState } from 'react';
import { AnalysisResult } from '../types/instagram';
import { AccountList } from '../components/common/AccountList';
import { Send, UserPlus, Inbox } from 'lucide-react';

interface RequestsPageProps {
  analysis: AnalysisResult;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({ analysis }) => {
  const { incomingRequests, pendingRequests } = analysis;
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>(
    pendingRequests.length > 0 ? 'outgoing' : 'incoming'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Follow Requests
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Review pending requests you sent to private accounts and requests you received.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === 'outgoing'
              ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <Send className="h-4 w-4" />
          <span>Outgoing (Pending Follows)</span>
          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
            {pendingRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
            activeTab === 'incoming'
              ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
          }`}
        >
          <Inbox className="h-4 w-4" />
          <span>Incoming Requests Received</span>
          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
            {incomingRequests.length}
          </span>
        </button>
      </div>

      {/* Active Tab Panel */}
      {activeTab === 'outgoing' ? (
        <AccountList
          title="Outgoing Pending Follow Requests"
          description="Accounts you requested to follow whose requests are still pending their approval."
          accounts={pendingRequests}
          defaultCsvFilename="pending_follow_requests.csv"
          emptyMessage="You have no pending outgoing follow requests."
          showTimestamps={true}
        />
      ) : (
        <AccountList
          title="Incoming Follow Requests"
          description="Accounts that requested to follow you waiting for your decision."
          accounts={incomingRequests}
          defaultCsvFilename="incoming_follow_requests.csv"
          emptyMessage="You have no incoming follow requests recorded."
          showTimestamps={true}
        />
      )}
    </div>
  );
};
