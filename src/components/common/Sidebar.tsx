import React from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  Send,
  Ban,
  Sparkles,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { ActivePage, AnalysisResult } from '../../types/instagram';

interface SidebarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  analysis: AnalysisResult;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  analysis,
}) => {
  const hasRequests =
    analysis.incomingRequests.length > 0 || analysis.pendingRequests.length > 0;
  const hasBlocked = analysis.blockedProfiles.length > 0;

  const navItems = [
    {
      id: 'overview' as ActivePage,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      visible: true,
    },
    {
      id: 'people' as ActivePage,
      label: 'People',
      icon: Users,
      badge:
        analysis.hasFollowers || analysis.hasFollowing
          ? (analysis.metrics.mutualCount + analysis.metrics.followingOnlyCount).toLocaleString()
          : null,
      visible: analysis.hasFollowers || analysis.hasFollowing,
    },
    {
      id: 'activity' as ActivePage,
      label: 'Activity',
      icon: Activity,
      badge: analysis.ageMetrics.hasTimestampData
        ? `${analysis.timelineYear.length} yrs`
        : null,
      visible: analysis.ageMetrics.hasTimestampData || analysis.hasFollowing,
    },
    {
      id: 'requests' as ActivePage,
      label: 'Requests',
      icon: Send,
      badge: hasRequests
        ? (analysis.incomingRequests.length + analysis.pendingRequests.length).toString()
        : null,
      visible: hasRequests,
    },
    {
      id: 'blocked' as ActivePage,
      label: 'Blocked',
      icon: Ban,
      badge: hasBlocked ? analysis.blockedProfiles.length.toString() : null,
      visible: hasBlocked,
    },
    {
      id: 'insights' as ActivePage,
      label: 'Insights',
      icon: Sparkles,
      badge: analysis.insights.length > 0 ? `${analysis.insights.length}` : null,
      visible: true,
    },
    {
      id: 'settings' as ActivePage,
      label: 'Settings',
      icon: Settings,
      badge: null,
      visible: true,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-neutral-200/80 bg-white/70 p-4 backdrop-blur-sm dark:border-neutral-800/80 dark:bg-neutral-950/70 lg:flex min-h-[calc(100vh-4rem)]">
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Navigation
          </div>
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? 'text-white dark:text-neutral-900'
                          : 'text-neutral-400 group-hover:text-neutral-700 dark:text-neutral-500 dark:group-hover:text-neutral-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>

        {/* Bottom privacy badge */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 dark:border-neutral-800/80 dark:bg-neutral-900/50">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs">
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                Data on Device
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Processed entirely in memory. Zero external server transmissions.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Nav */}
      <nav className="fixed bottom-0 left-0 z-30 flex w-full border-t border-neutral-200/80 bg-white/95 px-2 py-1.5 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/95 lg:hidden overflow-x-auto">
        <div className="flex w-full items-center justify-around">
          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectPage(item.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    isActive
                      ? 'text-rose-600 dark:text-rose-400 font-semibold'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </div>
      </nav>
    </>
  );
};
