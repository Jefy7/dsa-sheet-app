import axios, { AxiosError } from 'axios';
import type { AppDispatch } from '@/store';
import { forceLogout } from '@/features/auth/authSlice';

const API_TIMEOUT_MS = 12000;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: API_TIMEOUT_MS,
});

export const getErrorMessage = (error: unknown): string => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return 'You appear to be offline. Please check your connection.';
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      'Unexpected API error.'
    );
  }

  return 'Something went wrong.';
};

export const setupAxiosInterceptors = (dispatch: AppDispatch) => {
  let isRefreshing = false;
  let refreshPromise: Promise<void> | null = null;

  const responseInterceptor = api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (!originalRequest || error.response?.status !== 401) {
        return Promise.reject(error);
      }

      const requestUrl = originalRequest.url ?? '';
      const isAuthEndpoint =
        requestUrl.includes('/api/auth/login') ||
        requestUrl.includes('/api/auth/register') ||
        requestUrl.includes('/api/auth/refresh') ||
        requestUrl.includes('/api/auth/logout');

      if (isAuthEndpoint || (originalRequest as { _retry?: boolean })._retry) {
        dispatch(forceLogout());
        return Promise.reject(error);
      }

      (originalRequest as { _retry?: boolean })._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = api.post('/api/auth/refresh').then(() => undefined);
        }

        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        dispatch(forceLogout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    },
  );

  return () => {
    api.interceptors.response.eject(responseInterceptor);
  };
};
