"use client";

import { useState, useMemo } from "react";
import NutritionPanel from "./NutritionPanel";
import type { ProteinBase, FlavorOption, Addon, NutritionFacts } from "@/lib/types";

// ── Data ──────────────────────────────────────────────────────────────────

const FLAVORS: { id: FlavorOption; icon: string; label: string; color: string }[] = [
  { id: "mango", icon: "🥭", label: "Mango", color: "#FFB347" },
  { id: "strawberry", icon: "🍓", label: "Strawberry", color: "#FF6B8A" },
  { id: "blueberry", icon: "🫐", label: "Blueberry", color: "#6B73FF" },
  { id: "matcha", icon: "🍵", label: "Matcha", color: "#7DB87A" },
  { id: "vanilla", icon: "🤍", label: "Vanilla Bean", color: "#E8D5B7" },
  { id: "chocolate", icon: "🍫", label: "Dark Chocolate", color: "#7B4F2E" },
];

const ADDONS: {
  id: Addon;
  label: string;
  benefit: string;
  dosage: string;
  icon: string;
  extraCalories: number;
}[] = [
  { id: "creatine", label: "Creatine", benefit: "Strength & power output", dosage: "3g", icon: "⚡", extraCalories: 0 },
  { id: "collagen", label: "Collagen", benefit: "Skin, joints & recovery", dosage: "5g", icon: "✨", extraCalories: 20 },
  { id: "ashwagandha", label: "Ashwagandha", benefit: "Stress & cortisol control", dosage: "300mg", icon: "🌿", extraCalories: 0 },
  { id: "melatonin", label: "Melatonin", benefit: "Sleep onset support", dosage: "0.5mg", icon: "🌙", extraCalories: 0 },
  { id: "vitaminD", label: "Vitamin D3", benefit: "Immunity & bone health", dosage: "2000IU", icon: "☀️", extraCalories: 0 },
];

// ── Nutrition calculator ───────────────────────────────────────────────────

function calcNutrition(
  base: ProteinBase,
  flavors: FlavorOption[],
  addons: Addon[]
): NutritionFacts {
  const isWhey = base === "whey";
  const baseProtein = isWhey ? 26 : 24;
  const baseCarbs = isWhey ? 5 : 8;
  const baseFat = isWhey ? 2 : 3;
  const baseSodium = isWhey ? 150 : 180;
  const baseCalories = isWhey ? 145 : 150;

  // Flavors add minor carbs/sugar from fruit powder
  const flavorCarbs = flavors.length * 1.5;
  const flavorSugar = flavors.length * 1.0;
  const flavorCalories = flavors.length * 6;

  // Add-on extras
  const collagen = addons.includes("collagen");
  const creatine = addons.includes("creatine");
  const extraProtein = collagen ? 5 : 0; // collagen adds protein
  const extraCalories = addons.reduce((sum, id) => {
    const a = ADDONS.find((x) => x.id === id);
    return sum + (a?.extraCalories ?? 0);
  }, 0);

  return {
    calories: Math.round(baseCalories + flavorCalories + extraCalories),
    protein: baseProtein + extraProtein,
    carbs: Math.round(baseCarbs + flavorCarbs),
    fat: baseFat,
    fiber: isWhey ? 0 : 2,
    sugar: Math.round(flavorSugar),
    sodium: baseSodium,
    addons: {
      creatine: creatine ? 3 : undefined,
      collagen: collagen ? 5 : undefined,
      ashwagandha: addons.includes("ashwagandha") ? 300 : undefined,
      melatonin: addons.includes("melatonin") ? 0.5 : undefined,
      vitaminD: addons.includes("vitaminD") ? 2000 : undefined,
    },
  };
}

// ── Component ─────────────────────────────────────────────────────────────

