import type { Difficulty } from '@/types/topic';

const difficultyStyles: Record<Difficulty, string> = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-semibold ${difficultyStyles[difficulty]}`}>{difficulty}</span>;
}
