import React from 'react';
import {
  ShieldCheck,
  Trash2,
  Sun,
  Moon,
  UploadCloud,
  FileSpreadsheet,
} from 'lucide-react';

interface HeaderProps {
  hasData: boolean;
  onClearData: () => void;
  onUploadMore: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasData,
  onClearData,
  onUploadMore,
  isDark,
  onToggleTheme,
  onOpenPrivacy,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white shadow-sm shadow-rose-500/20">
            {/* Custom geometric aperture / lens SVG icon */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 1 7.8 4.5L12 12" />
              <path d="M19.8 7.5a9 9 0 0 1 0 9L12 12" />
              <path d="M19.8 16.5A9 9 0 0 1 12 21L12 12" />
              <path d="M12 21a9 9 0 0 1-7.8-4.5L12 12" />
              <path d="M4.2 16.5a9 9 0 0 1 0-9L12 12" />
              <path d="M4.2 7.5A9 9 0 0 1 12 3L12 12" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                FollowGram
              </span>
              <span className="hidden sm:inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                Private Insights
              </span>
            </div>
            <p className="hidden text-xs text-neutral-500 dark:text-neutral-400 md:block">
              Your Instagram relationships, understood.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Privacy badge button */}
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
            title="FollowGram operates 100% locally in your browser. No files leave your device."
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden xs:inline">100% local processing</span>
            <span className="xs:hidden">Local</span>
          </button>

          {/* Upload More / Manage files if data loaded */}
          {hasData && (
            <button
              onClick={onUploadMore}
              className="hidden items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100/70 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 sm:flex"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Add Export Files</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Clear Data Button */}
          {hasData && (
            <button
              onClick={onClearData}
              className="flex items-center gap-1.5 rounded-lg border border-red-200/80 bg-red-50/80 px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50"
              title="Completely clear all data from browser memory"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear Data</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
