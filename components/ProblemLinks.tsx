import { isValidUrl } from '@/utils/link';
import type { ProblemLinks as ProblemLinksType } from '@/types/topic';

const linkOrder: Array<{ key: keyof ProblemLinksType; label: string }> = [
  { key: 'youtube', label: 'YouTube' },
  { key: 'leetcode', label: 'LeetCode' },
  { key: 'codeforces', label: 'Codeforces' },
  { key: 'article', label: 'Article' },
];

export default function ProblemLinks({ links }: { links?: ProblemLinksType }) {
  if (!links) return <span className="text-xs text-slate-500">No links</span>;

  const entries = linkOrder.filter(({ key }) => isValidUrl(links[key]));

  if (entries.length === 0) {
    return <span className="text-xs text-slate-500">No valid links</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(({ key, label }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          {label}
        </a>
      ))}
    </div>
  );
}
