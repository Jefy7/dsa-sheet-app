'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const authUser = authState.user;
  const topicsState = useAppSelector((state) => state.topics);
  const progressState = useAppSelector((state) => state.progress);

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'All'>('All');

  const filteredTopics = useAppSelector((state) => selectFilteredTopics(state, search, difficulty));

  const isInitialLoading = topicsState.loading || progressState.loading;

  useEffect(() => {
    if (!authState.initialized || !authState.isAuthenticated) return;

    void dispatch(fetchTopics());
    void dispatch(fetchProgress());
  }, [authState.initialized, authState.isAuthenticated, dispatch]);

  useEffect(() => {
    if (topicsState.error) toast.error(topicsState.error);
  }, [topicsState.error]);

  useEffect(() => {
    if (progressState.error) toast.error(progressState.error);
  }, [progressState.error]);

  const progressStats = useMemo(() => {
    const totals = filteredTopics.reduce(
      (acc, topic) => {
        acc.completed += topic.completedCount;
        acc.total += topic.totalCount;
        return acc;
      },
      { completed: 0, total: 0 },
    );

    const pct = totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100);
    return { ...totals, pct };
  }, [filteredTopics]);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const action = await dispatch(logout());

    if (logout.fulfilled.match(action)) {
      toast.success('Logged out successfully.');
      router.replace('/login');
    } else {
      toast.error(action.payload ?? 'Logout failed.');
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

        body {
          background: #0a0a0f;
          color: #e8e6ff;
          font-family: 'DM Mono', 'Courier New', monospace;
        }
      `}</style>

      <main className="relative min-h-screen bg-[#0a0a0f] pb-16">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(124,109,250,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,109,250,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-4 border-b border-[#1e1e2e] bg-[rgba(10,10,15,0.9)] px-4 py-4 backdrop-blur md:px-8">
          <div>
            <h1 className="font-serif text-2xl font-normal tracking-[-0.02em]">
              DSA <em className="text-[#7c6dfa]">Sheet</em>
            </h1>
            <p className="text-[11px] text-[#6b6880]">{authUser?.name ?? authUser?.email ?? 'Learner'}</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-[11px] text-[#6b6880]">
              <strong className="text-[#7c6dfa]">{progressStats.completed}</strong> / {progressStats.total} solved
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-[2px] border border-[#1e1e2e] px-3 py-1.5 text-[10px] uppercase tracking-[0.08em] text-[#6b6880] transition-colors hover:border-[#3d3680] hover:text-[#e8e6ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </header>

        <DashboardToolbar
          search={search}
          difficulty={difficulty}
          onSearchChange={setSearch}
          onDifficultyChange={setDifficulty}
        />

        <section className="relative z-[1] pb-8">
          {isInitialLoading ? <Loader label="Loading topics and progress..." /> : null}

          {topicsState.error ? <ErrorState message={topicsState.error} onRetry={() => void dispatch(fetchTopics())} /> : null}

          {progressState.error ? (
            <div className="mb-3">
              <ErrorState message={progressState.error} onRetry={() => void dispatch(fetchProgress())} />
            </div>
          ) : null}

          {!isInitialLoading && !topicsState.error && !progressState.error ? <TopicAccordion topics={filteredTopics} /> : null}
        </section>

        <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center gap-4 border-t border-[#1e1e2e] bg-[rgba(10,10,15,0.95)] px-4 py-2.5 text-[11px] text-[#6b6880] backdrop-blur md:px-8">
          <span>
            <strong className="text-[#7c6dfa]">{progressStats.completed}</strong> solved ·{' '}
            {Math.max(progressStats.total - progressStats.completed, 0)} remaining
          </span>
          <div className="h-0.5 flex-1 overflow-hidden rounded bg-[#1e1e2e]">
            <div
              className="h-full rounded bg-[linear-gradient(90deg,#7c6dfa,#a78bfa)] transition-all"
              style={{ width: `${progressStats.pct}%` }}
            />
          </div>
          <span>{progressStats.pct}% complete</span>
        </div>
      </main>
    </ProtectedRoute>
  );
}
