"use client";

import { useState } from "react";
import type { NutritionFacts } from "@/lib/types";

// ── Daily values ─────────────────────────────────────────────────────────
const DV = {
  calories: 2000,
  protein:  50,
  carbs:    275,
  fat:      78,
  sodium:   2300,
  fiber:    28,
};

interface NutritionPanelProps {
  facts: NutritionFacts;
  total?: number; // CAD price subtotal
}

// ── Bar component ─────────────────────────────────────────────────────────
function DVBar({ value, dv, color }: { value: number; dv: number; color: string }) {
  const pct = Math.min(Math.round((value / dv) * 100), 100);
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs text-white/45 tabular-nums w-8 text-right shrink-0">{pct}%</span>
    </div>
  );
}

// ── Panel content (shared between desktop panel and mobile sheet) ─────────
function PanelContent({ facts }: { facts: NutritionFacts }) {
  return (
    <>
      {/* Calories */}
      <div className="border-b-8 border-white/20 pb-4 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-white/60">Calories</span>
          <span className="font-display text-4xl font-bold">{facts.calories}</span>
        </div>
        <DVBar value={facts.calories} dv={DV.calories} color="var(--color-amber)" />
      </div>

      {/* Macros */}
      <div className="space-y-3.5 border-b border-white/10 pb-4 mb-4">
        <p className="text-xs text-white/40 uppercase tracking-wider">Macros</p>

        {/* Protein */}
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold">Protein</span>
            <span className="text-sm font-bold text-[var(--color-amber)]">{facts.protein}g</span>
          </div>
          <DVBar value={facts.protein} dv={DV.protein} color="var(--color-amber)" />
        </div>

        {/* Carbs */}
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Total Carbohydrate</span>
            <span className="text-sm font-semibold">{facts.carbs}g</span>
          </div>
          <div className="ml-4 mt-1.5 space-y-0.5">
            <div className="flex justify-between items-baseline text-xs text-white/50">
              <span>Dietary Fiber</span>
              <span>{facts.fiber}g</span>
            </div>
            <div className="flex justify-between items-baseline text-xs text-white/50">
              <span>Total Sugars</span>
              <span>{facts.sugar}g</span>
            </div>
          </div>
          <DVBar value={facts.carbs} dv={DV.carbs} color="#6b9fd4" />
        </div>

        {/* Fat */}
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Total Fat</span>
            <span className="text-sm font-semibold">{facts.fat}g</span>
          </div>
          <DVBar value={facts.fat} dv={DV.fat} color="#a8d5a2" />
        </div>

        {/* Sodium */}
        <div>
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Sodium</span>
            <span className="text-sm font-semibold">{facts.sodium}mg</span>
          </div>
          <DVBar value={facts.sodium} dv={DV.sodium} color="#c4a2d4" />
        </div>
      </div>

      {/* Add-ons */}
      {Object.values(facts.addons).some((v) => v !== undefined) && (
        <div className="space-y-2 border-b border-white/10 pb-4 mb-4">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Add-ons</p>
          {facts.addons.collagen    && <AddonRow label="Collagen Peptides"  value="5g" />}
          {facts.addons.vitaminC    && <AddonRow label="Vitamin C"          value="500mg" />}
          {facts.addons.vitaminDK2  && <AddonRow label="Vitamin D3 + K2"   value="1000IU + 90mcg" />}
          {facts.addons.bComplex    && <AddonRow label="B-Complex"          value="Full spectrum" />}
          {facts.addons.electrolyte && <AddonRow label="Electrolyte Blend"  value="350mg" />}
          {facts.addons.omega3      && <AddonRow label="Omega-3 (Algae)"    value="500mg" />}
          {facts.addons.prebiotic   && <AddonRow label="Prebiotic Inulin"   value="3g" />}
          {facts.addons.konjac      && <AddonRow label="Konjac Glucomannan" value="1g" />}
          {facts.addons.psyllium    && <AddonRow label="Psyllium Husk"      value="2g" />}
          {facts.addons.creatine    && <AddonRow label="Creatine Monohydrate" value={`${facts.addons.creatine}g`} />}
          {facts.addons.melatonin   && <AddonRow label="Melatonin"          value={`${facts.addons.melatonin}mg`} />}
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-white/25 leading-relaxed">
        * Percent daily values based on a 2,000 kcal diet. Values are estimates for a 16 oz serving.
      </p>
    </>
  );
}

function AddonRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-white/70">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function NutritionPanel({ facts, total }: NutritionPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sticky panel ── */}
      <div className="nutrition-panel hidden lg:block bg-[var(--color-ink)] text-[var(--color-cream)] rounded-2xl p-6 sticky top-28">
        {/* Header with subtotal */}
        <div className="border-b border-white/20 pb-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-xl font-bold">Nutrition Facts</h3>
            {total !== undefined && (
              <span className="text-sm font-bold text-[var(--color-amber)]">
                ${total.toFixed(2)} CAD
              </span>
            )}
          </div>
          <p className="text-xs text-white/50">Per 16 oz bottle</p>
        </div>

        <PanelContent facts={facts} />
      </div>

      {/* ── Mobile compact bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        {/* Expanded sheet */}
        {mobileOpen && (
          <div className="nutrition-panel bg-[var(--color-ink)] text-[var(--color-cream)] px-5 pt-5 pb-4 max-h-[70vh] overflow-y-auto">
            <div className="border-b border-white/20 pb-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-xl font-bold">Nutrition Facts</h3>
                {total !== undefined && (
                  <span className="text-sm font-bold text-[var(--color-amber)]">
                    ${total.toFixed(2)} CAD
                  </span>
                )}
              </div>
              <p className="text-xs text-white/50">Per 16 oz bottle</p>
            </div>
            <PanelContent facts={facts} />
          </div>
        )}

        {/* Compact bar */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="w-full bg-[var(--color-ink)] text-[var(--color-cream)] px-5 py-3.5 flex items-center justify-between border-t border-white/10"
        >
          <div className="flex items-center gap-4 text-sm">
            <span>
              <span className="font-bold text-white">{facts.calories}</span>
              <span className="text-white/60 ml-1">cal</span>
            </span>
            <span>
              <span className="font-bold">{facts.protein}g</span>
              <span className="text-white/60 ml-1">protein</span>
            </span>
            {total !== undefined && (
              <span className="font-bold text-white">${total.toFixed(2)}</span>
            )}
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`transition-transform duration-200 ${mobileOpen ? "rotate-180" : ""}`}
          >
            <path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Spacer so builder content isn't hidden behind mobile bar */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
