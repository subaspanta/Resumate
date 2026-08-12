import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/src/components/brand/Logo";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 flex h-[68px] items-center border-b border-border-base bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-max-content items-center justify-between px-lg md:px-xl">
        <Logo href="/welcome" size="sm" />

        <nav className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Get started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
