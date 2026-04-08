"use client";

import { useState, useMemo } from "react";
import NutritionPanel from "./NutritionPanel";
import type { ProteinBase, FlavorOption, Addon, NutritionFacts } from "@/lib/types";

// ── Pricing ───────────────────────────────────────────────────────────────

const BASE_PRICE = 6.00; // CAD

const PROTEIN_PRICES: Record<ProteinBase, number> = {
  whey: 0.00,
  plant: 0.50,
};

const ADDON_PRICES: Record<Addon, number> = {
  collagen:   1.00,
  vitaminC:   0.40,
  vitaminDK2: 0.50,
  bComplex:   0.45,
  electrolyte:0.35,
  omega3:     0.75,
  prebiotic:  0.30,
  konjac:     0.30,
  psyllium:   0.25,
  creatine:   0.60,
  melatonin:  0.40,
};

// ── Data ──────────────────────────────────────────────────────────────────

const FLAVORS: { id: FlavorOption; icon: string; label: string; color: string }[] = [
  { id: "mango",      icon: "🥭", label: "Mango",          color: "#FFB347" },
  { id: "strawberry", icon: "🍓", label: "Strawberry",     color: "#FF6B8A" },
  { id: "blueberry",  icon: "🫐", label: "Blueberry",      color: "#6B73FF" },
  { id: "matcha",     icon: "🍵", label: "Matcha",         color: "#7DB87A" },
  { id: "vanilla",    icon: "🤍", label: "Vanilla Bean",   color: "#E8D5B7" },
  { id: "chocolate",  icon: "🍫", label: "Dark Chocolate", color: "#7B4F2E" },
];

const ADDONS: {
  id: Addon;
  label: string;
  benefit: string;
  dosage: string;
  icon: string;
  price: number;
  extraCalories: number;
  extraProtein: number;
  extraFiber: number;
  extraFat: number;
  extraSodium: number;
}[] = [
  { id: "collagen",    label: "Collagen Boost",          benefit: "Skin, joints and recovery",   dosage: "5g",    icon: "✨", price: 1.00, extraCalories: 20, extraProtein: 5,  extraFiber: 0, extraFat: 0,   extraSodium: 0   },
  { id: "vitaminC",   label: "Vitamin C",                benefit: "Immunity and antioxidant support", dosage: "500mg", icon: "🍋", price: 0.40, extraCalories: 0,  extraProtein: 0,  extraFiber: 0, extraFat: 0,   extraSodium: 0   },
  { id: "vitaminDK2", label: "Vitamin D3 + K2",          benefit: "Immunity, bone and heart health",  dosage: "1000IU + 90mcg", icon: "☀️", price: 0.50, extraCalories: 0,  extraProtein: 0,  extraFiber: 0, extraFat: 0,   extraSodium: 0   },
  { id: "bComplex",   label: "B-Complex",                benefit: "Energy metabolism and nerve function", dosage: "Full spectrum", icon: "⚡", price: 0.45, extraCalories: 0,  extraProtein: 0,  extraFiber: 0, extraFat: 0,   extraSodium: 0   },
  { id: "electrolyte",label: "Electrolyte Blend",        benefit: "Hydration and muscle function", dosage: "350mg blend", icon: "💧", price: 0.35, extraCalories: 0,  extraProtein: 0,  extraFiber: 0, extraFat: 0,   extraSodium: 120 },
  { id: "omega3",     label: "Omega-3 Algae",            benefit: "Heart, brain and joint health", dosage: "500mg",  icon: "🐟", price: 0.75, extraCalories: 5,  extraProtein: 0,  extraFiber: 0, extraFat: 0.5, extraSodium: 0   },
  { id: "prebiotic",  label: "Prebiotic Fibre (Inulin)", benefit: "Gut health and digestion",      dosage: "3g",    icon: "🌾", price: 0.30, extraCalories: 12, extraProtein: 0,  extraFiber: 3, extraFat: 0,   extraSodium: 0   },
  { id: "konjac",     label: "Konjac Glucomannan",       benefit: "Appetite control, satiety",     dosage: "1g",    icon: "🌿", price: 0.30, extraCalories: 3,  extraProtein: 0,  extraFiber: 1, extraFat: 0,   extraSodium: 0   },
  { id: "psyllium",   label: "Psyllium Husk",            benefit: "Fibre, fullness, regularity",   dosage: "2g",    icon: "🌱", price: 0.25, extraCalories: 6,  extraProtein: 0,  extraFiber: 2, extraFat: 0,   extraSodium: 0   },
  { id: "creatine",   label: "Creatine Monohydrate",     benefit: "Strength and power output",     dosage: "3g",    icon: "💪", price: 0.60, extraCalories: 0,  extraProtein: 0,  extraFiber: 0, extraFat: 0,   extraSodium: 0   },
  { id: "melatonin",  label: "Melatonin",                benefit: "Sleep onset support",           dosage: "1mg",   icon: "🌙", price: 0.40, extraCalories: 0,  extraProtein: 0,  extraFiber: 0, extraFat: 0,   extraSodium: 0   },
];

