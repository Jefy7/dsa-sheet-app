import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getErrorMessage } from '@/services/api';
import type { Topic } from '@/types/topic';
import type { RootState } from '@/store';

interface TopicState {
  items: Topic[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
}

const initialState: TopicState = {
  items: [],
  loading: false,
  error: null,
  hasFetched: false,
};

type ApiDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'Easy' | 'Medium' | 'Hard';

interface ApiProblem {
  id: string;
  title: string;
  difficulty: ApiDifficulty;
  youtubeLink?: string | null;
  leetcodeLink?: string | null;
  codeforcesLink?: string | null;
  articleLink?: string | null;
  links?: Topic['problems'][number]['links'];
}

interface ApiTopic {
  id: string;
  title: string;
  description?: string;
  problems: ApiProblem[];
}

type TopicsResponse = { success: boolean, message: string, data?: { items: ApiTopic[] } };

const normalizeDifficulty = (difficulty: ApiDifficulty): Topic['problems'][number]['difficulty'] => {
  switch (difficulty.toUpperCase()) {
    case 'MEDIUM':
      return 'Medium';
    case 'HARD':
      return 'Hard';
    case 'EASY':
    default:
      return 'Easy';
  }
};

const normalizeTopics = (payload: TopicsResponse): Topic[] => {
  if (Array.isArray(payload.data?.items)) {
    return payload.data.items.map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      problems: Array.isArray(topic.problems)
        ? topic.problems.map((problem) => ({
            id: problem.id,
            title: problem.title,
            difficulty: normalizeDifficulty(problem.difficulty),
            links: {
              youtube: problem.links?.youtube ?? problem.youtubeLink ?? undefined,
              leetcode: problem.links?.leetcode ?? problem.leetcodeLink ?? undefined,
              codeforces: problem.links?.codeforces ?? problem.codeforcesLink ?? undefined,
              article: problem.links?.article ?? problem.articleLink ?? undefined,
            },
          }))
        : [],
    }));
  }

  return [];
};

export const fetchTopics = createAsyncThunk<Topic[], void, { rejectValue: string; state: RootState }>(
  'topics/fetchTopics',
  async (_, thunkApi) => {
    try {
      const res = await api.get<TopicsResponse>('/api/topics');
      return normalizeTopics(res.data);
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const { topics } = getState();
      return !topics.loading;
    },
  },
);

const topicSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch topics.';
      });
  },
});

export default topicSlice.reducer;
