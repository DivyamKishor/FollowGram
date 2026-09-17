import { DetectedFile, InstagramAccount } from '../types/instagram';

export function createSampleDataset(): DetectedFile[] {
  // Generate realistic timestamps from 2018 to 2026
  const generateTimestamp = (year: number, month: number, day: number) => {
    return Math.floor(new Date(year, month - 1, day).getTime() / 1000);
  };

  // Mutual accounts (in both followers & following)
  const mutualHandles = [
    { u: 'alex_rivera_design', y: 2018, m: 4, d: 12 },
    { u: 'maya.creates', y: 2018, m: 9, d: 20 },
    { u: 'sam_kodak', y: 2019, m: 2, d: 14 },
    { u: 'charlotte_photo', y: 2019, m: 6, d: 3 },
    { u: 'daniel.devs', y: 2019, m: 11, d: 28 },
    { u: 'elena_soundscapes', y: 2020, m: 3, d: 15 },
    { u: 'felix_urban', y: 2020, m: 7, d: 8 },
    { u: 'grace.wanderlust', y: 2020, m: 10, d: 19 },
    { u: 'harrison.bakes', y: 2021, m: 1, d: 5 },
    { u: 'isabella_studio', y: 2021, m: 4, d: 22 },
    { u: 'julian_cinema', y: 2021, m: 8, d: 11 },
    { u: 'kevin_running_club', y: 2021, m: 12, d: 30 },
    { u: 'laura_architecture', y: 2022, m: 3, d: 17 },
    { u: 'marcus.coffee', y: 2022, m: 5, d: 9 },
    { u: 'nina_ceramics', y: 2022, m: 9, d: 24 },
    { u: 'oliver_notes', y: 2023, m: 1, d: 18 },
    { u: 'paula_artworks', y: 2023, m: 4, d: 2 },
    { u: 'quinn.minimal', y: 2023, m: 7, d: 14 },
    { u: 'ridhi.shenoy', y: 2023, m: 10, d: 5 },
    { u: 'sophia_typography', y: 2024, m: 2, d: 11 },
    { u: 'theo_cycling', y: 2024, m: 5, d: 29 },
    { u: 'uma.journal', y: 2024, m: 9, d: 16 },
    { u: 'victor.code', y: 2025, m: 1, d: 20 },
    { u: 'willow_crafts', y: 2025, m: 6, d: 4 },
    { u: 'zane_digital', y: 2026, m: 2, d: 1 },
  ];

  // Extend mutuals to reach ~160
  for (let i = 1; i <= 135; i++) {
    const yr = 2019 + (i % 8);
    const mo = 1 + (i % 12);
    const da = 1 + (i % 28);
    mutualHandles.push({
      u: `mutual_creator_${i}`,
      y: yr,
      m: mo,
      da: da,
    } as any);
  }

  // They don't follow me back (in following, but NOT in followers)
  const followingOnlyHandles = [
    { u: 'nationalgeographic', y: 2017, m: 5, d: 10 },
    { u: 'designmilk', y: 2018, m: 1, d: 15 },
    { u: 'archdigest', y: 2018, m: 8, d: 20 },
    { u: 'wired', y: 2019, m: 4, d: 12 },
    { u: 'nytimes', y: 2019, m: 9, d: 5 },
    { u: 'behance', y: 2020, m: 2, d: 18 },
    { u: 'dribbble', y: 2020, m: 6, d: 22 },
    { u: 'monoclemagazine', y: 2021, m: 3, d: 30 },
    { u: 'kinfolk', y: 2021, m: 7, d: 14 },
    { u: 'hypebeast', y: 2022, m: 1, d: 19 },
    { u: 'pitchfork', y: 2022, m: 5, d: 25 },
    { u: 'vogue', y: 2023, m: 2, d: 11 },
    { u: 'nasa', y: 2023, m: 8, d: 16 },
    { u: 'spotify', y: 2024, m: 4, d: 9 },
    { u: 'figma', y: 2024, m: 11, d: 3 },
  ];

  for (let i = 1; i <= 55; i++) {
    const yr = 2020 + (i % 6);
    const mo = 1 + (i % 12);
    const da = 1 + (i % 28);
    followingOnlyHandles.push({
      u: `brand_or_creator_${i}`,
      y: yr,
      m: mo,
      da: da,
    } as any);
  }

  // I don't follow back (in followers, but NOT in following)
  const followersOnlyHandles = [
    'random_fan_99',
    'traveler_tommy',
    'daily_fitness_quotes',
    'tokyo_eats_explorer',
    'crypto_insights_daily',
    'minimalist_living_co',
    'streetwear_drop_alerts',
    'analog_vibes_only',
    'coffee_roasters_collective',
    'local_band_touring',
  ];

  for (let i = 1; i <= 140; i++) {
    followersOnlyHandles.push(`community_follower_${i}`);
  }

  // Construct Followers List
  const followersAccounts: InstagramAccount[] = [
    ...mutualHandles.map((m) => ({
      username: m.u,
      normalizedUsername: m.u.toLowerCase(),
      profileUrl: `https://www.instagram.com/${m.u.toLowerCase()}/`,
      sourceDataset: 'followers' as const,
      sourceFilename: 'followers_1.json',
    })),
    ...followersOnlyHandles.map((handle) => ({
      username: handle,
      normalizedUsername: handle.toLowerCase(),
      profileUrl: `https://www.instagram.com/${handle.toLowerCase()}/`,
      sourceDataset: 'followers' as const,
      sourceFilename: 'followers_1.json',
    })),
  ];

  // Construct Following List
  const followingAccounts: InstagramAccount[] = [
    ...mutualHandles.map((m) => ({
      username: m.u,
      normalizedUsername: m.u.toLowerCase(),
      profileUrl: `https://www.instagram.com/${m.u.toLowerCase()}/`,
      timestamp: generateTimestamp(m.y, m.m, (m as any).d || (m as any).da || 15),
      sourceDataset: 'following' as const,
      sourceFilename: 'following.json',
    })),
    ...followingOnlyHandles.map((m) => ({
      username: m.u,
      normalizedUsername: m.u.toLowerCase(),
      profileUrl: `https://www.instagram.com/${m.u.toLowerCase()}/`,
      timestamp: generateTimestamp(m.y, m.m, (m as any).d || (m as any).da || 15),
      sourceDataset: 'following' as const,
      sourceFilename: 'following.json',
    })),
  ];

  // Recently Unfollowed
  const recentlyUnfollowed: InstagramAccount[] = [
    {
      username: 'fast_fashion_trends',
      normalizedUsername: 'fast_fashion_trends',
      profileUrl: 'https://www.instagram.com/fast_fashion_trends/',
      timestamp: generateTimestamp(2026, 8, 10),
      sourceDataset: 'recently_unfollowed',
      sourceFilename: 'recently_unfollowed_profiles.json',
    },
    {
      username: 'spammer_crypto_bot',
      normalizedUsername: 'spammer_crypto_bot',
      profileUrl: 'https://www.instagram.com/spammer_crypto_bot/',
      timestamp: generateTimestamp(2026, 8, 2),
      sourceDataset: 'recently_unfollowed',
      sourceFilename: 'recently_unfollowed_profiles.json',
    },
    {
      username: 'old_highschool_acquaintance',
      normalizedUsername: 'old_highschool_acquaintance',
      profileUrl: 'https://www.instagram.com/old_highschool_acquaintance/',
      timestamp: generateTimestamp(2026, 7, 19),
      sourceDataset: 'recently_unfollowed',
      sourceFilename: 'recently_unfollowed_profiles.json',
    },
    {
      username: 'daily_memes_repost',
      normalizedUsername: 'daily_memes_repost',
      profileUrl: 'https://www.instagram.com/daily_memes_repost/',
      timestamp: generateTimestamp(2026, 6, 24),
      sourceDataset: 'recently_unfollowed',
      sourceFilename: 'recently_unfollowed_profiles.json',
    },
  ];

  // Pending / Outgoing Requests
  const pendingRequests: InstagramAccount[] = [
    {
      username: 'private_architect_portfolio',
      normalizedUsername: 'private_architect_portfolio',
      profileUrl: 'https://www.instagram.com/private_architect_portfolio/',
      timestamp: generateTimestamp(2026, 8, 28),
      sourceDataset: 'pending_requests',
      sourceFilename: 'pending_follow_requests.json',
    },
    {
      username: 'clara_private_diary',
      normalizedUsername: 'clara_private_diary',
      profileUrl: 'https://www.instagram.com/clara_private_diary/',
      timestamp: generateTimestamp(2026, 9, 1),
      sourceDataset: 'pending_requests',
      sourceFilename: 'pending_follow_requests.json',
    },
    {
      username: 'indie_film_collective_private',
      normalizedUsername: 'indie_film_collective_private',
      profileUrl: 'https://www.instagram.com/indie_film_collective_private/',
      timestamp: generateTimestamp(2026, 9, 5),
      sourceDataset: 'pending_requests',
      sourceFilename: 'pending_follow_requests.json',
    },
  ];

  // Incoming Requests
  const incomingRequests: InstagramAccount[] = [
    {
      username: 'sarah_montana_nature',
      normalizedUsername: 'sarah_montana_nature',
      profileUrl: 'https://www.instagram.com/sarah_montana_nature/',
      timestamp: generateTimestamp(2026, 9, 12),
      sourceDataset: 'incoming_requests',
      sourceFilename: "follow_requests_you've_received.json",
    },
    {
      username: 'design_student_alex',
      normalizedUsername: 'design_student_alex',
      profileUrl: 'https://www.instagram.com/design_student_alex/',
      timestamp: generateTimestamp(2026, 9, 14),
      sourceDataset: 'incoming_requests',
      sourceFilename: "follow_requests_you've_received.json",
    },
  ];

  // Blocked Profiles
  const blockedProfiles: InstagramAccount[] = [
    {
      username: 'unwanted_marketing_bot',
      normalizedUsername: 'unwanted_marketing_bot',
      profileUrl: 'https://www.instagram.com/unwanted_marketing_bot/',
      timestamp: generateTimestamp(2025, 4, 18),
      sourceDataset: 'blocked_profiles',
      sourceFilename: 'blocked_profiles.json',
    },
    {
      username: 'harassment_account_109',
      normalizedUsername: 'harassment_account_109',
      profileUrl: 'https://www.instagram.com/harassment_account_109/',
      timestamp: generateTimestamp(2024, 11, 2),
      sourceDataset: 'blocked_profiles',
      sourceFilename: 'blocked_profiles.json',
    },
  ];

  // Removed Suggestions
  const removedSuggestions: InstagramAccount[] = [
    {
      username: 'suggested_celebrity_news',
      normalizedUsername: 'suggested_celebrity_news',
      profileUrl: 'https://www.instagram.com/suggested_celebrity_news/',
      sourceDataset: 'removed_suggestions',
      sourceFilename: 'removed_suggestions.json',
    },
    {
      username: 'suggested_dropshipping_guru',
      normalizedUsername: 'suggested_dropshipping_guru',
      profileUrl: 'https://www.instagram.com/suggested_dropshipping_guru/',
      sourceDataset: 'removed_suggestions',
      sourceFilename: 'removed_suggestions.json',
    },
  ];

  return [
    {
      id: 'demo-followers',
      file: new File([''], 'followers_1.json', { type: 'application/json' }),
      name: 'followers_1.json',
      size: 48200,
      detectedType: 'followers',
      recordCount: followersAccounts.length,
      rawAccounts: followersAccounts,
    },
    {
      id: 'demo-following',
      file: new File([''], 'following.json', { type: 'application/json' }),
      name: 'following.json',
      size: 52400,
      detectedType: 'following',
      recordCount: followingAccounts.length,
      rawAccounts: followingAccounts,
    },
    {
      id: 'demo-unfollowed',
      file: new File([''], 'recently_unfollowed_profiles.json', { type: 'application/json' }),
      name: 'recently_unfollowed_profiles.json',
      size: 1400,
      detectedType: 'recently_unfollowed',
      recordCount: recentlyUnfollowed.length,
      rawAccounts: recentlyUnfollowed,
    },
    {
      id: 'demo-pending',
      file: new File([''], 'pending_follow_requests.json', { type: 'application/json' }),
      name: 'pending_follow_requests.json',
      size: 1200,
      detectedType: 'pending_requests',
      recordCount: pendingRequests.length,
      rawAccounts: pendingRequests,
    },
    {
      id: 'demo-incoming',
      file: new File([''], "follow_requests_you've_received.json", { type: 'application/json' }),
      name: "follow_requests_you've_received.json",
      size: 980,
      detectedType: 'incoming_requests',
      recordCount: incomingRequests.length,
      rawAccounts: incomingRequests,
    },
    {
      id: 'demo-blocked',
      file: new File([''], 'blocked_profiles.json', { type: 'application/json' }),
      name: 'blocked_profiles.json',
      size: 850,
      detectedType: 'blocked_profiles',
      recordCount: blockedProfiles.length,
      rawAccounts: blockedProfiles,
    },
    {
      id: 'demo-suggestions',
      file: new File([''], 'removed_suggestions.json', { type: 'application/json' }),
      name: 'removed_suggestions.json',
      size: 650,
      detectedType: 'removed_suggestions',
      recordCount: removedSuggestions.length,
      rawAccounts: removedSuggestions,
    },
  ];
}
