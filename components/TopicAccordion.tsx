'use client';

import { useMemo, useState } from 'react';
import ProblemItem from './ProblemItem';
import type { Topic } from '@/types/topic';

interface TopicAccordionProps {
  topics: Array<Topic & { completionPct: number; completedCount: number; totalCount: number }>;
}

function TopicProgress({ completed, total }: { completed: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="flex min-w-[160px] items-center gap-2.5">
      <div className="h-[3px] flex-1 overflow-hidden rounded bg-[#1e1e2e]">
        <div
          className="h-full rounded bg-[linear-gradient(90deg,#7c6dfa,#a78bfa)] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-9 text-right text-[10px] text-[#6b6880]">
        {completed}/{total}
      </span>
    </div>
  );
}

export default function TopicAccordion({ topics }: TopicAccordionProps) {
  const initialTopicId = topics[0]?.id;
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(() => new Set(initialTopicId ? [initialTopicId] : []));

  const topicIds = useMemo(() => new Set(topics.map((topic) => topic.id)), [topics]);

  const normalizedExpanded = useMemo(
    () => new Set([...expandedTopics].filter((topicId) => topicIds.has(topicId))),
    [expandedTopics, topicIds],
  );

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  if (topics.length === 0) {
    return <div className="p-8 text-center text-xs text-[#6b6880]">No problems match this filter.</div>;
  }

  return (
    <div>
      {topics.map((topic) => {
        const isOpen = normalizedExpanded.has(topic.id);
        return (
          <section key={topic.id} className="mx-2 border-b border-[#1e1e2e] md:mx-8">
            <button
              type="button"
              className="flex w-full items-center gap-3 py-4 text-left transition-opacity hover:opacity-90"
              onClick={() => toggleTopic(topic.id)}
              aria-expanded={isOpen}
            >
              <span className={`text-[10px] text-[#6b6880] transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                ▶
              </span>

              <div>
                <h2 className="font-serif text-lg font-normal tracking-[-0.02em] text-[#e8e6ff]">{topic.title}</h2>
                <p className="text-[11px] tracking-[0.04em] text-[#6b6880]">
                  {topic.description ?? `Practice ${topic.totalCount} curated problems in this topic`}
                </p>
              </div>

              <div className="ml-auto">
                <TopicProgress completed={topic.completedCount} total={topic.totalCount} />
              </div>
            </button>

            {isOpen ? (
              <div>
                {topic.problems.length > 0 ? (
                  topic.problems.map((problem) => <ProblemItem key={problem.id} problem={problem} />)
                ) : (
                  <div className="px-2 py-6 text-center text-xs text-[#6b6880]">No problems match this filter.</div>
                )}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
