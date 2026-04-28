import {
  BarChart3,
  BriefcaseBusiness,
  LayoutGrid,
  Search,
  Send,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smarter lead discovery",
    description:
      "Identify high-fit accounts faster with filters, signals, and prospect views your team can trust.",
  },
  {
    icon: BarChart3,
    title: "Revenue visibility",
    description:
      "See pipeline health, conversion trends, and forecast movement without stitching together spreadsheets.",
  },
  {
    icon: Send,
    title: "Outreach that stays organized",
    description:
      "Run targeted sequences, capture replies, and keep every conversation attached to the right account.",
  },
  {
    icon: LayoutGrid,
    title: "Focused team workspace",
    description:
      "Give sales and growth teams a clean operating layer for collaboration, ownership, and execution.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Client lifecycle management",
    description:
      "Track every deal from first touch to signed contract with clear stages, notes, and follow-ups.",
  },
  {
    icon: ShieldCheck,
    title: "Built for scale and trust",
    description:
      "Role-aware access and clean data structure make Growcus reliable as your revenue engine matures.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for teams that care about quality, not volume.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every surface is designed to reduce noise so your team can source,
            qualify, and close with more precision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-accent/10">
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
