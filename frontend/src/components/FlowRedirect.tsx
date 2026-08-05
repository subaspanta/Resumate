// Shown for the frame or two between a flow guard deciding to redirect and the
// router actually navigating. Deliberately quieter than AuthLoading's
// full-screen branded splash — this is a bounce inside the app, not a boot.
export function FlowRedirect() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-md">
      <div className="animate-spin rounded-full h-6 w-6 border-[3px] border-border-input border-t-primary" />
      <span className="sr-only">Redirecting…</span>
    </main>
  );
}
