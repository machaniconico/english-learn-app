export default function ContentLoading() {
  return (
    <div
      role="status"
      aria-label="読み込み中"
      className="flex items-center justify-center py-16"
    >
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400" />
      <span className="sr-only">読み込み中</span>
    </div>
  );
}
