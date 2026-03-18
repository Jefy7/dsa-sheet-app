import type { Difficulty } from '@/types/topic';

interface DashboardToolbarProps {
  search: string;
  difficulty: Difficulty | 'All';
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: Difficulty | 'All') => void;
}

export default function DashboardToolbar({
  search,
  difficulty,
  onSearchChange,
  onDifficultyChange,
}: DashboardToolbarProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search problems..."
        className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      />

      <select
        value={difficulty}
        onChange={(event) => onDifficultyChange(event.target.value as Difficulty | 'All')}
        className="rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
      >
        <option value="All">All difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  );
}
