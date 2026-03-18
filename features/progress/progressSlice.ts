import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getErrorMessage } from '@/services/api';
import type { ProgressItem, ProgressUpdatePayload } from '@/types/progress';
import type { RootState } from '@/store';

interface ProgressState {
  byProblemId: Record<string, boolean>;
  loading: boolean;
  error: string | null;
  pendingUpdates: Record<string, boolean>;
}

interface UpdateProgressThunkArg extends ProgressUpdatePayload {
  previousCompleted: boolean;
}

const initialState: ProgressState = {
  byProblemId: {},
  loading: false,
  error: null,
  pendingUpdates: {},
};

export const fetchProgress = createAsyncThunk<ProgressItem[], void, { rejectValue: string }>(
  'progress/fetchProgress',
  async (_, thunkApi) => {
    try {
      const { data } = await api.get<ProgressItem[]>('/api/progress');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateProgress = createAsyncThunk<
  ProgressUpdatePayload,
  UpdateProgressThunkArg,
  { rejectValue: string; state: RootState }
>(
  'progress/updateProgress',
  async (payload, thunkApi) => {
    try {
      const requestPayload: ProgressUpdatePayload = {
        problemId: payload.problemId,
        completed: payload.completed,
      };

      await api.post('/api/progress/update', requestPayload);
      return requestPayload;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: ({ problemId }, { getState }) => {
      const { progress } = getState();
      return !progress.pendingUpdates[problemId];
    },
  },
);

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.byProblemId = action.payload.reduce<Record<string, boolean>>((acc, item) => {
          acc[item.problemId] = item.completed;
          return acc;
        }, {});
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch progress.';
      })
      .addCase(updateProgress.pending, (state, action) => {
        const { problemId, completed } = action.meta.arg;
        state.pendingUpdates[problemId] = true;
        state.byProblemId[problemId] = completed;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        const { problemId } = action.payload;
        delete state.pendingUpdates[problemId];
      })
      .addCase(updateProgress.rejected, (state, action) => {
        const { problemId, previousCompleted } = action.meta.arg;
        delete state.pendingUpdates[problemId];
        state.byProblemId[problemId] = previousCompleted;
        state.error = action.payload ?? 'Failed to update progress.';
      });
  },
});

export default progressSlice.reducer;
