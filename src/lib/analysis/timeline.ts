import {
  InstagramAccount,
  TimelineDataPoint,
  RelationshipAgeMetrics,
} from '../../types/instagram';

export interface TimelineAnalysisResult {
  timelineYear: TimelineDataPoint[];
  timelineMonth: TimelineDataPoint[];
  ageMetrics: RelationshipAgeMetrics;
}

export function analyzeFollowingTimeline(accounts: InstagramAccount[]): TimelineAnalysisResult {
  const accountsWithTimestamps = accounts
    .filter((a): a is InstagramAccount & { timestamp: number } => typeof a.timestamp === 'number' && a.timestamp > 0)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (accountsWithTimestamps.length === 0) {
    return {
      timelineYear: [],
      timelineMonth: [],
      ageMetrics: {
        hasTimestampData: false,
        totalWithTimestamps: 0,
      },
    };
  }

  const oldestFollow = accountsWithTimestamps[0];
  const newestFollow = accountsWithTimestamps[accountsWithTimestamps.length - 1];

  const nowSeconds = Math.floor(Date.now() / 1000);
  const agesInDays = accountsWithTimestamps.map((a) => Math.max(0, Math.floor((nowSeconds - a.timestamp) / 86400)));

  const totalAge = agesInDays.reduce((sum, age) => sum + age, 0);
  const averageAgeDays = Math.round(totalAge / agesInDays.length);

  // Median age
  const sortedAges = [...agesInDays].sort((a, b) => a - b);
  const mid = Math.floor(sortedAges.length / 2);
  const medianAgeDays =
    sortedAges.length % 2 !== 0
      ? sortedAges[mid]
      : Math.round((sortedAges[mid - 1] + sortedAges[mid]) / 2);

  // Aggregation by Year
  const yearCounts = new Map<string, number>();
  // Aggregation by Year-Month
  const monthCounts = new Map<string, number>();

  for (const acc of accountsWithTimestamps) {
    const d = new Date(acc.timestamp * 1000);
    const yearStr = String(d.getFullYear());
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    yearCounts.set(yearStr, (yearCounts.get(yearStr) || 0) + 1);
    monthCounts.set(monthStr, (monthCounts.get(monthStr) || 0) + 1);
  }

  const totalWithTimestamps = accountsWithTimestamps.length;

  // Build sorted year array
  const sortedYears = Array.from(yearCounts.keys()).sort();
  const timelineYear: TimelineDataPoint[] = sortedYears.map((year) => {
    const count = yearCounts.get(year) || 0;
    return {
      label: year,
      periodKey: year,
      count,
      percentage: totalWithTimestamps > 0 ? (count / totalWithTimestamps) * 100 : 0,
    };
  });

  // Build sorted month array (last 24-36 months or all if fewer)
  const sortedMonths = Array.from(monthCounts.keys()).sort();
  const timelineMonth: TimelineDataPoint[] = sortedMonths.map((periodKey) => {
    const count = monthCounts.get(periodKey) || 0;
    const [y, m] = periodKey.split('-');
    const dateObj = new Date(Number(y), Number(m) - 1, 1);
    const label = dateObj.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
    return {
      label,
      periodKey,
      count,
      percentage: totalWithTimestamps > 0 ? (count / totalWithTimestamps) * 100 : 0,
    };
  });

  return {
    timelineYear,
    timelineMonth,
    ageMetrics: {
      oldestFollow,
      newestFollow,
      averageAgeDays,
      medianAgeDays,
      hasTimestampData: true,
      totalWithTimestamps,
    },
  };
}
