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
  const responseInterceptor = api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        dispatch(forceLogout());
      }
      return Promise.reject(error);
    },
  );

  return () => {
    api.interceptors.response.eject(responseInterceptor);
  };
};
