'use client';

import { useCallback, type KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import DifficultyBadge from './DifficultyBadge';
import ProblemLinks from './ProblemLinks';
import type { Problem } from '@/types/topic';
import { fetchProgress, updateProgress } from '@/features/progress/progressSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

interface ProblemItemProps {
  problem: Problem;
}

export default function ProblemItem({ problem }: ProblemItemProps) {
  const dispatch = useAppDispatch();
  const completed = useAppSelector((state) => Boolean(state.progress.byProblemId[problem.id]));
  const isUpdating = useAppSelector((state) => Boolean(state.progress.pendingUpdates[problem.id]));

  const onToggle = useCallback(async () => {
    const nextCompleted = !completed;
    const action = await dispatch(
      updateProgress({ problemId: problem.id, completed: nextCompleted, previousCompleted: completed }),
    );

    if (updateProgress.fulfilled.match(action)) {
      toast.success(nextCompleted ? 'Problem marked completed' : 'Problem marked incomplete');
      return;
    }

    toast.error(action.payload ?? 'Failed to update progress. Syncing latest state...');
    void dispatch(fetchProgress());
  }, [completed, dispatch, problem.id]);

  const handleCheckboxKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isUpdating) void onToggle();
    }
  };

  return (
    <div className="grid grid-cols-[24px_1fr_auto_auto] items-center gap-3 border-t border-[#1e1e2e] px-1 py-2.5 hover:bg-[rgba(124,109,250,0.03)]">
      <button
        type="button"
        onClick={() => void onToggle()}
        disabled={isUpdating}
        aria-label={completed ? `Mark ${problem.title} as incomplete` : `Mark ${problem.title} as completed`}
        aria-checked={completed}
        role="checkbox"
        onKeyDown={handleCheckboxKey}
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border text-[10px] transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          completed
            ? 'border-[#7c6dfa] bg-[#7c6dfa] text-white'
            : 'border-[#3d3680] bg-transparent text-transparent hover:border-[#7c6dfa]'
        }`}
      >
        ✓
      </button>

      <span
        className={`text-[13px] tracking-[0.02em] ${
          completed ? 'text-[#6b6880] line-through' : 'text-[#e8e6ff]'
        }`}
      >
        {problem.title}
      </span>

      <ProblemLinks links={problem.links} />
      <DifficultyBadge difficulty={problem.difficulty} />
    </div>
  );
}
