import { InstagramAccount } from '../../types/instagram';
import { formatTimestampDate } from './timestamps';

export function exportAccountsToCsv(
  accounts: InstagramAccount[],
  defaultFilename: string = 'instagram_accounts.csv'
): void {
  if (!accounts || accounts.length === 0) {
    return;
  }

  const headers = ['Username', 'Normalized Handle', 'Profile URL', 'Relationship Date', 'Source Dataset'];
  
  const rows = accounts.map((acc) => [
    acc.username,
    acc.normalizedUsername,
    acc.profileUrl || `https://www.instagram.com/${acc.normalizedUsername}/`,
    acc.timestamp ? formatTimestampDate(acc.timestamp) : '',
    acc.sourceDataset || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', defaultFilename.endsWith('.csv') ? defaultFilename : `${defaultFilename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
