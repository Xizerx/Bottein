import type { Metadata } from "next";
import ProductBuilder from "@/components/ProductBuilder";

export const metadata: Metadata = {
  title: "Formula Builder",
  description:
    "Design your personalized protein formula. Choose your base, mix flavors, and add functional ingredients.",
};

export default function BuilderPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-xl mb-12">
          <p className="section-label mb-3">Formula Builder</p>
          <h1 className="heading-display text-4xl md:text-5xl mb-4">
            Build your formula.
          </h1>
          <p className="text-[var(--color-ink-muted)] leading-relaxed">
            Every Bottein formula is made-to-order. Pick your protein base, select
            up to three flavors, and layer in functional add-ons. Your nutrition
            panel updates as you go.
          </p>
        </div>

        <ProductBuilder />
      </div>
    </div>
  );
}
