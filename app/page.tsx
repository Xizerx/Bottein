"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ── Intersection-observer hook for reveal animations ──────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Reveal wrapper ────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Bottle illustration ───────────────────────────────────────────────────
function BottleIllustration() {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ perspective: "700px" }}
    >
      <div className="bottle-spin">
        <svg
          viewBox="0 0 100 165"
          width="240"
          height="396"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="bottleInterior">
              <rect x="15" y="34" width="70" height="114" rx="2" />
            </clipPath>
            <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#aaa" />
              <stop offset="100%" stopColor="#888" />
            </linearGradient>
            <linearGradient id="shoulderGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
            </linearGradient>
          </defs>

          {/* Cap */}
          <rect x="32" y="8" width="36" height="15" rx="2" fill="url(#capGrad)" />
          <rect x="30" y="21" width="40" height="8" rx="1.5" fill="#999" />

          {/* Shoulder taper */}
          <path
            d="M30 29 L15 34 L85 34 L70 29 Z"
            fill="rgba(200,137,58,0.12)"
            stroke="var(--bottle-stroke)"
            strokeWidth="1"
          />

          {/* Bottle body */}
          <rect
            x="15"
            y="34"
            width="70"
            height="114"
            rx="2"
            fill="rgba(255,255,255,0.07)"
            stroke="var(--bottle-stroke)"
            strokeWidth="1.5"
          />

          {/* Liquid fill - animated */}
          <g clipPath="url(#bottleInterior)">
            <rect
              className="liquid-fill"
              x="15"
              y="57"
              width="70"
              height="91"
              fill="var(--bottle-liquid)"
            />
            {/* Liquid surface shimmer line */}
            <rect x="15" y="57" width="70" height="2" rx="1" fill="var(--bottle-liquid)" opacity="0.6" />
          </g>

          {/* Shoulder highlight shimmer */}
          <rect
            className="bottle-shimmer"
            x="20"
            y="35"
            width="7"
            height="55"
            rx="3.5"
            fill="var(--bottle-shimmer)"
          />

          {/* Label area */}
          <rect
            x="21"
            y="62"
            width="58"
            height="58"
            rx="1.5"
            fill="rgba(255,255,255,0.05)"
            stroke="var(--bottle-stroke)"
            strokeWidth="0.5"
          />

          {/* Label text */}
          <text
            x="50"
            y="88"
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="7.5"
            fontWeight="700"
            fill="var(--bottle-stroke)"
            letterSpacing="2.5"
          >
            BOTTEIN
          </text>
          <text
            x="50"
            y="98"
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="4"
            fill="var(--bottle-stroke)"
            letterSpacing="0.8"
            opacity="0.75"
          >
            PROTEIN  16 FL OZ
          </text>
          <line x1="28" y1="103" x2="72" y2="103" stroke="var(--bottle-stroke)" strokeWidth="0.4" opacity="0.4" />
          <text
            x="50"
            y="110"
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="3.5"
            fill="var(--bottle-stroke)"
            letterSpacing="0.5"
            opacity="0.55"
          >
            Snap. Add Water. Shake.
          </text>

          {/* Horizontal grip lines */}
          <line x1="15" y1="128" x2="85" y2="128" stroke="var(--bottle-stroke)" strokeWidth="0.4" opacity="0.2" />
          <line x1="15" y1="133" x2="85" y2="133" stroke="var(--bottle-stroke)" strokeWidth="0.4" opacity="0.2" />

          {/* Bottom edge */}
          <rect x="15" y="146" width="70" height="4" rx="2" fill="rgba(200,137,58,0.12)" />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Take the Quiz",
    desc: "Answer 5 short questions about your goals, lifestyle, and preferences. Takes under 2 minutes.",
  },
  {
    number: "02",
    title: "Get Your Formula",
    desc: "Our algorithm, verified by nutrition experts, assembles a protein blend calibrated to your exact needs.",
  },
  {
    number: "03",
    title: "Order and Enjoy",
    desc: "Mix and match flavors, choose add-ons, and refine your formula anytime. Your body, your rules.",
  },
];

const features = [
  {
    icon: "🍓",
    label: "Real Fruit Powder",
    title: "Zero artificial anything.",
    desc: "Every flavor is crafted from real freeze-dried fruit. What you taste is what's in the bottle. Nothing more.",
  },
  {
    icon: "🧠",
    label: "AI Formulation",
    title: "Precision you can't get at GNC.",
    desc: "Your formula is built from clinical dosing data, then verified by registered nutritionists before it ships.",
  },
  {
    icon: "🎨",
    label: "Mix and Match",
    title: "Never get bored again.",
    desc: "Pick up to 3 flavors per bottle. Rotate them each month. Every order can be different, or exactly the same.",
  },
];

