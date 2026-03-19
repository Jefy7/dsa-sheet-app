import type { CSSProperties } from 'react';
import type { Difficulty } from '@/types/topic';

const difficultyStyles: Record<Difficulty, CSSProperties> = {
  Easy: {
    color: '#4ade80',
    background: 'rgba(74, 222, 128, 0.1)',
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  Medium: {
    color: '#fbbf24',
    background: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.2)',
  },
  Hard: {
    color: '#f87171',
    background: 'rgba(248, 113, 113, 0.1)',
    borderColor: 'rgba(248, 113, 113, 0.2)',
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
