export function AuthLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <span className="brand-mark brand-mark--lg" aria-hidden="true">
          R
        </span>
        <span className="brand-wordmark">Resumate</span>
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-[3px] border-border-input border-t-primary"></div>
        </div>
      </div>
    </div>
  );
}
