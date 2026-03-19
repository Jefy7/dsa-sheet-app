import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, getErrorMessage } from '@/services/api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

export const register = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  'auth/register',
  async (payload, thunkApi) => {
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
      if (!data?.user) {
        return thunkApi.rejectWithValue('Invalid registration response from server.');
      }
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const login = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (payload, thunkApi) => {
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
      if (!data?.user) {
        return thunkApi.rejectWithValue('Invalid login response from server.');
      }
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchUser = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/fetchUser',
  async (_, thunkApi) => {
    try {
      const { data } = await api.get<AuthResponse>('/api/auth/me');
      if (!data?.user) {
        return thunkApi.rejectWithValue('Session response is invalid.');
      }
      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, thunkApi) => {
    try {
      const res = await api.get('/api/auth/me');
      return res.data.data;
    } catch (err) {
      return thunkApi.rejectWithValue('Not authenticated');
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, thunkApi) => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    forceLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = 'Session expired. Please login again.';
      state.initialized = true;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Registration failed.';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed.';
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.initialized = false;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload ?? 'Logout failed.';
      });
  },
});

export const { forceLogout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
