"use client";

import type { NutritionFacts } from "@/lib/types";

interface NutritionPanelProps {
  facts: NutritionFacts;
  servingSize: number;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-1.5 bg-black/10 rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export default function NutritionPanel({ facts, servingSize }: NutritionPanelProps) {
  return (
    <div className="bg-[var(--color-ink)] text-[var(--color-cream)] rounded-2xl p-6 sticky top-24">
      {/* Header */}
      <div className="border-b border-white/20 pb-4 mb-4">
        <h3 className="font-display text-xl font-bold">Nutrition Facts</h3>
        <p className="text-xs text-white/50 mt-0.5">Per serving ({servingSize}g)</p>
      </div>

      {/* Calories */}
      <div className="border-b-8 border-white/20 pb-4 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-white/60">Calories</span>
          <span className="font-display text-4xl font-bold">{facts.calories}</span>
        </div>
      </div>

      {/* Macros */}
      <div className="space-y-3 border-b border-white/10 pb-4 mb-4">
        <p className="text-xs text-white/40 uppercase tracking-wider">Macros</p>

        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold">Protein</span>
            <span className="text-sm font-bold text-[var(--color-amber)]">{facts.protein}g</span>
          </div>
          <Bar value={facts.protein} max={40} color="var(--color-amber)" />
        </div>

        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Total Carbohydrate</span>
            <span className="text-sm font-semibold">{facts.carbs}g</span>
          </div>
          <div className="ml-4 mt-1.5">
            <div className="flex justify-between items-baseline text-xs text-white/50">
              <span>Dietary Fiber</span>
              <span>{facts.fiber}g</span>
            </div>
            <div className="flex justify-between items-baseline text-xs text-white/50 mt-0.5">
              <span>Total Sugars</span>
              <span>{facts.sugar}g</span>
            </div>
          </div>
          <Bar value={facts.carbs} max={30} color="#6b9fd4" />
        </div>

        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Total Fat</span>
            <span className="text-sm font-semibold">{facts.fat}g</span>
          </div>
          <Bar value={facts.fat} max={15} color="#a8d5a2" />
        </div>

        <div className="flex justify-between items-baseline text-xs text-white/50">
          <span>Sodium</span>
          <span>{facts.sodium}mg</span>
        </div>
      </div>

      {/* Add-ons */}
      {Object.keys(facts.addons).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Add-ons</p>
          {facts.addons.creatine && (
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Creatine Monohydrate</span>
              <span className="font-medium">{facts.addons.creatine}g</span>
            </div>
          )}
          {facts.addons.collagen && (
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Collagen Peptides</span>
              <span className="font-medium">{facts.addons.collagen}g</span>
            </div>
          )}
          {facts.addons.ashwagandha && (
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Ashwagandha Extract</span>
              <span className="font-medium">{facts.addons.ashwagandha}mg</span>
            </div>
          )}
          {facts.addons.melatonin && (
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Melatonin</span>
              <span className="font-medium">{facts.addons.melatonin}mg</span>
            </div>
          )}
          {facts.addons.vitaminD && (
            <div className="flex justify-between text-xs">
              <span className="text-white/70">Vitamin D3</span>
              <span className="font-medium">{facts.addons.vitaminD} IU</span>
            </div>
          )}
        </div>
      )}

      {/* Daily value note */}
      <p className="text-xs text-white/25 mt-5 leading-relaxed">
        * Percent Daily Values are based on a 2,000 calorie diet.
        Nutritional values are estimates and may vary.
      </p>
    </div>
  );
}
