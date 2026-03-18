export default function Loader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-8 text-sm text-slate-600 dark:text-slate-300">
      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800 dark:border-slate-700 dark:border-t-slate-100" />
      {label}
    </div>
  );
}
