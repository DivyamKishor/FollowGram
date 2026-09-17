import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  subValue?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant?: 'emerald' | 'amber' | 'neutral' | 'rose' | 'indigo';
  };
  onClick?: () => void;
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  badge,
  onClick,
  tooltip,
}) => {
  const badgeColors = {
    emerald:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900',
    amber:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900',
    rose:
      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900',
    indigo:
      'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-900',
    neutral:
      'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  };

  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      title={tooltip}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition-all dark:border-neutral-800/80 dark:bg-neutral-900/90 ${
        isClickable
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md dark:hover:border-neutral-700'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition group-hover:scale-105 group-hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:bg-neutral-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {badge && (
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                badgeColors[badge.variant || 'neutral']
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subValue && (
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};
