import Link from "next/link";
import { FileText, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/src/components/marketing/MarketingNav";
import { Reveal } from "@/src/components/marketing/Reveal";
import { EvidencePreviewCard } from "@/src/components/marketing/EvidencePreviewCard";

const ROLES = ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer"];

export default function WelcomePage() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <MarketingNav />

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-max-content items-center gap-8 px-lg pb-20 pt-16 md:grid-cols-2 md:gap-12 md:px-xl md:pb-28 md:pt-24">
        <div>
          <h1 className="text-display-md text-text-primary md:text-display-lg">
            Stop guessing what&apos;s missing from your resume.
          </h1>
          <p className="mt-5 max-w-[46ch] text-body-lg text-text-body">
            Upload it, pick the role you&apos;re after, and see exactly which
            skills you can already prove, which ones you can&apos;t yet, and
            the plan to close the gap.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Analyze my resume</Link>
            </Button>
          </div>
        </div>

        <Reveal className="flex justify-start md:justify-end">
          <EvidencePreviewCard />
        </Reveal>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border-base bg-surface-container-low py-12">
        <div className="mx-auto flex w-full max-w-max-content flex-col items-center gap-3 px-lg text-center md:px-xl">
          <p className="text-body-lg font-medium text-text-primary">
            Every skill you&apos;re shown proof for is quoted straight from your
            resume.
          </p>
          <p className="text-body-md text-text-body">
            Nothing is scored on a guess.
          </p>
        </div>
      </section>

      {/* How it works - asymmetric, not equal 3-card */}
      <section className="mx-auto w-full max-w-max-content px-lg py-20 md:px-xl md:py-28">
        <Reveal>
          <h2 className="max-w-[48ch] text-headline-lg text-text-primary">
            Three steps from resume to a plan you can actually work.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:grid-rows-2">
          <Reveal className="lg:row-span-2">
            <div className="flex h-full flex-col justify-between rounded-xl border border-border-base bg-surface p-8">
              <FileText className="size-8 text-primary" strokeWidth={1.5} />
              <div className="mt-8">
                <p className="font-mono-label text-mono-label uppercase tracking-[0.08em] text-text-primary">
                  Step 1
                </p>
                <h3 className="mt-2 text-headline-lg text-text-primary">
                  Upload your resume
                </h3>
                <p className="mt-3 max-w-[38ch] text-body-md text-text-body">
                  PDF or DOCX. Your work history, skills, and projects become
                  evidence we can point back to — not just text we skim.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-xl border border-border-base bg-surface p-8">
              <Sparkles className="size-8 text-primary" strokeWidth={1.5} />
              <p className="mt-6 font-mono-label text-mono-label uppercase tracking-[0.08em] text-text-primary">
                Step 2
              </p>
              <h3 className="mt-2 text-headline-lg text-text-primary">
                Pick a target role
              </h3>
              <p className="mt-3 text-body-md text-text-body">
                Scored against what that specific role actually needs, not a
                one-size-fits-all checklist.
              </p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="rounded-xl border border-border-base bg-surface-container-low p-8">
              <MapPin className="size-8 text-primary" strokeWidth={1.5} />
              <p className="mt-6 font-mono-label text-mono-label uppercase tracking-[0.08em] text-primary">
                Step 3
              </p>
              <h3 className="mt-2 text-headline-lg text-text-primary">
                Work your roadmap
              </h3>
              <p className="mt-3 text-body-md text-text-body">
                Not another tutorial to watch — tasks built to extend your
                own projects, so finishing one leaves you with real proof.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-border-base bg-surface py-16">
        <div className="mx-auto w-full max-w-max-content px-lg md:px-xl">
          <p className="text-center text-body-md text-text-muted">
            Live today, with more roles on the way
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {ROLES.map((role) => (
              <span
                key={role}
                className="rounded-full border border-border-base bg-canvas px-4 py-2 text-body-md text-text-body"
              >
                {role}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-border-input px-4 py-2 text-body-md text-text-muted">
              More roles soon
            </span>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-max-content px-lg py-20 text-center md:px-xl md:py-28">
        <Reveal className="mx-auto max-w-[36ch]">
          <h2 className="text-headline-lg text-text-primary">
            Upload your resume and see where you actually stand.
          </h2>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/register">Analyze my resume</Link>
            </Button>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border-base py-8">
        <div className="mx-auto w-full max-w-max-content px-lg text-center text-body-md text-text-muted md:px-xl">
          © 2026 Resumate
        </div>
      </footer>
    </div>
  );
}
