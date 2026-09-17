import React from 'react';
import { ShieldCheck, X, Check, Lock, ServerOff, EyeOff } from 'lucide-react';

interface PrivacyNoticeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Privacy Architecture
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              100% Local Browser Execution
            </span>
          </div>
        </div>

        {/* Key statement */}
        <div className="mt-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
          <p className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            "Your data stays on your device."
          </p>
          <p className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
            FollowGram processes your Instagram export locally in your browser. Your files are not uploaded to a server.
          </p>
        </div>

        {/* Guarantees */}
        <div className="mt-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <ServerOff className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 dark:text-white">
                Zero Remote Servers or Databases
              </span>
              <p className="text-neutral-500 dark:text-neutral-400">
                All parsing, set calculations, and timeline aggregations execute client-side in browser memory.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <Lock className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 dark:text-white">
                No Instagram Credentials or API Scrapes
              </span>
              <p className="text-neutral-500 dark:text-neutral-400">
                You never enter passwords, cookies, or authorization tokens. We only read the official export files you choose to load.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <EyeOff className="h-3.5 w-3.5" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-neutral-900 dark:text-white">
                Zero Telemetry & Instant Memory Clearance
              </span>
              <p className="text-neutral-500 dark:text-neutral-400">
                No tracking scripts or remote analytics. Clicking "Clear Data" immediately purges all accounts from memory.
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-900 px-5 py-2 text-xs font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
