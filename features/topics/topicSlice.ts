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

type TopicsResponse = Topic[] | { topics?: Topic[]; data?: Topic[] };

const normalizeTopics = (payload: TopicsResponse): Topic[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.topics)) {
    return payload.topics;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

export const fetchTopics = createAsyncThunk<Topic[], void, { rejectValue: string; state: RootState }>(
  'topics/fetchTopics',
  async (_, thunkApi) => {
    try {
      const { data } = await api.get<TopicsResponse>('/api/topics');
      return normalizeTopics(data);
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
