import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For founders building a repeatable client pipeline.",
    features: ["Up to 2 seats", "Core pipeline tracking", "Basic outreach workspace"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$99",
    description: "For revenue teams that need visibility, process, and momentum.",
    features: ["Up to 10 seats", "Advanced qualification views", "Forecasting and collaboration"],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For larger teams with complex workflows and reporting needs.",
    features: ["Custom onboarding", "Role-based controls", "Priority support"],
    highlighted: false,
  },
];

interface PricingSectionProps {
  onGetStarted: () => void;
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Pricing that stays simple as you grow.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Clear plans, clean onboarding, and no unnecessary complexity.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "rounded-3xl border p-8 shadow-sm",
                plan.highlighted
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card text-foreground",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p
                    className={[
                      "mt-2 text-sm leading-6",
                      plan.highlighted ? "text-slate-300" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {plan.description}
                  </p>
                </div>
                {plan.highlighted && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                    Best value
                  </span>
                )}
              </div>

              <div className="mt-8">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span
                    className={[
                      "ml-2 text-sm",
                      plan.highlighted ? "text-slate-300" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    /month
                  </span>
                )}
              </div>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className={[
                      "rounded-2xl border px-4 py-3 text-sm",
                      plan.highlighted
                        ? "border-white/10 bg-white/5 text-slate-100"
                        : "border-border bg-secondary text-foreground",
                    ].join(" ")}
                  >
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                onClick={onGetStarted}
                className={[
                  "mt-8 h-11 w-full rounded-xl",
                  plan.highlighted
                    ? "bg-white text-foreground hover:bg-slate-100"
                    : "bg-accent text-accent-foreground hover:bg-accent/95",
                ].join(" ")}
              >
                {plan.price === "Custom" ? "Talk to sales" : "Start free"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