// ── Taste score ────────────────────────────────────────────────────────────

function calcTasteScore(addons: Addon[]): number {
  let score = 100;
  if (addons.includes("konjac"))    score -= 15;
  if (addons.includes("psyllium"))  score -= 10;
  if (addons.includes("omega3"))    score -= 8;
  if (addons.includes("bComplex"))  score -= 5;
  if (addons.includes("creatine"))  score -= 3;
  return Math.max(score, 0);
}

function tasteZone(score: number) {
  if (score <= 40) return { color: "#dc2626", label: "Heads up, this combo is an acquired taste" };
  if (score <= 70) return { color: "#d97706", label: "Decent, add more flavour to help" };
  return { color: "#16a34a", label: "Tastes great" };
}

// ── Nutrition calculator ───────────────────────────────────────────────────

function calcNutrition(
  base: ProteinBase,
  flavors: FlavorOption[],
  addons: Addon[]
): NutritionFacts {
  const isWhey = base === "whey";
  const baseProtein  = isWhey ? 26 : 24;
  const baseCarbs    = isWhey ? 5  : 8;
  const baseFat      = isWhey ? 2  : 3;
  const baseSodium   = isWhey ? 150 : 180;
  const baseCalories = isWhey ? 145 : 150;
  const baseFiber    = isWhey ? 0  : 2;

  const flavorCarbs    = flavors.length * 1.5;
  const flavorSugar    = flavors.length * 1.0;
  const flavorCalories = flavors.length * 2;

  const extraCals    = addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.extraCalories ?? 0), 0);
  const extraProtein = addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.extraProtein  ?? 0), 0);
  const extraFiber   = addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.extraFiber    ?? 0), 0);
  const extraFat     = addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.extraFat      ?? 0), 0);
  const extraSodium  = addons.reduce((s, id) => s + (ADDONS.find(a => a.id === id)?.extraSodium   ?? 0), 0);

  const facts: NutritionFacts = {
    calories: Math.round(baseCalories + flavorCalories + extraCals),
    protein:  Math.round(baseProtein  + extraProtein),
    carbs:    Math.round(baseCarbs    + flavorCarbs),
    fat:      Math.round((baseFat     + extraFat) * 10) / 10,
    fiber:    Math.round(baseFiber    + extraFiber),
    sugar:    Math.round(flavorSugar),
    sodium:   baseSodium + extraSodium,
    addons: {
      collagen:    addons.includes("collagen")    ? 5     : undefined,
      vitaminC:    addons.includes("vitaminC")    ? 500   : undefined,
      vitaminDK2:  addons.includes("vitaminDK2")  ? true  : undefined,
      bComplex:    addons.includes("bComplex")    ? true  : undefined,
      electrolyte: addons.includes("electrolyte") ? true  : undefined,
      omega3:      addons.includes("omega3")      ? 500   : undefined,
      prebiotic:   addons.includes("prebiotic")   ? 3     : undefined,
      konjac:      addons.includes("konjac")      ? 1     : undefined,
      psyllium:    addons.includes("psyllium")    ? 2     : undefined,
      creatine:    addons.includes("creatine")    ? 3     : undefined,
      melatonin:   addons.includes("melatonin")   ? 1     : undefined,
    },
  };
  return facts;
}

// ── Component ─────────────────────────────────────────────────────────────

function fmtPrice(delta: number) {
  if (delta === 0) return "Included";
  return `+$${delta.toFixed(2)}`;
}

