import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Terminal, ShieldCheck } from 'lucide-react';
import { RelationshipValidation } from '../../types/instagram';

interface ValidationPanelProps {
  validation: RelationshipValidation;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ validation }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    isValid,
    isFollowingMathValid,
    isFollowerMathValid,
    followersCount,
    followingCount,
    mutualsCount,
    followingOnlyCount,
    followerOnlyCount,
    warningMessage,
  } = validation;

  return (
    <div className="w-full space-y-3">
      {/* If invalid, show prominent warning banner */}
      {!isValid && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 text-sm">
            <p className="font-bold">Data Processing Warning: Relationship equations do not balance</p>
            <p className="mt-1 text-xs opacity-90">
              {warningMessage || 'The mathematical invariant (mutuals + followingOnly === following and mutuals + followerOnly === followers) failed.'}
            </p>
          </div>
        </div>
      )}

      {/* Developer / Debug Math Validation Panel */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/70 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900/60">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-100/60 dark:hover:bg-neutral-800/50"
        >
          <div className="flex items-center gap-2.5">
            <div className={`flex h-6 w-6 items-center justify-center rounded-md ${
              isValid
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400'
            }`}>
              {isValid ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Mathematical Relationship Verification
              </span>
              <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-neutral-200/70 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                {isValid ? 'Verified Exact' : 'Discrepancy'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="hidden sm:inline text-[11px] font-mono">
              {mutualsCount} + {followingOnlyCount} = {followingCount} | {mutualsCount} + {followerOnlyCount} = {followersCount}
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {isOpen && (
          <div className="border-t border-neutral-200/80 px-4 py-3.5 dark:border-neutral-800 text-xs">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 pb-3">
              <div className="rounded-xl border border-neutral-200/60 bg-white p-2.5 dark:border-neutral-800/80 dark:bg-neutral-900">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Followers</span>
                <p className="mt-1 font-mono text-base font-bold text-neutral-900 dark:text-white">
                  {followersCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200/60 bg-white p-2.5 dark:border-neutral-800/80 dark:bg-neutral-900">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Following</span>
                <p className="mt-1 font-mono text-base font-bold text-neutral-900 dark:text-white">
                  {followingCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-pink-200/60 bg-pink-50/30 p-2.5 dark:border-pink-900/40 dark:bg-pink-950/20">
                <span className="text-[10px] uppercase font-bold text-pink-600 dark:text-pink-400">Mutuals</span>
                <p className="mt-1 font-mono text-base font-bold text-pink-700 dark:text-pink-300">
                  {mutualsCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-indigo-200/60 bg-indigo-50/30 p-2.5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">Following Only</span>
                <p className="mt-1 font-mono text-base font-bold text-indigo-700 dark:text-indigo-300">
                  {followingOnlyCount.toLocaleString()}
                </p>
                <span className="text-[9px] text-indigo-500">They Don't Follow Back</span>
              </div>

              <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Follower Only</span>
                <p className="mt-1 font-mono text-base font-bold text-emerald-700 dark:text-emerald-300">
                  {followerOnlyCount.toLocaleString()}
                </p>
                <span className="text-[9px] text-emerald-500">I Don't Follow Back</span>
              </div>
            </div>

            {/* Verification checks */}
            <div className="space-y-2 border-t border-neutral-200/60 pt-3 dark:border-neutral-800/80 font-mono text-[11px]">
              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-neutral-400" />
                  <span>mutuals ({mutualsCount}) + followingOnly ({followingOnlyCount}) === following ({followingCount})</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{mutualsCount + followingOnlyCount} = {followingCount}</span>
                  {isFollowingMathValid ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Balanced
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-3.5 w-3.5" /> Error
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-neutral-400" />
                  <span>mutuals ({mutualsCount}) + followerOnly ({followerOnlyCount}) === followers ({followersCount})</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>{mutualsCount + followerOnlyCount} = {followersCount}</span>
                  {isFollowerMathValid ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Balanced
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-3.5 w-3.5" /> Error
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
