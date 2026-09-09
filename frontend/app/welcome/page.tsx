import Link from "next/link";
import {
  FileText,
  Sparkles,
  MapPin,
  ArrowRight,
  Quote,
  ListChecks,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/src/components/marketing/MarketingNav";
import { Reveal } from "@/src/components/marketing/Reveal";
import { EvidencePreviewCard } from "@/src/components/marketing/EvidencePreviewCard";

const ROLES = ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer"];

export default function WelcomePage() {
  // Clip 100vw hero bleed without disabling the sticky nav.
  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-canvas">
      <MarketingNav />

      {/* Split and display type begin at lg to keep the headline readable. */}
      <section className="mx-auto grid w-full max-w-max-content items-center gap-10 px-lg pb-12 pt-10 md:gap-12 md:px-xl md:pb-20 md:pt-16 lg:grid-cols-[1fr_minmax(0,29rem)] lg:pb-24 lg:pt-20">
        <div>
          <h1 className="text-balance text-display-md text-text-primary lg:text-display-lg xl:text-[60px] xl:leading-[64px]">
            Stop guessing what&apos;s{" "}
            <span className="marketing-accent-word">missing</span> from your
            resume.
          </h1>
          <p className="mt-6 max-w-[46ch] text-body-lg text-text-body">
            Upload it, pick the role you&apos;re after, and see exactly which
            skills you can already prove, which ones you can&apos;t yet, and the
            plan to close the gap.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="marketing-cta">
              <Link href="/register">
                Analyze my resume
                <ArrowRight
                  className="marketing-cta-arrow size-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          {/* Mechanism, not outcome — see .hero-proof in marketing.css. */}
          {/* Preserve list semantics after removing native markers. */}
          <ul role="list" className="hero-proof mt-10 list-none">
            <li className="hero-proof-item">
              <Quote className="hero-proof-icon size-4" aria-hidden="true" />
              <span className="hero-proof-text">
                <span className="hero-proof-lead">Quoted, not guessed</span> —
                every skill traced to a line in your resume
              </span>
            </li>
            <li className="hero-proof-item">
              <ListChecks
                className="hero-proof-icon size-4"
                aria-hidden="true"
              />
              <span className="hero-proof-text">
                <span className="hero-proof-lead">Hand-authored</span> — role
                requirements written by us, not generated
              </span>
            </li>
            <li className="hero-proof-item">
              <Route className="hero-proof-icon size-4" aria-hidden="true" />
              <span className="hero-proof-text">
                <span className="hero-proof-lead">4 weeks</span> — tasks sized
                to finish, built on your own projects
              </span>
            </li>
          </ul>
        </div>

        <div className="hero-panel">
          <p className="hero-panel-label">Live preview</p>
          <Reveal className="mt-4 flex justify-start">
            <EvidencePreviewCard />
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border-base bg-surface-container-low py-8 md:py-12">
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
      <section
        id="how-it-works"
        className="mx-auto w-full max-w-max-content scroll-mt-20 px-lg py-14 md:px-xl md:py-28"
      >
        <Reveal>
          <h2 className="max-w-[48ch] text-pretty text-headline-lg text-text-primary">
            <span className="marketing-accent-word">Three steps</span> from
            resume to a plan you can actually work.
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:mt-14 md:gap-6 lg:grid-cols-[1.2fr_1fr] lg:grid-rows-2">
          <Reveal className="lg:row-span-2">
            <div className="marketing-tile marketing-tile--tall">
              <FileText
                className="marketing-tile-icon size-8"
                strokeWidth={1.5}
              />
              <div>
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
            <div className="marketing-tile">
              <Sparkles
                className="marketing-tile-icon size-8"
                strokeWidth={1.5}
              />
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
            <div className="marketing-tile marketing-tile--accent">
              <MapPin
                className="marketing-tile-icon size-8"
                strokeWidth={1.5}
              />
              <p className="mt-6 font-mono-label text-mono-label uppercase tracking-[0.08em] text-primary">
                Step 3
              </p>
              <h3 className="mt-2 text-headline-lg text-text-primary">
                Work your roadmap
              </h3>
              <p className="mt-3 text-body-md text-text-body">
                Not another tutorial to watch — tasks built to extend your own
                projects, so finishing one leaves you with real proof.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-border-base bg-surface py-10 md:py-16">
        <div className="mx-auto w-full max-w-max-content px-lg md:px-xl">
          <p className="text-center text-body-md text-text-muted">
            Live today, with more roles on the way
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {ROLES.map((role) => (
              <span key={role} className="marketing-pill">
                {role}
              </span>
            ))}
            <span className="marketing-pill marketing-pill--pending">
              More roles soon
            </span>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-max-content px-lg py-14 text-center md:px-xl md:py-28">
        <Reveal className="mx-auto max-w-[36ch]">
          <h2 className="text-balance text-headline-lg text-text-primary">
            Upload your resume and see where you actually stand.
          </h2>
          <div className="mt-8">
            <Button asChild size="lg" className="marketing-cta">
              <Link href="/register">
                Analyze my resume
                <ArrowRight
                  className="marketing-cta-arrow size-4"
                  aria-hidden="true"
                />
              </Link>
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
