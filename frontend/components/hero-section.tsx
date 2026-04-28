import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/[0.05] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
            Client finding. Pipeline clarity. Predictable growth.
          </div>

          <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Win better clients with a system built for sharp teams.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Growcus brings prospecting, outreach, qualification, and revenue
            visibility into one clean workspace so your team can move faster
            without losing focus.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="h-12 rounded-xl bg-accent px-6 text-base text-accent-foreground shadow-sm hover:bg-accent/95"
            >
              Start free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card. Setup in under 10 minutes.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Qualified leads</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">3.4x</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Better conversion from cleaner targeting.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Pipeline visibility</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">100%</p>
              <p className="mt-2 text-sm text-muted-foreground">
                One source of truth for every active deal.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm text-muted-foreground">Team speed</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">+42%</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Less admin work, more time closing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
