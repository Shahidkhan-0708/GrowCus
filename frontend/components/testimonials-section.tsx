const testimonials = [
  {
    quote:
      "Growcus gave us the kind of clarity we usually expect only after hiring a full RevOps team.",
    name: "Elena Brooks",
    role: "Founder, Northlane",
  },
  {
    quote:
      "The UI feels quiet in the best way. Our reps spend less time updating tools and more time talking to real prospects.",
    name: "Daniel Kim",
    role: "Head of Sales, Merrow",
  },
  {
    quote:
      "We finally have one place to understand lead quality, pipeline movement, and what the team should do next.",
    name: "Ritika Sharma",
    role: "Growth Lead, Halcyon Studio",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Trusted by teams that want sharper growth operations.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Minimal by design, practical in daily use, and built to keep teams aligned.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm"
            >
              <blockquote className="text-base leading-8 text-foreground">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
