import React, { useState, useMemo } from 'react';
import { InstagramAccount } from '../../types/instagram';
import {
  Search,
  ExternalLink,
  Download,
  ArrowUpDown,
  Calendar,
  UserX,
} from 'lucide-react';
import { formatTimestampDate, formatRelationshipAge } from '../../lib/utils/timestamps';
import { exportAccountsToCsv } from '../../lib/utils/csvExport';

interface AccountListProps {
  accounts: InstagramAccount[];
  title: string;
  description?: string;
  defaultCsvFilename: string;
  emptyMessage?: string;
  showTimestamps?: boolean;
}

type SortOption = 'alphabetical-asc' | 'alphabetical-desc' | 'date-newest' | 'date-oldest';

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  title,
  description,
  defaultCsvFilename,
  emptyMessage = 'No accounts found in this category.',
  showTimestamps = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 40;

  // Check if any accounts have timestamp data
  const hasTimestamps = useMemo(() => {
    return accounts.some((a) => typeof a.timestamp === 'number' && a.timestamp > 0);
  }, [accounts]);

  // Filter & Sort
  const processedAccounts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase().replace(/^@/, '');

    let filtered = accounts;
    if (term) {
      filtered = accounts.filter(
        (a) =>
          a.normalizedUsername.includes(term) ||
          a.username.toLowerCase().includes(term)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'alphabetical-asc') {
        return a.normalizedUsername.localeCompare(b.normalizedUsername);
      }
      if (sortBy === 'alphabetical-desc') {
        return b.normalizedUsername.localeCompare(a.normalizedUsername);
      }
      if (sortBy === 'date-newest') {
        const tA = a.timestamp || 0;
        const tB = b.timestamp || 0;
        return tB - tA;
      }
      if (sortBy === 'date-oldest') {
        const tA = a.timestamp || 9999999999;
        const tB = b.timestamp || 9999999999;
        return tA - tB;
      }
      return 0;
    });

    return sorted;
  }, [accounts, searchTerm, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedAccounts.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * pageSize;
  const paginatedAccounts = processedAccounts.slice(startIndex, startIndex + pageSize);

  const handleExportCsv = () => {
    exportAccountsToCsv(processedAccounts, defaultCsvFilename);
  };

  // Generate deterministic subtle color for avatar placeholder
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
      'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300',
      'bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-4">
      {/* List Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {title}
            </h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {processedAccounts.length.toLocaleString()}
            </span>
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={handleExportCsv}
          disabled={processedAccounts.length === 0}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by username (e.g. ridh)..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-neutral-900 placeholder-neutral-400 shadow-2xs outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder-neutral-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-800 shadow-2xs outline-none transition focus:border-rose-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
          >
            <option value="alphabetical-asc">Username (A → Z)</option>
            <option value="alphabetical-desc">Username (Z → A)</option>
            {hasTimestamps && (
              <>
                <option value="date-newest">Recently Followed (Newest)</option>
                <option value="date-oldest">Oldest Relationship</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Account Items List */}
      {paginatedAccounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center dark:border-neutral-800">
          <UserX className="h-9 w-9 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {searchTerm ? 'No accounts match your search' : emptyMessage}
          </p>
          {searchTerm && (
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
              Try searching with fewer characters or clearing the search box.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {paginatedAccounts.map((account) => {
              const profileUrl =
                account.profileUrl ||
                `https://www.instagram.com/${encodeURIComponent(account.normalizedUsername)}/`;
              const initial = (account.username[0] || 'U').toUpperCase();
              const avatarStyle = getAvatarColor(account.normalizedUsername);

              return (
                <div
                  key={account.normalizedUsername}
                  className="flex items-center justify-between p-3.5 sm:px-5 transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50"
                >
                  {/* Account Info */}
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-xs ${avatarStyle}`}
                    >
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                          @{account.username}
                        </span>
                        {account.sourceDataset && (
                          <span className="hidden sm:inline-block rounded-md bg-neutral-100 px-1.5 py-0.2 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                            {account.sourceDataset.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      {showTimestamps && account.timestamp && (
                        <div className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>
                            {formatTimestampDate(account.timestamp)} •{' '}
                            {formatRelationshipAge(account.timestamp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Open Instagram Link */}
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200/90 bg-neutral-50 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-white"
                  >
                    <span>Open</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + pageSize, processedAccounts.length)} of{' '}
                {processedAccounts.length.toLocaleString()} accounts
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPageSafe === 1}
                  className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  Previous
                </button>
                <span className="px-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {currentPageSafe} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPageSafe === totalPages}
                  className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
