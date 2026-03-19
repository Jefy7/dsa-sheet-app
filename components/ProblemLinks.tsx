import type { CSSProperties } from 'react';
import { isValidUrl } from '@/utils/link';
import type { ProblemLinks as ProblemLinksType } from '@/types/topic';

const linkOrder: Array<{ key: keyof ProblemLinksType; label: string; style: CSSProperties }> = [
  {
    key: 'youtube',
    label: '▶ YT',
    style: {
      color: '#ef4444',
      background: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.2)',
    },
  },
  {
    key: 'leetcode',
    label: '⌥ LC',
    style: {
      color: '#fbbf24',
      background: 'rgba(251, 191, 36, 0.08)',
      borderColor: 'rgba(251, 191, 36, 0.2)',
    },
  },
  {
    key: 'codeforces',
    label: '{ } CF',
    style: {
      color: '#60a5fa',
      background: 'rgba(96, 165, 250, 0.08)',
      borderColor: 'rgba(96, 165, 250, 0.2)',
    },
  },
  {
    key: 'article',
    label: '≡ Read',
    style: {
      color: '#a78bfa',
      background: 'rgba(167, 139, 250, 0.08)',
      borderColor: 'rgba(167, 139, 250, 0.2)',
    },
  },
];

export default function ProblemLinks({ links }: { links?: ProblemLinksType }) {
  if (!links) return null;

  const entries = linkOrder.filter(({ key }) => isValidUrl(links[key]));

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(({ key, label, style }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noreferrer"
          className="rounded-[2px] border px-2 py-0.5 text-[10px] tracking-[0.08em] no-underline transition-opacity hover:opacity-80"
          style={style}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
