const steps = [
  {
    step: "01",
    title: "Add Your Students",
    description:
      "Import or manually add students with their batch, contact details, and initial data.",
  },
  {
    step: "02",
    title: "Assign Tasks & Track",
    description:
      "Create study tasks, assignments, and track completion. Update attendance and marks regularly.",
  },
  {
    step: "03",
    title: "AI Identifies Risks",
    description:
      "GrowCus automatically calculates risk scores and flags students who may need intervention.",
  },
  {
    step: "04",
    title: "Intervene & Coach",
    description:
      "Use Aria AI coach for student motivation, send notifications, and take timely action.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            How GrowCus Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            A simple, four-step process to transform how you support your
            students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0" />
              )}
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-primary">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
