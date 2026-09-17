import React, { useState } from 'react';
import { TimelineDataPoint } from '../../types/instagram';
import { Calendar, BarChart3 } from 'lucide-react';

interface ActivityChartProps {
  timelineYear: TimelineDataPoint[];
  timelineMonth: TimelineDataPoint[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  timelineYear,
  timelineMonth,
}) => {
  const [viewMode, setViewMode] = useState<'year' | 'month'>('year');
  const [hoveredPoint, setHoveredPoint] = useState<TimelineDataPoint | null>(null);

  const activeData = viewMode === 'year' ? timelineYear : timelineMonth;

  if (activeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-800">
        <Calendar className="h-8 w-8 text-neutral-400" />
        <p className="mt-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Timeline unavailable for this dataset.
        </p>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          Your export does not contain valid following relationship timestamps.
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...activeData.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      {/* Controls & Active Hover Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-neutral-400" />
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            {hoveredPoint
              ? `${hoveredPoint.label}: ${hoveredPoint.count.toLocaleString()} follows (${hoveredPoint.percentage.toFixed(1)}%)`
              : `Following activity distribution across ${activeData.length} ${viewMode === 'year' ? 'years' : 'months'}`}
          </span>
        </div>

        <div className="flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 dark:border-neutral-800 dark:bg-neutral-900">
          <button
            onClick={() => setViewMode('year')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              viewMode === 'year'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            By Year
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              viewMode === 'month'
                ? 'bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            By Month
          </button>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="relative h-44 w-full pt-4">
        <div className="flex h-36 items-end gap-1.5 sm:gap-2">
          {activeData.map((point) => {
            const heightPercent = Math.max(8, Math.round((point.count / maxCount) * 100));
            const isHovered = hoveredPoint?.periodKey === point.periodKey;

            return (
              <div
                key={point.periodKey}
                className="group relative flex flex-1 flex-col items-center justify-end h-full cursor-pointer"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-9 z-20 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-semibold text-white shadow-md dark:bg-neutral-100 dark:text-neutral-900">
                    {point.label}: {point.count}
                  </div>
                )}

                {/* Animated Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-200 ${
                    isHovered
                      ? 'bg-rose-500 dark:bg-rose-400'
                      : 'bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                  }`}
                />

                {/* Label */}
                <span className="mt-2 text-[10px] font-medium text-neutral-400 dark:text-neutral-500 truncate w-full text-center">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
