import Link from "next/link";
import { FileText, Sparkles, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/src/components/marketing/MarketingNav";
import { Reveal } from "@/src/components/marketing/Reveal";
import { EvidencePreviewCard } from "@/src/components/marketing/EvidencePreviewCard";
import { RoadmapPreviewCard } from "@/src/components/marketing/RoadmapPreviewCard";

const ROLES = ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer"];

export default function WelcomePage() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <MarketingNav />

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-max-content items-center gap-12 px-lg pb-20 pt-16 md:grid-cols-2 md:px-xl md:pb-28 md:pt-24">
        <div>
          <h1 className="text-display-md text-text-primary md:text-display-lg">
            Know exactly where your resume falls short.
          </h1>
          <p className="mt-5 max-w-[46ch] text-body-lg text-text-body">
            Upload your resume, pick a target role, and get an evidence-based
            read on your skill gaps, plus a 4-week roadmap to close them.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>

        <Reveal className="flex justify-center md:justify-end">
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
            Three steps between your resume and a plan you can act on.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-[1.2fr_1fr] md:grid-rows-2">
          <Reveal className="md:row-span-2">
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
                  PDF or DOCX. We parse your work history, skills, and projects
                  into structured evidence we can actually check claims against.
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
                We score you against what that role actually requires, not a
                generic checklist.
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
                A 4-week plan built from your actual gaps. Mark tasks complete
                as you go.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Product proof - two real preview tiles, visually distinct */}
      <section className="bg-surface py-20 md:py-28">
        <div className="mx-auto w-full max-w-max-content px-lg md:px-xl">
          <Reveal>
            <h2 className="max-w-[48ch] text-headline-lg text-text-primary">
              See the gap, then see the plan to close it.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <Reveal className="flex justify-center">
              <EvidencePreviewCard />
            </Reveal>
            <Reveal delay={100} className="flex justify-center">
              <RoadmapPreviewCard />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy / grounding differentiator */}
      <section className="mx-auto w-full max-w-max-content px-lg py-20 md:px-xl md:py-28">
        <Reveal className="mx-auto max-w-[56ch] text-center">
          <ShieldCheck
            className="mx-auto size-10 text-primary"
            strokeWidth={1.5}
          />
          <h2 className="mt-8 text-headline-lg text-text-primary">
            The model observes. The scoring is ours.
          </h2>
          <p className="mt-5 text-body-lg text-text-body">
            Role requirements are hand-authored, not generated. Every skill we
            mark as proven is quoted from your resume, and every score is
            computed, not guessed.
          </p>
        </Reveal>
      </section>

      {/* Roles */}
      <section className="border-t border-border-base bg-surface py-16">
        <div className="mx-auto w-full max-w-max-content px-lg md:px-xl">
          <p className="text-center text-body-md text-text-muted">
            Built for engineers targeting
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
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-max-content px-lg py-20 text-center md:px-xl md:py-28">
        <Reveal className="mx-auto max-w-[36ch]">
          <h2 className="text-headline-lg text-text-primary">
            Find out what your resume is missing.
          </h2>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Get started</Link>
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
