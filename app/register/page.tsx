'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ErrorState from '@/components/ErrorState';
import { clearAuthError, register } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, initialized, loading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [initialized, isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const passwordStrengthHint = useMemo(() => {
    if (!password) return 'Use at least 8 characters.';
    if (password.length < 8) return 'Password is too short.';
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'Add one uppercase letter and one number.';
    return 'Strong password.';
  }, [password]);

  const validateForm = () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (normalizedName.length < 2) {
      return 'Name must be at least 2 characters.';
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    const validationMessage = validateForm();
    if (validationMessage) {
      setLocalError(validationMessage);
      return;
    }

    const action = await dispatch(
      register({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    );

    if (register.fulfilled.match(action)) {
      toast.success('Account created successfully!');
      router.replace('/dashboard');
      return;
    }

    toast.error(action.payload ?? 'Registration failed');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4 dark:from-slate-950 dark:to-slate-950">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-100/70 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Student Registration</h1>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Create your account and start tracking your coding progress.
        </p>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              minLength={2}
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-indigo-800"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-indigo-800"
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-indigo-800"
              placeholder="At least 8 characters"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{passwordStrengthHint}</p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-indigo-800"
              placeholder="Re-enter your password"
            />
          </div>

          {localError ? <ErrorState message={localError} /> : null}
          {error ? <ErrorState message={error} /> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-4 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          Already a user?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
