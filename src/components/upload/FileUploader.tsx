import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Trash2,
  RefreshCw,
  FolderArchive,
  Info,
  Layers,
} from 'lucide-react';
import { DetectedFile, DatasetType } from '../../types/instagram';
import { processUploadedFile, reparseFileAsType } from '../../lib/parsers/fileDetector';
import { createSampleDataset } from '../../data/sampleDataset';

interface FileUploaderProps {
  files: DetectedFile[];
  onFilesChanged: (files: DetectedFile[]) => void;
  onStartAnalysis: () => void;
  isProcessing: boolean;
  processingStep: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  onFilesChanged,
  onStartAnalysis,
  isProcessing,
  processingStep,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showHowToModal, setShowHowToModal] = useState(false);
  const [showFileGuide, setShowFileGuide] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);

    const newFiles: DetectedFile[] = [...files];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      try {
        const processed = await processUploadedFile(f);
        // Replace if same filename already present, else append
        const existingIndex = newFiles.findIndex((ex) => ex.name === processed.name);
        if (existingIndex >= 0) {
          newFiles[existingIndex] = processed;
        } else {
          newFiles.push(processed);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error reading file';
        setErrorMessage(`Failed reading "${f.name}": ${msg}`);
      }
    }

    onFilesChanged(newFiles);
  };

  const handleTypeChange = async (fileId: string, newType: DatasetType) => {
    const target = files.find((f) => f.id === fileId);
    if (!target) return;
    try {
      const updated = await reparseFileAsType(target, newType);
      onFilesChanged(files.map((f) => (f.id === fileId ? updated : f)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reclassify file';
      setErrorMessage(msg);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    onFilesChanged(files.filter((f) => f.id !== id));
  };

  const handleLoadDemo = () => {
    const demoFiles = createSampleDataset();
    onFilesChanged(demoFiles);
  };

  const followersFiles = files.filter(
    (f) => f.detectedType === 'followers' && f.recordCount > 0
  );
  const followingFiles = files.filter(
    (f) => f.detectedType === 'following' && f.recordCount > 0
  );

  const hasFollowers = followersFiles.length > 0;
  const hasFollowing = followingFiles.length > 0;

  const totalFollowersCount = followersFiles.reduce((sum, f) => sum + f.recordCount, 0);
  const totalFollowingCount = followingFiles.reduce((sum, f) => sum + f.recordCount, 0);

  const isFollowerCountSuspiciouslyLow =
    hasFollowing &&
    hasFollowers &&
    totalFollowingCount >= 50 &&
    totalFollowersCount <= 15 &&
    followersFiles.length === 1;

  const canAnalyze = files.length > 0 && files.some((f) => f.recordCount > 0);

  const datasetTypeOptions: { value: DatasetType; label: string }[] = [
    { value: 'followers', label: 'Followers (Who follow you)' },
    { value: 'following', label: 'Following (Who you follow)' },
    { value: 'recently_unfollowed', label: 'Recently Unfollowed' },
    { value: 'pending_requests', label: 'Pending Requests (Sent)' },
    { value: 'incoming_requests', label: 'Incoming Requests' },
    { value: 'blocked_profiles', label: 'Blocked Accounts' },
    { value: 'removed_suggestions', label: 'Dismissed Suggestions' },
    { value: 'unknown', label: 'Other / Unknown' },
  ];

  const getDatasetLabel = (type: DatasetType): string => {
    switch (type) {
      case 'followers':
        return 'Followers';
      case 'following':
        return 'Following';
      case 'recently_unfollowed':
        return 'Recently Unfollowed';
      case 'incoming_requests':
        return 'Incoming Follow Requests';
      case 'pending_requests':
        return 'Pending Follow Requests';
      case 'blocked_profiles':
        return 'Blocked Profiles';
      case 'removed_suggestions':
        return 'Removed Suggestions';
      default:
        return 'Other file';
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8 px-4 sm:px-6">
      {/* Brand Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/80 px-3.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>FollowGram</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          See your Instagram relationships clearly.
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
          Private analytics from your Instagram data export. Find out who doesn’t follow you back, track your follow history, and explore mutuals.
        </p>

        {/* Prominent Privacy Statement */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-2 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold">Your data stays on your device.</span>
          <span className="hidden sm:inline text-emerald-700 dark:text-emerald-400">
            FollowGram processes your Instagram export locally in your browser. Your files are not uploaded to a server.
          </span>
        </div>
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Processing Progress State */}
      {isProcessing ? (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-10 text-center shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400 animate-spin">
            <RefreshCw className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
            Processing Instagram Data
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {processingStep || 'Normalizing accounts & comparing sets...'}
          </p>

          <div className="mt-6 mx-auto max-w-xs space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div className="h-full bg-rose-500 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-[11px] text-neutral-400">
              Running entirely in memory (zero network transfer)
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Upload Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
              isDragging
                ? 'border-rose-500 bg-rose-50/50 dark:border-rose-400 dark:bg-rose-950/20'
                : 'border-neutral-200 bg-white/80 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".json,.csv"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              <UploadCloud className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
              Upload Instagram Export
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
              Drag and drop your JSON or CSV files here, or choose them from your computer. Select multiple files at once.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                <FolderArchive className="h-4 w-4" />
                <span>Choose Files</span>
              </button>

              <button
                onClick={handleLoadDemo}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-2xs transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Load Sample Dataset (350+ Accounts)</span>
              </button>
            </div>

            <p className="mt-4 text-[11px] text-neutral-400 dark:text-neutral-500">
              Supports followers_1.json, following.json, recently_unfollowed, requests, blocked & CSV files.
            </p>
          </div>

          {/* Detected Files Staging Area */}
          {files.length > 0 && (
            <div className="space-y-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Loaded Export Files ({files.length})
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                    <span className={`inline-flex items-center gap-1 font-medium ${hasFollowers ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {hasFollowers ? `✓ Followers: ${totalFollowersCount.toLocaleString()} across ${followersFiles.length} file(s)` : '⚠️ Followers missing'}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className={`inline-flex items-center gap-1 font-medium ${hasFollowing ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {hasFollowing ? `✓ Following: ${totalFollowingCount.toLocaleString()} across ${followingFiles.length} file(s)` : '⚠️ Following missing'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition"
                  >
                    <FolderArchive className="h-3.5 w-3.5" />
                    <span>Add More Files</span>
                  </button>
                  <button
                    onClick={() => onFilesChanged([])}
                    className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-red-600 transition px-2 py-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear all</span>
                  </button>
                </div>
              </div>

              {/* Multi-file followers notice if multiple followers files loaded */}
              {followersFiles.length > 1 && (
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Layers className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <span className="font-semibold">Multiple Followers Files Combined:</span>{' '}
                    Combined {followersFiles.length} follower files ({totalFollowersCount.toLocaleString()} total records). Duplicate entries are automatically normalized and deduplicated.
                  </div>
                </div>
              )}

              {/* Diagnostic warning if follower count is suspiciously small compared to following */}
              {isFollowerCountSuspiciouslyLow && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                  <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">Did Instagram provide multiple followers files?</div>
                    <div className="leading-relaxed">
                      You have <strong>{totalFollowersCount} followers</strong> loaded from 1 file, but <strong>{totalFollowingCount} accounts you follow</strong>.
                      Instagram exports frequently split followers into several files (e.g.{' '}
                      <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">followers_1.json</code>,{' '}
                      <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">followers_2.json</code>, etc.).
                      If other follower files exist in your download, select and upload all of them so accounts who follow you aren&apos;t mistakenly marked as &ldquo;They Don&apos;t Follow Me Back&rdquo;.
                    </div>
                  </div>
                </div>
              )}

              {/* Detected list */}
              <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-100 dark:divide-neutral-800 dark:border-neutral-800">
                {files.map((file) => {
                  const isRecognized = file.detectedType !== 'unknown';
                  const hasZeroRecords = file.recordCount === 0;

                  return (
                    <div
                      key={file.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isRecognized && !hasZeroRecords ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-neutral-900 dark:text-white truncate">
                            {file.name}
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {file.recordCount.toLocaleString()} account{file.recordCount === 1 ? '' : 's'} parsed • {(file.size / 1024).toFixed(1)} KB
                            {file.error && (
                              <span className="text-red-500 ml-1">({file.error})</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Type Selector Dropdown */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-neutral-400 hidden md:inline">Dataset:</span>
                          <select
                            value={file.detectedType}
                            onChange={(e) => handleTypeChange(file.id, e.target.value as DatasetType)}
                            className="text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 font-medium focus:ring-1 focus:ring-rose-500 outline-hidden"
                            title="Manually choose or correct the dataset type for this file"
                          >
                            {datasetTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          title="Remove file"
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-500 dark:hover:bg-neutral-800 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Analyze Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-neutral-500">
                  Total raw records across all files:{' '}
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {files.reduce((sum, f) => sum + f.recordCount, 0).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={onStartAnalysis}
                  disabled={!canAnalyze}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Launch Dashboard Analysis</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Guide: Which files to upload */}
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 dark:border-neutral-800/80 dark:bg-neutral-900/40">
            <button
              onClick={() => setShowFileGuide(!showFileGuide)}
              className="flex w-full items-center justify-between text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-neutral-400" />
                <span>Which Instagram export files should I upload?</span>
              </div>
              <span className="text-neutral-400">
                {showFileGuide ? 'Hide guide' : 'View file guide'}
              </span>
            </button>

            {showFileGuide && (
              <div className="mt-4 space-y-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-400">
                <p className="leading-relaxed">
                  Inside your downloaded Instagram ZIP, navigate to the{' '}
                  <code className="bg-neutral-200/60 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono">
                    connections/followers_and_following/
                  </code>{' '}
                  folder:
                </p>
                <ul className="space-y-2 leading-relaxed list-disc list-inside">
                  <li>
                    <strong className="text-neutral-800 dark:text-neutral-200">following.json:</strong> Contains the list of accounts <em>you follow</em>.
                  </li>
                  <li>
                    <strong className="text-neutral-800 dark:text-neutral-200">followers_1.json, followers_2.json, etc.:</strong> Contains the accounts that <em>follow you</em>. If Instagram created multiple numbered follower files, upload <strong>all of them</strong> so FollowGram combines them seamlessly.
                  </li>
                  <li>
                    <strong className="text-neutral-800 dark:text-neutral-200">recently_followed_profiles.json:</strong> This file only tracks profiles you recently followed in the past year, not your followers! Do not use this as a replacement for your followers list.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Quick Guide: How to get Instagram Data Export */}
          <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 dark:border-neutral-800/80 dark:bg-neutral-900/40">
            <button
              onClick={() => setShowHowToModal(!showHowToModal)}
              className="flex w-full items-center justify-between text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-neutral-400" />
                <span>How do I request a new Instagram export from Meta?</span>
              </div>
              <span className="text-neutral-400">
                {showHowToModal ? 'Hide guide' : 'View instructions'}
              </span>
            </button>

            {showHowToModal && (
              <div className="mt-4 space-y-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-xs text-neutral-600 dark:text-neutral-400">
                <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                  <li>
                    Open Instagram and go to <strong>Settings and activity</strong> &gt;{' '}
                    <strong>Accounts Center</strong> &gt;{' '}
                    <strong>Your information and permissions</strong>.
                  </li>
                  <li>
                    Select <strong>Download your information</strong> &gt;{' '}
                    <strong>Download or transfer information</strong>.
                  </li>
                  <li>
                    Choose <strong>Some of your information</strong> &gt; scroll down and check{' '}
                    <strong>Followers and following</strong>.
                  </li>
                  <li>
                    Choose destination <strong>Download to device</strong>, Format: <strong>JSON</strong>, and Date range: <strong>All time</strong>.
                  </li>
                  <li>
                    Once Instagram emails you the file link, download and unzip it. Drag the JSON files into FollowGram!
                  </li>
                </ol>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
