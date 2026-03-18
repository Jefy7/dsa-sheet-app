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

export const fetchTopics = createAsyncThunk<Topic[], void, { rejectValue: string; state: RootState }>(
  'topics/fetchTopics',
  async (_, thunkApi) => {
    try {
      const { data } = await api.get<Topic[]>('/api/topics');
      return Array.isArray(data) ? data : [];
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
