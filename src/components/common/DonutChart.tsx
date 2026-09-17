import React, { useState } from 'react';

interface DonutSegment {
  id: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
  darkColor: string;
  bgClass: string;
  textClass: string;
}

interface DonutChartProps {
  mutualCount: number;
  followingOnlyCount: number;
  followerOnlyCount: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  mutualCount,
  followingOnlyCount,
  followerOnlyCount,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const total = mutualCount + followingOnlyCount + followerOnlyCount;

  if (total === 0) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-neutral-400">
        No relationship data to visualize
      </div>
    );
  }

  const segments: DonutSegment[] = [
    {
      id: 'mutual',
      label: 'Mutual Relationships',
      count: mutualCount,
      percentage: total > 0 ? (mutualCount / total) * 100 : 0,
      color: '#ec4899', // Pink-500
      darkColor: '#f472b6',
      bgClass: 'bg-pink-500',
      textClass: 'text-pink-600 dark:text-pink-400',
    },
    {
      id: 'following-only',
      label: "They Don't Follow Me Back",
      count: followingOnlyCount,
      percentage: total > 0 ? (followingOnlyCount / total) * 100 : 0,
      color: '#6366f1', // Indigo-500
      darkColor: '#818cf8',
      bgClass: 'bg-indigo-500',
      textClass: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'followers-only',
      label: "I Don't Follow Back",
      count: followerOnlyCount,
      percentage: total > 0 ? (followerOnlyCount / total) * 100 : 0,
      color: '#10b981', // Emerald-500
      darkColor: '#34d399',
      bgClass: 'bg-emerald-500',
      textClass: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  // Calculate SVG arc paths
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;
  const renderedSegments = segments.map((seg) => {
    const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += (seg.percentage / 100) * circumference;

    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeSegment = segments.find((s) => s.id === hoveredId) || segments[0];

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Chart SVG */}
      <div className="relative flex shrink-0 items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 transform"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-neutral-100 dark:text-neutral-800"
          />

          {renderedSegments.map((seg) => {
            const isHovered = hoveredId === seg.id;
            return (
              <circle
                key={seg.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                onMouseEnter={() => setHoveredId(seg.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer transition-all duration-200"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            {activeSegment.count.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
            {activeSegment.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="w-full space-y-3">
        {segments.map((seg) => {
          const isSelected = hoveredId === seg.id;
          return (
            <div
              key={seg.id}
              onMouseEnter={() => setHoveredId(seg.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`flex cursor-pointer items-center justify-between rounded-xl p-2.5 transition-all ${
                isSelected
                  ? 'bg-neutral-100 dark:bg-neutral-800/80 shadow-xs'
                  : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-3 w-3 rounded-full ${seg.bgClass}`} />
                <div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {seg.label}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {seg.percentage.toFixed(1)}% of all unique connections
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {seg.count.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
