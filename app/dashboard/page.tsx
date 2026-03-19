'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardToolbar from '@/components/DashboardToolbar';
import ErrorState from '@/components/ErrorState';
import Loader from '@/components/Loader';
import TopicAccordion from '@/components/TopicAccordion';
import { logout } from '@/features/auth/authSlice';
import { fetchProgress } from '@/features/progress/progressSlice';
import { selectFilteredTopics } from '@/features/topics/selectors';
import { fetchTopics } from '@/features/topics/topicSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Difficulty } from '@/types/topic';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const topicsState = useAppSelector((state) => state.topics);
  const progressState = useAppSelector((state) => state.progress);

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');

  const filteredTopics = useAppSelector((state) => selectFilteredTopics(state, search, difficulty));

  const isInitialLoading = topicsState.loading || progressState.loading;
  useEffect(() => {
    void dispatch(fetchTopics());
    void dispatch(fetchProgress());
  }, [dispatch]);

  useEffect(() => {
    if (topicsState.error) toast.error(topicsState.error);
  }, [topicsState.error]);

  useEffect(() => {
    if (progressState.error) toast.error(progressState.error);
  }, [progressState.error]);

  const overallProgress = useMemo(() => {
    const totals = filteredTopics.reduce(
      (acc, topic) => {
        acc.completed += topic.completedCount;
        acc.total += topic.totalCount;
        return acc;
      },
      { completed: 0, total: 0 },
    );

    if (totals.total === 0) return 0;
    return Math.round((totals.completed / totals.total) * 100);
  }, [filteredTopics]);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <ProtectedRoute>
      <main className="mx-auto min-h-screen w-full max-w-6xl p-4 md:p-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">DSA Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Welcome, {authUser?.name ?? authUser?.email ?? 'Learner'}.</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Logout
          </button>
        </header>

        <section className="mb-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-2 text-sm text-slate-500">Overall progress</p>
          <div className="h-3 overflow-hidden rounded bg-slate-200 dark:bg-slate-800">
            <div className="h-full bg-indigo-600 transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
          <p className="mt-2 text-sm font-medium">{overallProgress}% completed</p>
        </section>

        <DashboardToolbar
          search={search}
          difficulty={difficulty}
          onSearchChange={setSearch}
          onDifficultyChange={setDifficulty}
        />

        {isInitialLoading ? <Loader label="Loading topics and progress..." /> : null}

        {topicsState.error ? <ErrorState message={topicsState.error} onRetry={() => void dispatch(fetchTopics())} /> : null}

        {progressState.error ? (
          <div className="mb-3">
            <ErrorState message={progressState.error} onRetry={() => void dispatch(fetchProgress())} />
          </div>
        ) : null}

        {!isInitialLoading && !topicsState.error && !progressState.error ? <TopicAccordion topics={filteredTopics} /> : null}
      </main>
    </ProtectedRoute>
  );
}