export default function ProductBuilder() {
  const [base, setBase]     = useState<ProteinBase>("whey");
  const [flavors, setFlavors] = useState<FlavorOption[]>(["vanilla"]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [added, setAdded]   = useState(false);

  const toggleFlavor = (f: FlavorOption) => {
    setFlavors((prev) => {
      if (prev.includes(f)) return prev.filter((x) => x !== f);
      if (prev.length >= 3) return prev;
      return [...prev, f];
    });
  };

  const toggleAddon = (a: Addon) =>
    setAddons((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);

  const nutrition = useMemo(() => calcNutrition(base, flavors, addons), [base, flavors, addons]);

  // Pricing
  const total = useMemo(() => {
    const addonTotal = addons.reduce((s, id) => s + (ADDON_PRICES[id] ?? 0), 0);
    return BASE_PRICE + PROTEIN_PRICES[base] + addonTotal;
  }, [base, addons]);

  // Taste
  const tasteScore = useMemo(() => calcTasteScore(addons), [addons]);
  const { color: tasteColor, label: tasteLabel } = tasteZone(tasteScore);

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
                className={`rounded-2xl border-2 p-5 text-left transition-all relative ${
                  base === b
                    ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/25"
                    : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                }`}
              >
                <div className="text-2xl mb-2">{b === "whey" ? "🥛" : "🌱"}</div>
                <p className="font-semibold capitalize mb-0.5">{b === "whey" ? "Whey Isolate" : "Plant-Based"}</p>
                <p className="text-xs text-[var(--color-ink-muted)] mb-2">
                  {b === "whey"
                    ? "26g protein, fast-absorbing, low lactose"
                    : "24g protein, pea + rice blend, vegan"}
                </p>
                <p className="text-xs font-semibold text-[var(--color-amber)]">
                  {PROTEIN_PRICES[b] === 0 ? "Included" : `+$${PROTEIN_PRICES[b].toFixed(2)}`}
                </p>
                {base === b && (
                  <span className="mt-2 inline-block text-xs text-[var(--color-amber)] font-semibold">
                    Selected
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
            Select up to 3 flavors. Each bottle is a blend of your picks.{" "}
            <span className="text-[var(--color-amber)] font-medium">{flavors.length}/3</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FLAVORS.map((fl) => {
              const selected  = flavors.includes(fl.id);
              const disabled  = !selected && flavors.length >= 3;
              return (
                <button
                  key={fl.id}
                  type="button"
                  onClick={() => toggleFlavor(fl.id)}
                  disabled={disabled}
                  className={`rounded-2xl border-2 p-4 text-center transition-all
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
                    style={{ background: fl.color, opacity: selected ? 1 : 0.3 }}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Add-ons 2-col grid */}
        <section>
          <h2 className="heading-display text-2xl mb-1">Functional Add-ons</h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-4">
            Layer in targeted ingredients. Each is clinically dosed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ADDONS.map((addon) => {
              const selected = addons.includes(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => toggleAddon(addon.id)}
                  className={`text-left rounded-2xl border-2 p-4 flex items-start gap-3 transition-all ${
                    selected
                      ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/25"
                      : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{addon.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold leading-tight">{addon.label}</p>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          selected
                            ? "border-[var(--color-amber)] bg-[var(--color-amber)]"
                            : "border-[var(--color-ink-muted)]/30"
                        }`}
                      >
                        {selected && (
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                            <path d="M1 3.5L3.8 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">{addon.benefit}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-[var(--color-ink-muted)]">{addon.dosage}</span>
                      <span className="text-xs font-semibold text-[var(--color-amber)]">
                        {fmtPrice(addon.price)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Taste harmony bar */}
        <section className="card-surface p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Taste Harmony</h3>
            <span className="text-sm font-bold" style={{ color: tasteColor }}>{tasteScore}/100</span>
          </div>
          <div className="h-2.5 bg-black/10 rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${tasteScore}%`, background: tasteColor }}
            />
          </div>
          <p className="text-xs font-medium" style={{ color: tasteColor }}>{tasteLabel}</p>
          {tasteScore < 60 && (
            <p className="text-xs text-[var(--color-ink-muted)] mt-2">
              Tip: adding Mango or Vanilla Bean flavor helps balance earthy or mineral notes.
            </p>
          )}
        </section>

        {/* CTA */}
        <div className="card-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--color-ink)]">
              {base === "whey" ? "Whey Isolate" : "Plant-Based"} bottle
            </p>
            <p className="text-sm text-[var(--color-ink-muted)]">
              {flavors.map((f) => FLAVORS.find((x) => x.id === f)?.label).join(", ")}
              {addons.length > 0 ? ` + ${addons.length} add-on${addons.length > 1 ? "s" : ""}` : ""}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className={`btn-primary shrink-0 transition-all duration-300 ${
              added ? "bg-green-600 hover:bg-green-600" : ""
            }`}
          >
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>

        <p className="text-xs text-[var(--color-ink-muted)] text-center">
          Shopify checkout coming soon. Prices shown are estimated in CAD.
        </p>
      </div>

      {/* ── Nutrition panel (desktop sticky, mobile compact) ── */}
      <div className="lg:col-span-1">
        <NutritionPanel facts={nutrition} total={total} />
      </div>
    </div>
  );
}