const testimonials = [
  {
    quote:
      "Finally something that doesn't taste like chalk. The mango-vanilla combo is genuinely good.",
    name: "Priya S.",
    role: "Product designer, 26",
  },
  {
    quote:
      "I picked Sleep and Recovery and the formula came back with collagen and the right sleep support. It knew exactly what I needed without me having to explain anything.",
    name: "Jamie L.",
    role: "Developer, Toronto",
  },
  {
    quote:
      "I love that it's Canadian and actually clean. I've been using it for three months and my afternoon crashes are gone.",
    name: "Chloe M.",
    role: "Marketing lead, 24",
  },
];

export default function LandingPage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-cream)]">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(200,137,58,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 80% at 10% 90%, rgba(200,137,58,0.06) 0%, transparent 60%)",
          }}
        />

        <div className="container-site w-full pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left: text ── */}
            <div>
              {/* Eyebrow */}
              <div
                className="section-label mb-6"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "none" : "translateY(16px)",
                  transition: "opacity 0.5s ease 100ms, transform 0.5s ease 100ms",
                }}
              >
                Now accepting early access
              </div>

              {/* Headline */}
              <h1
                className="heading-display text-5xl sm:text-6xl md:text-7xl mb-6 leading-[1.05]"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "none" : "translateY(24px)",
                  transition: "opacity 0.65s ease 200ms, transform 0.65s ease 200ms",
                }}
              >
                Your protein.
                <br />
                <em className="not-italic text-[var(--color-amber)]">Personalized.</em>
              </h1>

              {/* Subtitle */}
              <p
                className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] mb-3 leading-snug max-w-sm"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "none" : "translateY(20px)",
                  transition: "opacity 0.65s ease 300ms, transform 0.65s ease 300ms",
                }}
              >
                Pre-portioned. Just add water.{"\u00A0"}Shake&nbsp;and&nbsp;go.
              </p>
              <p
                className="text-base text-[var(--color-ink-muted)] max-w-md leading-relaxed mb-10"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "none" : "translateY(20px)",
                  transition: "opacity 0.65s ease 360ms, transform 0.65s ease 360ms",
                }}
              >
                Real fruit flavours, zero artificial ingredients. Science-backed
                formulas sealed in a 16&nbsp;oz bottle, built for people who refuse
                to compromise on what goes in their body.
              </p>

              {/* CTAs */}
              <div
                className="flex flex-wrap gap-3"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "none" : "translateY(20px)",
                  transition: "opacity 0.65s ease 420ms, transform 0.65s ease 420ms",
                }}
              >
                <Link href="/quiz" className="btn-primary text-sm">
                  Build Yours
                </Link>
                <a href="#waitlist" className="btn-outline text-sm">
                  Join Waitlist
                </a>
              </div>

              {/* Social proof */}
              <div
                className="mt-12 flex flex-wrap items-center gap-6 text-sm text-[var(--color-ink-muted)]"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transition: "opacity 0.65s ease 560ms",
                }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[var(--color-amber)]">✦</span> Plant and whey options
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[var(--color-amber)]">✦</span> No artificial flavors
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[var(--color-amber)]">✦</span> Expert-verified
                </span>
              </div>
            </div>

            {/* ── Right: bottle ── */}
            <div
              className="flex items-center justify-center"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "none" : "translateY(30px)",
                transition: "opacity 0.9s ease 500ms, transform 0.9s ease 500ms",
              }}
            >
              <BottleIllustration />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
          <span className="text-xs tracking-widest uppercase text-[var(--color-ink-muted)]">Scroll</span>
          <div className="w-px h-8 bg-[var(--color-ink-muted)] animate-pulse" />
        </div>
      </section>

      {/* ── Marquee / ticker ──────────────────────────────────────────── */}
      <div className="bg-[var(--color-ink)] text-[var(--color-cream)] py-4 overflow-hidden">
        <div
          className="flex gap-16 whitespace-nowrap"
          style={{ animation: "ticker 22s linear infinite" }}
        >
          {Array.from({ length: 6 }).flatMap((_, i) => [
            <span key={`a${i}`} className="text-sm font-medium tracking-wide">Real Fruit Powder</span>,
            <span key={`b${i}`} className="text-[var(--color-amber)]">✦</span>,
            <span key={`c${i}`} className="text-sm font-medium tracking-wide">Expert-verified Formulas</span>,
            <span key={`d${i}`} className="text-[var(--color-amber)]">✦</span>,
            <span key={`e${i}`} className="text-sm font-medium tracking-wide">Snap. Add Water. Shake.</span>,
            <span key={`f${i}`} className="text-[var(--color-amber)]">✦</span>,
            <span key={`g${i}`} className="text-sm font-medium tracking-wide">Zero Artificial Anything</span>,
            <span key={`h${i}`} className="text-[var(--color-amber)]">✦</span>,
          ])}
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[var(--color-cream)]">
        <div className="container-site">
          <Reveal className="text-center mb-16">
            <p className="section-label mb-3">Process</p>
            <h2 className="heading-display text-4xl md:text-5xl">
              Three steps to your formula
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 100}>
                <div className="card-surface p-8 h-full relative overflow-hidden group hover:shadow-md transition-shadow">
                  <span
                    className="absolute -top-4 -right-2 font-display text-8xl font-bold text-[var(--color-amber-light)] select-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <p className="section-label mb-4">{step.number}</p>
                  <h3 className="heading-display text-2xl mb-3">{step.title}</h3>
                  <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300} className="text-center mt-12">
            <Link href="/quiz" className="btn-primary">
              Start the Quiz
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[var(--color-ink)]">
        <div className="container-site">
          <Reveal className="mb-16">
            <p className="section-label mb-3 text-white/40">Why Bottein</p>
            <h2 className="heading-display text-4xl md:text-5xl text-white max-w-xl">
              Not your average protein brand.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <Reveal key={feat.label} delay={i * 120}>
                <div className="feature-card bg-white/5 border border-white/10 rounded-2xl p-8 h-full hover:bg-white/8 transition-colors group">
                  <div className="text-4xl mb-6">{feat.icon}</div>
                  <p className="feature-card-label text-xs font-semibold tracking-[0.15em] uppercase text-[var(--color-amber)] mb-2">
                    {feat.label}
                  </p>
                  <h3 className="font-display text-xl font-bold text-white mb-3 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">{feat.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Builder CTA ───────────────────────────────────────────────── */}
      <section className="py-24 md:py-28 bg-[var(--color-surface)]">
        <div className="container-site">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="section-label mb-4">Product Builder</p>
              <h2 className="heading-display text-4xl md:text-5xl mb-5">
                Design your formula from scratch.
              </h2>
              <p className="text-[var(--color-ink-muted)] leading-relaxed mb-8 max-w-sm">
                Choose your base, pick up to three flavors, and layer in functional
                add-ons like creatine, collagen, or omega-3. Watch your nutrition
                panel update in real time.
              </p>
              <Link href="/builder" className="btn-primary">
                Open Builder
              </Link>
            </Reveal>

            {/* Mockup card */}
            <Reveal delay={120}>
              <div className="card-surface p-8 rounded-3xl shadow-xl">
                <p className="section-label mb-5">Your bottle preview</p>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Base Protein", value: "Whey Isolate" },
                    { label: "Flavors", value: "Mango, Vanilla, Strawberry" },
                    { label: "Add-ons", value: "Creatine, Vitamin D3+K2" },
                    { label: "Serving size", value: "16 oz (473 ml)" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-black/6 last:border-0">
                      <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">{label}</span>
                      <span className="text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[var(--color-amber-light)] rounded-xl p-4 text-center">
                  <p className="text-xs text-[var(--color-ink-muted)] mb-0.5">Est. per bottle</p>
                  <p className="font-display text-2xl font-bold text-[var(--color-ink)]">
                    28g protein, 151 kcal
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-[var(--color-cream)]">
        <div className="container-site">
          <Reveal className="text-center mb-16">
            <p className="section-label mb-3">Early Feedback</p>
            <h2 className="heading-display text-4xl md:text-5xl">
              What our testers say
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="card-surface p-8 h-full flex flex-col">
                  <div className="text-[var(--color-amber)] text-2xl mb-4 tracking-tight">
                    &ldquo;&rdquo;
                  </div>
                  <p className="text-[var(--color-ink)] leading-relaxed mb-6 flex-1 italic font-display text-lg">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t border-black/8 pt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist ──────────────────────────────────────────────────── */}
      <section id="waitlist" className="waitlist-section py-24 md:py-32 bg-[var(--color-amber)] text-[var(--color-ink)]">
        <div className="container-site max-w-2xl text-center">
          <Reveal>
            <p className="section-label mb-4 text-[var(--color-ink)]/60">Limited Early Access</p>
            <h2 className="heading-display text-4xl md:text-5xl mb-5">
              Be first in line.
            </h2>
            <p className="text-lg mb-10 text-[var(--color-ink)]/70 leading-relaxed">
              We&apos;re launching to a small group first. Drop your email and we&apos;ll
              let you know when your bottle is ready to build.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
                if (email) {
                  const stored = JSON.parse(localStorage.getItem("bottein_waitlist") || "[]");
                  stored.push({ email, ts: new Date().toISOString() });
                  localStorage.setItem("bottein_waitlist", JSON.stringify(stored));
                  alert("You're on the list! We'll be in touch soon.");
                  form.reset();
                }
              }}
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/40 border border-black/10 rounded-full px-5 py-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:border-[var(--color-ink)]/30 transition-colors"
              />
              <button
                type="submit"
                className="bg-[var(--color-ink)] text-[var(--color-cream)] rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-black/80 transition-colors"
              >
                Join Waitlist
              </button>
            </form>
            <p className="text-xs text-[var(--color-ink)]/40 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
