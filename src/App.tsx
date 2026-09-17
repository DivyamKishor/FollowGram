import React, { useState, useEffect } from 'react';
import {
  DetectedFile,
  AnalysisResult,
  ActivePage,
} from './types/instagram';
import { runRelationshipEngine } from './lib/analysis/relationships';
import { analyzeFollowingTimeline } from './lib/analysis/timeline';
import { generateObjectiveInsights } from './lib/analysis/insights';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PrivacyNotice } from './components/common/PrivacyNotice';
import { FileUploader } from './components/upload/FileUploader';
import { OverviewPage } from './pages/OverviewPage';
import { PeoplePage } from './pages/PeoplePage';
import { ActivityPage } from './pages/ActivityPage';
import { RequestsPage } from './pages/RequestsPage';
import { BlockedPage } from './pages/BlockedPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [files, setFiles] = useState<DetectedFile[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('overview');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [showUploaderModal, setShowUploaderModal] = useState<boolean>(false);

  // Theme state: Only persist visual theme, NEVER Instagram account data
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('followgram_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('followgram_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('followgram_theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleStartAnalysis = () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProcessingStep('Reading files & verifying schema structures...');

    setTimeout(() => {
      setProcessingStep('Normalizing handles & removing duplicates...');

      setTimeout(() => {
        setProcessingStep('Executing linear relationship comparisons...');

        try {
          const engineResult = runRelationshipEngine(files);
          const timelineResult = analyzeFollowingTimeline(engineResult.following);

          const hasFollowers = engineResult.followers.length > 0;
          const hasFollowing = engineResult.following.length > 0;

          const generatedInsights = generateObjectiveInsights({
            metrics: engineResult.metrics,
            ageMetrics: timelineResult.ageMetrics,
            timelineYear: timelineResult.timelineYear,
            hasFollowers,
            hasFollowing,
            recentlyUnfollowed: engineResult.recentlyUnfollowed,
            pendingRequests: engineResult.pendingRequests,
            incomingRequests: engineResult.incomingRequests,
            blockedProfiles: engineResult.blockedProfiles,
          });

          const completeAnalysis: AnalysisResult = {
            hasFollowers,
            hasFollowing,
            hasRelationshipComparison: hasFollowers && hasFollowing,
            followers: engineResult.followers,
            following: engineResult.following,
            mutuals: engineResult.mutuals,
            followingOnly: engineResult.followingOnly,
            followerOnly: engineResult.followerOnly,
            dontFollowMeBack: engineResult.followingOnly,
            iDontFollowBack: engineResult.followerOnly,
            recentlyUnfollowed: engineResult.recentlyUnfollowed,
            incomingRequests: engineResult.incomingRequests,
            pendingRequests: engineResult.pendingRequests,
            blockedProfiles: engineResult.blockedProfiles,
            removedSuggestions: engineResult.removedSuggestions,
            metrics: engineResult.metrics,
            validation: engineResult.validation,
            timelineYear: timelineResult.timelineYear,
            timelineMonth: timelineResult.timelineMonth,
            ageMetrics: timelineResult.ageMetrics,
            insights: generatedInsights,
            dataQuality: engineResult.dataQuality,
          };

          setAnalysis(completeAnalysis);
          setShowUploaderModal(false);
          setActivePage('overview');
        } catch (err) {
          console.error('Analysis error:', err);
        } finally {
          setIsProcessing(false);
        }
      }, 350);
    }, 300);
  };

  const handleClearData = () => {
    setFiles([]);
    setAnalysis(null);
    setShowUploaderModal(false);
    setActivePage('overview');
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 font-sans text-neutral-900 selection:bg-rose-500/20 selection:text-rose-900 dark:bg-neutral-950 dark:text-neutral-100 dark:selection:bg-rose-500/30 dark:selection:text-rose-200 transition-colors duration-200">
      {/* Privacy Notice Modal */}
      <PrivacyNotice
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Global Header */}
      <Header
        hasData={Boolean(analysis)}
        onClearData={handleClearData}
        onUploadMore={() => setShowUploaderModal(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Modal / Dialog when user wants to add/manage files while viewing dashboard */}
      {showUploaderModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Manage Instagram Export Files
              </h2>
              <button
                onClick={() => setShowUploaderModal(false)}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                Close
              </button>
            </div>
            <FileUploader
              files={files}
              onFilesChanged={setFiles}
              onStartAnalysis={handleStartAnalysis}
              isProcessing={isProcessing}
              processingStep={processingStep}
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      {!analysis ? (
        <main className="container mx-auto px-4 py-6">
          <FileUploader
            files={files}
            onFilesChanged={setFiles}
            onStartAnalysis={handleStartAnalysis}
            isProcessing={isProcessing}
            processingStep={processingStep}
          />
        </main>
      ) : (
        <div className="flex mx-auto max-w-7xl">
          {/* Left Sidebar */}
          <Sidebar
            activePage={activePage}
            onSelectPage={setActivePage}
            analysis={analysis}
          />

          {/* Center Main Content Area */}
          <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 lg:py-8">
            {activePage === 'overview' && (
              <OverviewPage
                analysis={analysis}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'people' && (
              <PeoplePage analysis={analysis} />
            )}

            {activePage === 'activity' && (
              <ActivityPage analysis={analysis} />
            )}

            {activePage === 'requests' && (
              <RequestsPage analysis={analysis} />
            )}

            {activePage === 'blocked' && (
              <BlockedPage analysis={analysis} />
            )}

            {activePage === 'insights' && (
              <InsightsPage analysis={analysis} />
            )}

            {activePage === 'settings' && (
              <SettingsPage
                analysis={analysis}
                onClearData={handleClearData}
                onResetApp={handleClearData}
                isDark={isDark}
                onToggleTheme={handleToggleTheme}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
