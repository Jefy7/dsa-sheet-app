import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Difficulty } from '@/types/topic';

export const selectTopics = (state: RootState) => state.topics.items;
export const selectProgressMap = (state: RootState) => state.progress.byProblemId;

export const selectMergedTopics = createSelector([selectTopics, selectProgressMap], (topics, progressMap) =>
  topics.map((topic) => {
    const completedCount = topic.problems.filter((problem) => progressMap[problem.id]).length;
    return {
      ...topic,
      completedCount,
      totalCount: topic.problems.length,
      completionPct: topic.problems.length === 0 ? 0 : Math.round((completedCount / topic.problems.length) * 100),
    };
  }),
);

export const selectFilteredTopics = createSelector(
  [selectMergedTopics, (_: RootState, query: string) => query, (_: RootState, __: string, difficulty: Difficulty | 'All') => difficulty],
  (topics, query, difficulty) => {
    const normalized = query.trim().toLowerCase();

    return topics
      .map((topic) => ({
        ...topic,
        problems: topic.problems.filter((problem) => {
          const matchesQuery = normalized.length === 0 || problem.title.toLowerCase().includes(normalized);
          const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
          return matchesQuery && matchesDifficulty;
        }),
      }))
      .filter((topic) => topic.problems.length > 0 || (normalized.length === 0 && difficulty === 'All'));
  },
);