export default function ProductBuilder() {
  const [base, setBase] = useState<ProteinBase>("whey");
  const [flavors, setFlavors] = useState<FlavorOption[]>(["vanilla"]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [added, setAdded] = useState(false);

  const toggleFlavor = (f: FlavorOption) => {
    setFlavors((prev) => {
      if (prev.includes(f)) return prev.filter((x) => x !== f);
      if (prev.length >= 3) return prev;
      return [...prev, f];
    });
  };

  const toggleAddon = (a: Addon) => {
    setAddons((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const nutrition = useMemo(
    () => calcNutrition(base, flavors, addons),
    [base, flavors, addons]
  );

  const servingSize = 30 + (addons.includes("collagen") ? 5 : 0) + (addons.includes("creatine") ? 3 : 0);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* ── Builder panel ── */}
      <div className="lg:col-span-2 space-y-8">

        {/* Base selector */}
        <section>
          <h2 className="heading-display text-2xl mb-1">Base Protein</h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-4">Your formula foundation.</p>
          <div className="grid grid-cols-2 gap-4">
            {(["whey", "plant"] as ProteinBase[]).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBase(b)}
                className={`rounded-2xl border-2 p-5 text-left transition-all ${
                  base === b
                    ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/25"
                    : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                }`}
              >
                <div className="text-2xl mb-2">{b === "whey" ? "🥛" : "🌱"}</div>
                <p className="font-semibold capitalize mb-0.5">{b === "whey" ? "Whey Isolate" : "Plant-Based"}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  {b === "whey"
                    ? "26g protein · Fast-absorbing · Low lactose"
                    : "24g protein · Pea + rice blend · Vegan"}
                </p>
                {base === b && (
                  <span className="mt-2 inline-block text-xs text-[var(--color-amber)] font-semibold">
                    ✓ Selected
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Flavor selector */}
        <section>
          <h2 className="heading-display text-2xl mb-1">Flavor Mix</h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-4">
            Select up to 3 flavors. Each bag is a blend of your picks.{" "}
            <span className="text-[var(--color-amber)] font-medium">
              {flavors.length}/3
            </span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FLAVORS.map((fl) => {
              const selected = flavors.includes(fl.id);
              const disabled = !selected && flavors.length >= 3;
              return (
                <button
                  key={fl.id}
                  type="button"
                  onClick={() => toggleFlavor(fl.id)}
                  disabled={disabled}
                  className={`rounded-2xl border-2 p-4 text-center transition-all group
                    ${selected
                      ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/25"
                      : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                    }
                    disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  <div className="text-3xl mb-2">{fl.icon}</div>
                  <p className="text-xs font-semibold">{fl.label}</p>
                  <div
                    className="w-6 h-1.5 rounded-full mx-auto mt-2 transition-opacity"
                    style={{
                      background: fl.color,
                      opacity: selected ? 1 : 0.3,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Add-ons */}
        <section>
          <h2 className="heading-display text-2xl mb-1">Functional Add-ons</h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-4">
            Layer in targeted ingredients. Each is clinically dosed.
          </p>
          <div className="space-y-3">
            {ADDONS.map((addon) => {
              const selected = addons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`w-full text-left rounded-2xl border-2 p-4 flex items-center gap-4 transition-all ${
                    selected
                      ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/25"
                      : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                  }`}
                >
                  <span className="text-2xl shrink-0">{addon.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{addon.label}</p>
                      <span className="text-xs text-[var(--color-ink-muted)] shrink-0">
                        {addon.dosage}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                      {addon.benefit}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected
                        ? "border-[var(--color-amber)] bg-[var(--color-amber)]"
                        : "border-[var(--color-ink-muted)]/30"
                    }`}
                  >
                    {selected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 3.5L3.8 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="card-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--color-ink)]">Your custom formula</p>
            <p className="text-sm text-[var(--color-ink-muted)]">
              {base === "whey" ? "Whey Isolate" : "Plant-Based"} ·{" "}
              {flavors.map((f) => FLAVORS.find((x) => x.id === f)?.label).join(", ")} ·{" "}
              {addons.length > 0
                ? addons.map((a) => ADDONS.find((x) => x.id === a)?.label).join(", ")
                : "No add-ons"}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`btn-primary shrink-0 transition-all duration-300 ${
              added ? "bg-green-600 hover:bg-green-600" : ""
            }`}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>

        <p className="text-xs text-[var(--color-ink-muted)] text-center">
          Shopify checkout coming soon. Prices shown are estimated in CAD.
        </p>
      </div>

      {/* ── Nutrition panel ── */}
      <div className="lg:col-span-1">
        <NutritionPanel facts={nutrition} servingSize={servingSize} />
      </div>
    </div>
  );
}
