'use client';

import { useCallback } from 'react';
import DifficultyBadge from './DifficultyBadge';
import ProblemLinks from './ProblemLinks';
import type { Problem } from '@/types/topic';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProgress, updateProgress } from '@/features/progress/progressSlice';
import toast from 'react-hot-toast';

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

  return (
    <div className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 flex-1 break-words text-sm font-medium leading-6">{problem.title}</p>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <ProblemLinks links={problem.links} />

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          disabled={isUpdating}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 disabled:cursor-not-allowed"
        />
        <span>{isUpdating ? 'Updating...' : 'Completed'}</span>
      </label>
    </div>
  );
}
