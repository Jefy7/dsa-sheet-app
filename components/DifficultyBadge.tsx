import type { CSSProperties } from 'react';
import type { Difficulty } from '@/types/topic';

const difficultyStyles: Record<Difficulty, CSSProperties> = {
  Easy: {
    color: '#22c55e',
    background: 'rgba(34, 197, 94, 0.06)',
    borderColor: 'rgba(34, 197, 94, 0.14)',
  },
  Medium: {
    color: '#eab308',
    background: 'rgba(234, 179, 8, 0.06)',
    borderColor: 'rgba(234, 179, 8, 0.14)',
  },
  Hard: {
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.06)',
    borderColor: 'rgba(239, 68, 68, 0.14)',
  },
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className="rounded-[2px] border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] whitespace-nowrap"
      style={difficultyStyles[difficulty]}
    >
      {difficulty}
    </span>
  );
}
