'use client';

import { useState } from 'react';
import ProblemItem from './ProblemItem';
import type { Topic } from '@/types/topic';

interface TopicAccordionProps {
  topics: Array<Topic & { completionPct: number; completedCount: number; totalCount: number }>;
}

export default function TopicAccordion({ topics }: TopicAccordionProps) {
  const [openTopicId, setOpenTopicId] = useState<string | null>(topics[0]?.id ?? null);

  if (topics.length === 0) {
    return (
      <div className="rounded border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        No topics found for selected filters.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.map((topic) => {
        const isOpen = openTopicId === topic.id;

        return (
          <section key={topic.id} className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setOpenTopicId((prev) => (prev === topic.id ? null : topic.id))}
              className="flex w-full items-center justify-between bg-white px-4 py-3 text-left hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div>
                <h2 className="text-base font-semibold">{topic.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {topic.completedCount}/{topic.totalCount} completed ({topic.completionPct}%)
                </p>
              </div>
              <span className="text-xs">{isOpen ? 'Hide' : 'View'}</span>
            </button>

            {isOpen ? (
              <div className="grid gap-3 bg-slate-50 p-3 dark:bg-slate-950/40 md:grid-cols-2">
                {topic.problems.length > 0 ? (
                  topic.problems.map((problem) => <ProblemItem key={problem.id} problem={problem} />)
                ) : (
                  <p className="text-sm text-slate-500">No problems in this topic yet.</p>
                )}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
