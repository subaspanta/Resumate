import { BrandGlyph } from "@/src/components/brand/BrandGlyph";

// Not the shared Logo: that renders a <Link>, and a loading splash has
// nowhere to navigate to. It stacks the glyph over the wordmark rather than
// sitting them in a row, so it owns its own layout and borrows only the mark.
export function AuthLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <BrandGlyph size="lg" />
        <span className="brand-wordmark">Resumate</span>
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-[3px] border-border-input border-t-primary"></div>
        </div>
      </div>
    </div>
  );
}
