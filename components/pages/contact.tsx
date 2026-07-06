"use client";

import { useState } from "react";
import { Magnetic, PageHeader, Reveal } from "@/components/ui";

const CONTACT_EMAIL = "kundan@skillsgit.io";

const BUDGETS = ["Under $1k", "$1k – $3k", "$3k – $10k", "$10k+", "Not sure yet"];
const TYPES = ["Startup", "Local business", "Service company", "E-commerce", "Portfolio", "Other"];
const TIMELINES = ["ASAP", "2–4 weeks", "1–2 months", "Flexible"];

export function ContactPage() {
  const [budget, setBudget] = useState("Not sure yet");
  const [type, setType] = useState("Local business");
  const [timeline, setTimeline] = useState("Flexible");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Project inquiry — ${data.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email") || "—"}\nCompany: ${data.get("company") || "—"}\nBusiness type: ${type}\nBudget: ${budget}\nTimeline: ${timeline}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="relative">
      <div className="pointer-events-none fixed inset-0 bg-background/55" aria-hidden="true" />

      <PageHeader
        tag="Contact"
        title={
          <>
            Ready to make your brand <span className="text-gradient">echo</span>?
          </>
        }
        lead="Tell us what you are building. We will reply with honest ideas, a realistic timeline, and the clearest next step."
      />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-32">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <form onSubmit={handleSubmit} className="card space-y-6 p-8 md:p-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Your name</span>
                  <input
                    name="name"
                    required
                    placeholder="Jane Smith"
                    className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 outline-none transition-colors placeholder:text-muted/60 focus:border-brand-violet"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Company (optional)</span>
                  <input
                    name="company"
                    placeholder="Acme Inc."
                    className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 outline-none transition-colors placeholder:text-muted/60 focus:border-brand-violet"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 outline-none transition-colors placeholder:text-muted/60 focus:border-brand-violet"
                  />
                </label>
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold">Business type</span>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setType(option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        type === option
                          ? "bg-gradient-brand text-white"
                          : "border border-line text-muted hover:border-brand-violet/50 hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold">Budget</span>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setBudget(option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        budget === option
                          ? "bg-gradient-brand text-white"
                          : "border border-line text-muted hover:border-brand-violet/50 hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold">Timeline</span>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTimeline(option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                        timeline === option
                          ? "bg-gradient-brand text-white"
                          : "border border-line text-muted hover:border-brand-violet/50 hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">Tell us about your project</span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  placeholder="What are you building? Who is it for? What should it achieve?"
                  className="w-full resize-y rounded-xl border border-line bg-surface-2 px-4 py-3 outline-none transition-colors placeholder:text-muted/60 focus:border-brand-violet"
                />
              </label>

              <Magnetic>
                <button
                  type="submit"
                  className="bg-gradient-brand rounded-full px-9 py-4 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Send message
                </button>
              </Magnetic>
              <p className="text-sm text-muted">
                This opens your email app with everything pre-filled — nothing is sent until you hit send.
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-6">
              <div className="card-glow p-8">
                <h2 className="font-display text-xl font-bold">Prefer email?</h2>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-gradient mt-2 inline-block break-all text-lg font-semibold"
                >
                  {CONTACT_EMAIL}
                </a>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Replies within one business day. Every inquiry is read by the
                  founder — because right now, the founder is the studio.
                </p>
              </div>
              <div className="card p-8">
                <h2 className="font-display text-xl font-bold">What happens next</h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                  <li>
                    <span className="text-gradient font-bold">1.</span> We reply with first ideas
                    and honest feasibility.
                  </li>
                  <li>
                    <span className="text-gradient font-bold">2.</span> A short call to understand
                    your goals.
                  </li>
                  <li>
                    <span className="text-gradient font-bold">3.</span> A clear proposal — scope,
                    timeline, price.
                  </li>
                </ol>
              </div>
              <div className="card p-8">
                <h2 className="font-display text-xl font-bold">A good fit if</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
                  <li>You want a site that feels premium, not generic.</li>
                  <li>You care about mobile, speed, and conversion.</li>
                  <li>You want direct communication with the person doing the work.</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
