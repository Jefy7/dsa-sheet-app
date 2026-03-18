import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import topicReducer from '@/features/topics/topicSlice';
import progressReducer from '@/features/progress/progressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
