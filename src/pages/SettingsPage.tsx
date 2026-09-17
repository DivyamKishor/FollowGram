import React from 'react';
import { AnalysisResult } from '../types/instagram';
import {
  ShieldCheck,
  Trash2,
  Sun,
  Moon,
  Laptop,
  CheckCircle2,
  FileCheck,
  Download,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { exportAccountsToCsv } from '../lib/utils/csvExport';
import { ValidationPanel } from '../components/common/ValidationPanel';

interface SettingsPageProps {
  analysis: AnalysisResult;
  onClearData: () => void;
  onResetApp: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  analysis,
  onClearData,
  onResetApp,
  isDark,
  onToggleTheme,
}) => {
  const { dataQuality } = analysis;

  const handleExportFullAnalysis = () => {
    // Export combined mutuals and non-mutuals
    const combined = [
      ...analysis.dontFollowMeBack,
      ...analysis.iDontFollowBack,
      ...analysis.mutuals,
    ];
    exportAccountsToCsv(combined, 'followgram_full_relationship_audit.csv');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
          Settings & Privacy
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Manage local memory state, visual preferences, data quality audit, and privacy configuration.
        </p>
      </div>

      {/* Mathematical Validation Panel */}
      {analysis.validation && <ValidationPanel validation={analysis.validation} />}

      {/* Data Quality Panel */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Data Quality & Processing Audit
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Deterministic deduplication and sanitization performed during parse.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2 text-xs">
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <span className="text-neutral-500 dark:text-neutral-400">Files Processed</span>
            <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
              {dataQuality.filesProcessed}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <span className="text-neutral-500 dark:text-neutral-400">Total Raw Records</span>
            <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
              {dataQuality.totalRawRecords.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <span className="text-neutral-500 dark:text-neutral-400">Duplicates Pruned</span>
            <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {dataQuality.duplicatesRemoved.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40">
            <span className="text-neutral-500 dark:text-neutral-400">Datasets Identified</span>
            <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
              {dataQuality.datasetsDetected.length}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 p-3 text-xs text-neutral-500 dark:bg-neutral-800/50 dark:text-neutral-400">
          Detected datasets in this session:{' '}
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {dataQuality.datasetsDetected.map((d) => d.replace(/_/g, ' ')).join(', ')}
          </span>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
          Appearance
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Toggle between dark aesthetic and clean light mode.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (isDark) onToggleTheme();
            }}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
              !isDark
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light Theme</span>
          </button>

          <button
            onClick={() => {
              if (!isDark) onToggleTheme();
            }}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
              isDark
                ? 'border-white bg-white text-neutral-900'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark Theme</span>
          </button>
        </div>
      </div>

      {/* Data Management & Export */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900/90 space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
          Data Management
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Download consolidated reports or purge all memory.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            <div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                Download Consolidated CSV Audit
              </span>
              <p className="text-[11px] text-neutral-500">
                Exports all mutual and one-way account records into a unified spreadsheet.
              </p>
            </div>
            <button
              onClick={handleExportFullAnalysis}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export All</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/40 p-4 dark:border-red-950 dark:bg-red-950/20">
            <div>
              <span className="text-xs font-bold text-red-900 dark:text-red-300">
                Clear Current Analysis
              </span>
              <p className="text-[11px] text-red-800/70 dark:text-red-400/70">
                Immediately wipes all parsed accounts and calculations from browser memory.
              </p>
            </div>
            <button
              onClick={onClearData}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Purge Memory</span>
            </button>
          </div>
        </div>
      </div>

      {/* About FollowGram */}
      <div className="rounded-3xl border border-neutral-200/80 bg-neutral-50/70 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
          <Info className="h-4 w-4 text-rose-500" />
          <span>About FollowGram</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          FollowGram is an open, privacy-first Instagram relationship and account analytics dashboard. It processes raw export files locally without tracking, third-party analytics, or remote database storage.
        </p>
      </div>
    </div>
  );
};
