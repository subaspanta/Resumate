export function AuthError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-secondary">Couldn&apos;t verify your session.</p>
      <button onClick={onRetry} className="text-primary underline">
        Retry
      </button>
    </div>
  );
}
