import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Meet the team behind Bottein and learn why we built personalized protein from the ground up.",
};

const founders = [
  {
    name: "Yushu Wang",
    role: "Co-founder & CEO",
    bio: "Former nutrition biochemist turned builder. Yushu spent years studying how macronutrient timing affects cognitive performance and decided that if precision medicine was coming to healthcare, it should come to protein first.",
    initials: "YW",
  },
  {
    name: "Christina Sun",
    role: "Co-founder & Head of Product",
    bio: "Product designer obsessed with the gap between what health-tech promises and what it delivers. Christina leads the quiz and builder experience, keeping the science accessible without dumbing it down.",
    initials: "CS",
  },
  {
    name: "Martin Shanahan",
    role: "Co-founder & Head of Operations",
    bio: "Operations and supply chain lead. Martin sourced every ingredient supplier and built the relationships that let Bottein use real fruit powder without the usual cost premium.",
    initials: "MS",
  },
];

const values = [
  {
    icon: "🔬",
    title: "Evidence first.",
    desc: "Every formula decision starts with peer-reviewed literature and ends with expert sign-off. We don't add ingredients because they're trendy—we add them because they work.",
  },
  {
    icon: "🍓",
    title: "Real ingredients only.",
    desc: "No artificial flavors, no artificial colors, no proprietary blends hiding mediocre doses. What's on the label is what's in the bottle.",
  },
  {
    icon: "🤝",
    title: "Radical transparency.",
    desc: "Every dose is disclosed. Every ingredient is sourced and explained. We want you to know exactly what you're putting in your body and why.",
  },
  {
    icon: "♻️",
    title: "Made for your life, not the shelf.",
    desc: "Our formulas aren't designed to sit in a warehouse for 18 months. Small-batch production means fresher product and tighter quality control.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* ── Hero ── */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-24 bg-[var(--color-ink)]">
        <div className="container-site max-w-3xl">
          <p className="section-label mb-5 text-white/40">Our Story</p>
          <h1 className="heading-display text-5xl md:text-6xl text-white leading-[1.05] mb-6">
            Built by people who were tired of settling.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
            Bottein started from a frustration shared by three friends: the protein
            market offered a thousand products, but none of them were{" "}
            <em className="text-white/90">yours</em>. Either the flavor was wrong, the
            formula was too generic, or the ingredients list read like a chemistry
            experiment. We knew there was a better way.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 md:py-28">
        <div className="container-site">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-4">Mission</p>
              <h2 className="heading-display text-4xl md:text-5xl mb-5">
                Optimal nutrition shouldn&apos;t be a privilege.
              </h2>
              <p className="text-[var(--color-ink-muted)] leading-relaxed mb-4">
                Young professionals are running on fumes—skipping meals, relying on
                caffeine, and buying whatever protein powder looks good at the gym.
                The result is suboptimal performance and a growing gap between what
                their bodies need and what they&apos;re actually getting.
              </p>
              <p className="text-[var(--color-ink-muted)] leading-relaxed">
                Bottein uses algorithm-assisted formulation, validated by registered
                nutritionists, to give everyone access to the kind of personalized
                nutrition that used to require a private dietitian and a research
                lab.
              </p>
            </div>
            <div className="card-surface p-8 rounded-3xl">
              <blockquote className="font-display text-2xl font-bold text-[var(--color-ink)] leading-snug mb-4">
                &ldquo;We wanted to build something we&apos;d actually use ourselves.
                Something honest, effective, and genuinely enjoyable.&rdquo;
              </blockquote>
              <p className="text-sm text-[var(--color-ink-muted)]">
                The Bottein founding team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founders ── */}
      <section className="py-24 md:py-28 bg-[var(--color-surface)]">
        <div className="container-site">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The Team</p>
            <h2 className="heading-display text-4xl md:text-5xl">
              The people behind your bottle.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-amber-light)] flex items-center justify-center mb-6">
                  <span className="font-display text-xl font-bold text-[var(--color-amber)]">
                    {founder.initials}
                  </span>
                </div>
                <p className="font-display text-xl font-bold mb-0.5">{founder.name}</p>
                <p className="text-xs text-[var(--color-amber)] font-semibold tracking-wide uppercase mb-4">
                  {founder.role}
                </p>
                <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  {founder.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 md:py-28">
        <div className="container-site">
          <div className="mb-14">
            <p className="section-label mb-3">Brand Values</p>
            <h2 className="heading-display text-4xl md:text-5xl max-w-xl">
              What we stand for, and what we won&apos;t compromise on.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="card-surface p-8 rounded-2xl hover:shadow-sm transition-shadow"
              >
                <div className="text-4xl mb-5">{val.icon}</div>
                <h3 className="font-display text-xl font-bold mb-2 text-[var(--color-ink)]">
                  {val.title}
                </h3>
                <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-24 bg-[var(--color-ink)]">
        <div className="container-site text-center max-w-xl">
          <h2 className="heading-display text-4xl text-white mb-4">
            Ready to try it yourself?
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Take our 2-minute quiz and we&apos;ll assemble your first formula free of
            charge. No commitment, no subscription required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quiz" className="btn-amber">
              Take the Quiz
            </Link>
            <Link
              href="/builder"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/20 text-white/80 text-sm font-semibold tracking-wide transition-all hover:bg-white/10"
            >
              Go to Builder
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
