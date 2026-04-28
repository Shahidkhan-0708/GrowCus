const pipelineRows = [
  { company: "Northstar Labs", stage: "Qualified", owner: "Ava", value: "$18K" },
  { company: "Sienna Commerce", stage: "Proposal", owner: "Mason", value: "$32K" },
  { company: "Atlas Studio", stage: "Negotiation", owner: "Riya", value: "$24K" },
];

const activity = [
  "12 new decision-maker contacts added this week",
  "7 high-intent accounts moved into proposal stage",
  "Forecast confidence increased by 18% month over month",
];

export function DashboardPreviewSection() {
  return (
    <section id="preview" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Product Preview
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              One workspace for the full client growth loop.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Growcus helps your team move from scattered tools to a single,
              elegant operating layer for sourcing, outreach, qualification, and
              forecasting.
            </p>

            <div className="mt-8 space-y-4">
              {activity.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-secondary px-5 py-4 text-sm text-foreground shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border bg-card p-4 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.35)] sm:p-6">
            <div className="rounded-[24px] border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Growth overview</p>
                  <p className="text-xs text-muted-foreground">Updated 4 minutes ago</p>
                </div>
                <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Forecast healthy
                </div>
              </div>

              <div className="grid gap-4 p-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-border bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Pipeline</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">$482K</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Win rate</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">31%</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Replies</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">68%</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Pipeline momentum</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Qualified opportunities across the last 6 weeks
                        </p>
                      </div>
                      <p className="text-xs text-accent">+18%</p>
                    </div>
                    <div className="mt-6 flex h-36 items-end gap-3">
                      {[36, 58, 52, 72, 68, 88].map((value, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-2">
                          <div
                            className="w-full rounded-t-2xl bg-accent/90"
                            style={{ height: `${value}%` }}
                          />
                          <span className="text-[11px] text-muted-foreground">
                            W{index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Active deals</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Clean handoff across the whole team
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">24 open</span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {pipelineRows.map((row) => (
                      <div
                        key={row.company}
                        className="rounded-2xl border border-border bg-secondary p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{row.company}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {row.owner} · {row.stage}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
                    Teams use this view to spot stalled deals, rebalance ownership,
                    and prioritize the next best move.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
