import type { Difficulty } from '@/types/topic';

interface DashboardToolbarProps {
  search: string;
  difficulty: Difficulty | 'All';
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: Difficulty | 'All') => void;
}

const filters: Array<Difficulty | 'All'> = ['All', 'Easy', 'Medium', 'Hard'];

export default function DashboardToolbar({
  search,
  difficulty,
  onSearchChange,
  onDifficultyChange,
}: DashboardToolbarProps) {
  return (
    <div className="border-b border-[#1e1e2e] px-4 py-4 md:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[180px] flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#6b6880]">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search problems..."
            className="w-full rounded-[2px] border border-[#1e1e2e] bg-[#111118] py-2 pl-8 pr-3 text-xs text-[#e8e6ff] outline-none placeholder:text-[#6b6880] focus:border-[#3d3680]"
          />
        </div>

        <div className="flex gap-1">
          {filters.map((filter) => {
            const isActive = difficulty === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onDifficultyChange(filter)}
                className={`rounded-[2px] border px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] transition-colors ${
                  isActive
                    ? 'border-[#7c6dfa] bg-[#7c6dfa] text-white'
                    : 'border-[#1e1e2e] text-[#6b6880] hover:border-[#3d3680] hover:text-[#e8e6ff]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
