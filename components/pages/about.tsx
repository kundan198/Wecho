"use client";

import { GradientButton, PageHeader, Reveal, SectionTag } from "@/components/ui";

const VALUES = [
  { title: "Boutique by design", description: "Small enough for care, sharp enough for premium execution." },
  { title: "Every pixel has purpose", description: "Visual decisions are tied to trust, clarity, emotion, or conversion." },
  { title: "Performance matters", description: "A beautiful website still has to load fast and work smoothly on mobile." },
  { title: "Story before decoration", description: "Motion and 3D should guide attention, not distract from the business." },
];

const PRINCIPLES = ["Beautiful", "Minimal", "Fast", "Accessible", "Scalable", "Timeless"];

const PROCESS = [
  ["Listen", "We start by understanding the business, the customer, and what the website must achieve."],
  ["Shape", "We turn that into a clear story, page structure, and visual direction."],
  ["Craft", "We design and build with the same attention to spacing, motion, copy, and code."],
  ["Refine", "We test, polish, and improve until the experience feels intentional end to end."],
];

export function AboutPage() {
  return (
    <main className="relative">
      <div className="pointer-events-none fixed inset-0 bg-background/55" aria-hidden="true" />

      <PageHeader
        tag="About"
        title={
          <>
            A boutique studio with a <span className="text-gradient">big belief</span>
          </>
        }
        lead="Wecho is a boutique digital studio creating premium websites for ambitious brands and growing businesses."
      />

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="font-display text-3xl font-bold leading-snug md:text-5xl">
            Great design shouldn&apos;t be reserved for{" "}
            <span className="text-gradient">billion-dollar companies</span>.
          </h2>
          <div className="mt-8 max-w-3xl space-y-6 text-xl leading-relaxed text-muted">
            <p>
              Wecho was founded with one belief: every ambitious business deserves
              a website that feels world-class.
            </p>
            <p>
              We&apos;re small on purpose. The same person thinking about your
              strategy is close to the design, the motion, and the code. That means
              fewer handoffs, fewer generic decisions, and more care in the details.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <SectionTag>What we believe</SectionTag>
            <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              Premium is not about pretending to be huge. It is about being precise.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.07}>
                <div className="card h-full p-7">
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  <h3 className="font-display mt-6 text-2xl font-bold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <SectionTag>How we work</SectionTag>
          <h2 className="font-display mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Clear thinking, careful craft, and honest momentum.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
          {PROCESS.map(([title, text], i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="bg-background/82 p-7 backdrop-blur">
                <span className="font-mono text-sm text-muted">0{i + 1}</span>
                <h3 className="font-display mt-8 text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 border-y border-line bg-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <SectionTag>Principles</SectionTag>
            <h2 className="font-display mt-5 text-3xl font-bold md:text-5xl">
              The standards behind every Wecho project.
            </h2>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            {PRINCIPLES.map((principle, i) => (
              <Reveal key={principle} delay={i * 0.06}>
                <span className="card inline-block px-6 py-3 font-display font-semibold">{principle}</span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-20 text-center">
              <p className="font-display text-2xl font-bold md:text-4xl">
                <span className="text-gradient">Ideas that echo.</span>{" "}
                <span className="font-script text-4xl">Experiences that stay.</span>
              </p>
              <div className="mt-8">
                <GradientButton href="/contact">Work with Wecho</GradientButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
