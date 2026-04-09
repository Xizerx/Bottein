"use client";

import { useReducer, useState, useEffect, useRef } from "react";
import Link from "next/link";
import QuizStep, { OptionTile } from "@/components/QuizStep";
import type {
  QuizAnswers,
  Goal,
  ProteinBase,
  Sweetener,
  FlavorOption,
  ActivityLevel,
  Addon,
  StoredQuizResult,
} from "@/lib/types";

// ── State ──────────────────────────────────────────────────────────────────

const initialAnswers: QuizAnswers = {
  goals: [],
  proteinBase: null,
  allergies: [],
  sweetener: null,
  flavors: [],
  age: null,
  height: null,
  weight: null,
  activityLevel: null,
};

type QuizAction =
  | { type: "TOGGLE_GOAL"; goal: Goal }
  | { type: "SET_PROTEIN"; base: ProteinBase }
  | { type: "TOGGLE_ALLERGY"; allergy: string }
  | { type: "SET_SWEETENER"; sweetener: Sweetener }
  | { type: "TOGGLE_FLAVOR"; flavor: FlavorOption }
  | { type: "SET_AGE"; age: string }
  | { type: "SET_HEIGHT"; height: string }
  | { type: "SET_WEIGHT"; weight: string }
  | { type: "SET_ACTIVITY"; level: ActivityLevel };

function quizReducer(state: QuizAnswers, action: QuizAction): QuizAnswers {
  switch (action.type) {
    case "TOGGLE_GOAL":
      return {
        ...state,
        goals: state.goals.includes(action.goal)
          ? state.goals.filter((g) => g !== action.goal)
          : [...state.goals, action.goal],
      };
    case "SET_PROTEIN":
      return { ...state, proteinBase: action.base };
    case "TOGGLE_ALLERGY":
      return {
        ...state,
        allergies: state.allergies.includes(action.allergy)
          ? state.allergies.filter((a) => a !== action.allergy)
          : [...state.allergies, action.allergy],
      };
    case "SET_SWEETENER":
      return { ...state, sweetener: action.sweetener };
    case "TOGGLE_FLAVOR":
      if (state.flavors.includes(action.flavor)) {
        return { ...state, flavors: state.flavors.filter((f) => f !== action.flavor) };
      }
      if (state.flavors.length >= 3) return state;
      return { ...state, flavors: [...state.flavors, action.flavor] };
    case "SET_AGE":
      return { ...state, age: action.age };
    case "SET_HEIGHT":
      return { ...state, height: action.height };
    case "SET_WEIGHT":
      return { ...state, weight: action.weight };
    case "SET_ACTIVITY":
      return { ...state, activityLevel: action.level };
    default:
      return state;
  }
}

// ── Data ───────────────────────────────────────────────────────────────────

const GOALS: { id: Goal; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    id: "weight_loss",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 4 6 4 10c0 5 6 10 8 12 2-2 8-7 8-12 0-4-4-8-8-8z" />
        <path d="M12 6c-1.5 0-3 1.5-3 3" />
      </svg>
    ),
    label: "Appetite Control",
    desc: "Feel fuller, manage cravings",
  },
  { id: "focus",    icon: "🎯", label: "Focus and Cognition",  desc: "Sharpen mental clarity and sustained attention" },
  { id: "sleep",    icon: "🌙", label: "Sleep and Recovery",   desc: "Wind down faster, wake up restored" },
  { id: "fitness",  icon: "💪", label: "Fitness and Strength", desc: "Build muscle, improve endurance" },
  { id: "skincare", icon: "✨", label: "Skin and Beauty",      desc: "Collagen, hydration, glow from within" },
  { id: "wellness", icon: "🌿", label: "General Wellness",     desc: "Balanced daily nutrition foundation" },
];

const SWEETENERS: {
  id: Sweetener;
  label: string;
  subtitle: string;
  badge: string;
}[] = [
  {
    id: "full_bodied",
    label: "Full Bodied",
    subtitle: "Cane sugar forward — maximum flavour, the way it was meant to taste",
    badge: "+~4g sugar per serving",
  },
  {
    id: "slim",
    label: "Slim",
    subtitle: "Cane sugar and natural substitutes — great taste, fewer calories",
    badge: "+~2g sugar per serving",
  },
  {
    id: "lean",
    label: "Lean",
    subtitle: "Natural substitutes only — monk fruit and stevia, zero added sugar",
    badge: "0g added sugar",
  },
];

const FLAVORS: { id: FlavorOption; icon: string; label: string }[] = [
  { id: "mango",      icon: "🥭", label: "Mango" },
  { id: "strawberry", icon: "🍓", label: "Strawberry" },
  { id: "blueberry",  icon: "🫐", label: "Blueberry" },
  { id: "matcha",     icon: "🍵", label: "Matcha" },
  { id: "vanilla",    icon: "🤍", label: "Vanilla Bean" },
  { id: "chocolate",  icon: "🍫", label: "Dark Chocolate" },
];

const ACTIVITIES: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: "sedentary",  label: "Sedentary",   desc: "Mostly desk work, minimal exercise" },
  { id: "light",      label: "Light",        desc: "1-3 workouts per week" },
  { id: "moderate",   label: "Moderate",     desc: "3-5 workouts per week" },
  { id: "active",     label: "Active",       desc: "Daily movement, intense training" },
  { id: "very_active",label: "Very Active",  desc: "Athlete or physical profession" },
];

const ALLERGIES = ["Dairy", "Gluten", "Soy", "Tree Nuts", "Eggs"];

const AGE_OPTIONS    = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
const HEIGHT_OPTIONS_IMPERIAL = ["Under 5'0\"", "5'0\" - 5'3\"", "5'4\" - 5'7\"", "5'8\" - 5'11\"", "6'0\" - 6'3\"", "Over 6'3\""];
const HEIGHT_OPTIONS_METRIC   = ["Under 152 cm", "152-160 cm", "161-170 cm", "171-180 cm", "181-191 cm", "Over 191 cm"];
const WEIGHT_OPTIONS_IMPERIAL = ["Under 110 lbs", "110-130 lbs", "131-155 lbs", "156-180 lbs", "181-210 lbs", "Over 210 lbs"];
const WEIGHT_OPTIONS_METRIC   = ["Under 50 kg", "50-59 kg", "60-70 kg", "71-82 kg", "83-95 kg", "Over 95 kg"];

// ── Helpers ────────────────────────────────────────────────────────────────

// Internal goal → sweetener tag mapping:
//   weight_loss  = WEIGHT_LOSS
//   wellness     = GENERAL_WELLNESS
//   skincare     = SKIN_BEAUTY
//   fitness      = FITNESS_STRENGTH
//   focus        = FOCUS_COGNITION
//   sleep        = SLEEP_RECOVERY

function getSweetenerRecommendation(goals: Goal[]): { sweetener: Sweetener; message: string } {
  // Step 1 — Appetite Control conflicts with taste-first goals
  if (goals.includes("weight_loss") && (goals.includes("wellness") || goals.includes("skincare"))) {
    return {
      sweetener: "slim",
      message: "Based on your mix of goals, we recommend Slim — a balanced middle ground between great taste and calorie control.",
    };
  }
  // Step 2 — Appetite Control alone or dominant
  if (goals.includes("weight_loss") && !goals.includes("wellness") && !goals.includes("skincare")) {
    return {
      sweetener: "lean",
      message: "Based on your goals, we recommend Lean — natural substitutes keep calories down without sacrificing drinkability.",
    };
  }
  // Step 3 — Taste-first goals (no appetite control)
  if ((goals.includes("wellness") || goals.includes("skincare")) && !goals.includes("weight_loss")) {
    return {
      sweetener: "full_bodied",
      message: "Based on your goals, we recommend Full Bodied — made to taste as good as it is good for you.",
    };
  }
  // Step 4 — Performance / cognitive / sleep goals only
  if (goals.includes("fitness") || goals.includes("focus") || goals.includes("sleep")) {
    return {
      sweetener: "slim",
      message: "Based on your goals, we recommend Slim — the right balance for performance without the sugar load.",
    };
  }
  // Step 5 — Fallback
  return {
    sweetener: "slim",
    message: "Based on your goals, we recommend Slim — a great all-rounder.",
  };
}

function generateAutoAddons(goals: Goal[]): Addon[] {
  // Auto-checked in builder: weight-loss and sleep goals only.
  // Skincare → collagen is handled as a "Recommended for you" badge (not force-checked).
  const addons: Addon[] = [];
  if (goals.includes("weight_loss")) addons.push("konjac", "psyllium");
  if (goals.includes("sleep"))       addons.push("melatonin");
  return addons;
}

function generateRecommendedAddons(goals: Goal[]): Addon[] {
  // Shown with "Recommended for you" badge in builder, but not pre-checked.
  const recs: Addon[] = [];
  if (goals.includes("skincare")) recs.push("collagen");
  return recs;
}

function generateFormula(answers: QuizAnswers) {
  const addonLabels: string[] = [];
  if (answers.goals.includes("weight_loss")) addonLabels.push("Konjac Glucomannan (1g)", "Psyllium Husk (2g)");
  if (answers.goals.includes("focus"))       addonLabels.push("Lion's Mane Extract");
  if (answers.goals.includes("sleep"))       addonLabels.push("Melatonin (1mg)");
  if (answers.goals.includes("fitness"))     addonLabels.push("Creatine Monohydrate (3g)");
  if (answers.goals.includes("skincare"))    addonLabels.push("Collagen Peptides (5g)", "Vitamin C (500mg)");
  if (answers.goals.includes("wellness"))    addonLabels.push("Vitamin D3+K2");
  const protein  = answers.proteinBase === "plant" ? "Pea + Rice Blend" : "Whey Isolate";
  const calories = answers.proteinBase === "plant" ? 160 : 151;
  const proteinG = (answers.activityLevel === "very_active" || answers.activityLevel === "active") ? 30 : 26;
  return { protein, addonLabels, calories, proteinG };
}

function wheyDisabledReason(allergies: string[]): string | null {
  return allergies.includes("Dairy") ? "Contains dairy" : null;
}
function plantDisabledReason(allergies: string[]): string | null {
  return allergies.includes("Soy") ? "May contain soy" : null;
}

// ── Select helper ──────────────────────────────────────────────────────────

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6460' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`;

function QuizSelect({ label, value, options, onChange, placeholder }: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-ink)] mb-2 uppercase tracking-wide">{label}</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber)]/20 transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: CHEVRON, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
      >
        <option value="" disabled>{placeholder ?? `Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

// Steps 1-5 show progress bars; step 6 shows results (no progress)
const TOTAL_STEPS = 5;

export default function QuizPage() {
  const [step, setStep]     = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, dispatch] = useReducer(quizReducer, initialAnswers);
  const [animating, setAnimating] = useState(false);
  const [toast, setToast]   = useState<string | null>(null);
  const [heightUnit, setHeightUnit] = useState<"imperial" | "metric">("imperial");
  const [weightUnit, setWeightUnit] = useState<"imperial" | "metric">("imperial");
  const [recMessage, setRecMessage] = useState<string | null>(null);
  const [sweetenerManuallyOverridden, setSweetenerManuallyOverridden] = useState(false);
  // Tracks the goals state that was last used to compute the sweetener recommendation.
  // Uses a ref so changes don't trigger re-renders.
  const goalsHashRef = useRef<string>("");

  // ── recomputeFromGoals ──────────────────────────────────────────────────
  // Single source of truth for all goal-derived state. Call this whenever
  // goals change (on Continue from step 1, or when a later step detects
  // stale goals via goalsHashRef). All subsequent steps read exclusively
  // from the state updated here — no per-step independent copies.
  //
  // Reactive pattern:
  //   1. getSweetenerRecommendation → always called fresh, never cached.
  //   2. sweetenerManuallyOverridden is always reset when goals change
  //      (goal changes are material; user intent no longer applies).
  //   3. autoAddons / recommendedAddons are derived from scratch each call.
  //   4. Protein allergy-lock is re-validated (handled in dispatchWithAllergyCheck).
  //   5. localStorage is written on step 6 after all answers are collected.
  function recomputeFromGoals(goals: Goal[]) {
    const { sweetener, message } = getSweetenerRecommendation(goals);
    setSweetenerManuallyOverridden(false);
    setRecMessage(message);
    dispatch({ type: "SET_SWEETENER", sweetener });
    goalsHashRef.current = JSON.stringify(goals);
  }

  // Detect goals changes when navigating between steps (e.g. back to step 1,
  // change goals, continue forward). Only recomputes when the hash has changed.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (step <= 1) return;
    const hash = JSON.stringify(answers.goals);
    if (hash !== goalsHashRef.current) {
      recomputeFromGoals(answers.goals);
    }
  }, [step]);

  // Save to localStorage when results are reached
  useEffect(() => {
    if (step !== 6) return;
    const result: StoredQuizResult = {
      goals:         answers.goals,
      proteinBase:   answers.proteinBase,
      allergies:     answers.allergies,
      sweetener:     answers.sweetener,
      flavors:       answers.flavors,
      age:           answers.age,
      height:        answers.height,
      weight:        answers.weight,
      activityLevel: answers.activityLevel,
      autoAddons:        generateAutoAddons(answers.goals),
      recommendedAddons: generateRecommendedAddons(answers.goals),
      timestamp:         Date.now(),
    };
    try { localStorage.setItem("bottein_quiz_result", JSON.stringify(result)); } catch {}
  }, [step]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  function dispatchWithAllergyCheck(action: QuizAction) {
    // Allergies and protein are now shown together on the same step so the user
    // can see and resolve any conflict themselves. We no longer auto-switch the
    // protein — the inline error in the UI explains the conflict, and canProceed
    // blocks advancement until it is resolved.
    dispatch(action);
  }

  function goTo(next: number) {
    if (animating) return;
    setDirection(next > step ? "forward" : "back");
    setAnimating(true);
    setTimeout(() => { setStep(next); setAnimating(false); }, 250);
  }

  const canProceed = (): boolean => {
    if (step === 1) return answers.goals.length > 0;
    if (step === 2) return answers.activityLevel !== null;   // health factors
    if (step === 3) {                                        // protein + allergies
      if (answers.proteinBase === null) return false;
      if (answers.proteinBase === "whey"  && answers.allergies.includes("Dairy")) return false;
      if (answers.proteinBase === "plant" && answers.allergies.includes("Soy"))   return false;
      return true;
    }
    if (step === 4) return answers.sweetener !== null;       // sweetener
    if (step === 5) return answers.flavors.length > 0;       // flavors
    return true;
  };

  // Inline conflict message shown inside the protein step.
  const allergyConflictMsg: string | null =
    answers.proteinBase === "whey"  && answers.allergies.includes("Dairy")
      ? "Whey Isolate contains dairy. Switch to Plant-Based or remove the Dairy restriction to continue."
      : answers.proteinBase === "plant" && answers.allergies.includes("Soy")
      ? "Plant-Based may contain soy. Switch to Whey Isolate or remove the Soy restriction to continue."
      : null;

  const formula       = generateFormula(answers);
  const wheyReason    = wheyDisabledReason(answers.allergies);
  const plantReason   = plantDisabledReason(answers.allergies);
  const hasTreeNutsOrEggs = answers.allergies.includes("Tree Nuts") || answers.allergies.includes("Eggs");
  const hasGluten     = answers.allergies.includes("Gluten");
  const heightOptions = heightUnit === "imperial" ? HEIGHT_OPTIONS_IMPERIAL : HEIGHT_OPTIONS_METRIC;
  const weightOptions = weightUnit === "imperial" ? WEIGHT_OPTIONS_IMPERIAL : WEIGHT_OPTIONS_METRIC;

  const unitToggleClass = (active: boolean) =>
    `px-3 py-1 transition-colors ${active ? "bg-[var(--color-ink)] text-[var(--color-cream)]" : "text-[var(--color-ink-muted)]"}`;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-32 pb-16">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-ink)] text-[var(--color-cream)] text-sm px-5 py-3 rounded-xl shadow-lg max-w-sm text-center">
          {toast}
        </div>
      )}

      <div className="container-site max-w-2xl">
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating ? (direction === "forward" ? "translateX(20px)" : "translateX(-20px)") : "translateX(0)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >

          {/* ── Step 1: Goals ── */}
          {step === 1 && (
            <QuizStep stepNumber={1} totalSteps={TOTAL_STEPS} title="What are you optimizing for?" subtitle="Select all that apply. We'll tailor your formula to match.">
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((goal) => (
                  <OptionTile
                    key={goal.id}
                    selected={answers.goals.includes(goal.id)}
                    onClick={() => dispatch({ type: "TOGGLE_GOAL", goal: goal.id })}
                    iconNode={typeof goal.icon !== "string" ? goal.icon : undefined}
                    icon={typeof goal.icon === "string" ? goal.icon : undefined}
                    label={goal.label}
                    description={goal.desc}
                    multiSelect
                  />
                ))}
              </div>
            </QuizStep>
          )}

          {/* ── Step 2: Health factors (moved from step 5) ── */}
          {step === 2 && (
            <QuizStep stepNumber={2} totalSteps={TOTAL_STEPS} title="A few quick health factors" subtitle="Used only to calibrate your dosing. Never shared.">
              <div className="space-y-5">
                <QuizSelect label="Age" value={answers.age} options={AGE_OPTIONS} onChange={(v) => dispatch({ type: "SET_AGE", age: v })} placeholder="Select age range" />

                {/* Height with unit toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide">Height</label>
                    <div className="flex rounded-full border border-[var(--color-ink)]/10 overflow-hidden text-xs">
                      <button type="button" onClick={() => setHeightUnit("imperial")} className={unitToggleClass(heightUnit === "imperial")}>ft/in</button>
                      <button type="button" onClick={() => setHeightUnit("metric")}   className={unitToggleClass(heightUnit === "metric")}>cm</button>
                    </div>
                  </div>
                  <select value={answers.height ?? ""} onChange={(e) => dispatch({ type: "SET_HEIGHT", height: e.target.value })}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber)]/20 transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: CHEVRON, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                    <option value="" disabled>Select height range</option>
                    {heightOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                {/* Weight with unit toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide">Weight</label>
                    <div className="flex rounded-full border border-[var(--color-ink)]/10 overflow-hidden text-xs">
                      <button type="button" onClick={() => setWeightUnit("imperial")} className={unitToggleClass(weightUnit === "imperial")}>lbs</button>
                      <button type="button" onClick={() => setWeightUnit("metric")}   className={unitToggleClass(weightUnit === "metric")}>kg</button>
                    </div>
                  </div>
                  <select value={answers.weight ?? ""} onChange={(e) => dispatch({ type: "SET_WEIGHT", weight: e.target.value })}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber)]/20 transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: CHEVRON, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                    <option value="" disabled>Select weight range</option>
                    {weightOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[var(--color-ink)] mb-3 uppercase tracking-wide">Activity Level</p>
                  <div className="space-y-2">
                    {ACTIVITIES.map((act) => (
                      <OptionTile key={act.id} selected={answers.activityLevel === act.id}
                        onClick={() => dispatch({ type: "SET_ACTIVITY", level: act.id })}
                        label={act.label} description={act.desc} />
                    ))}
                  </div>
                </div>
              </div>
            </QuizStep>
          )}

          {/* ── Step 4: Sweetener ── */}
          {step === 4 && (
            <QuizStep stepNumber={4} totalSteps={TOTAL_STEPS} title="How would you like it sweetened?" subtitle="We always use natural sweeteners. Pick your preferred balance.">
              {recMessage && !sweetenerManuallyOverridden && (
                <p className="text-xs text-[var(--color-amber)] font-medium mb-4 bg-[var(--color-amber-light)]/40 px-3 py-2 rounded-xl">
                  {recMessage}
                </p>
              )}
              <div className="grid grid-cols-1 gap-3">
                {SWEETENERS.map((sw) => (
                  <button
                    key={sw.id}
                    type="button"
                    onClick={() => {
                      setSweetenerManuallyOverridden(true);
                      setRecMessage(null);
                      dispatch({ type: "SET_SWEETENER", sweetener: sw.id });
                    }}
                    className={`text-left rounded-2xl border-2 p-5 transition-all ${answers.sweetener === sw.id ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30" : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm mb-0.5">{sw.label}</p>
                        <p className="text-xs text-[var(--color-ink-muted)]">{sw.subtitle}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-semibold bg-[var(--color-surface)] border border-[var(--color-ink)]/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {sw.badge}
                        </span>
                        {answers.sweetener === sw.id && (
                          <span className="text-xs text-[var(--color-amber)] font-semibold">Selected</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </QuizStep>
          )}

          {/* ── Step 5: Flavors ── */}
          {step === 5 && (
            <QuizStep stepNumber={5} totalSteps={TOTAL_STEPS} title="Pick your flavors" subtitle={`Select up to 3. You'll get a blend of all chosen flavors in every bottle. (${answers.flavors.length}/3 selected)`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FLAVORS.map((fl) => (
                  <button key={fl.id} type="button"
                    onClick={() => dispatch({ type: "TOGGLE_FLAVOR", flavor: fl.id })}
                    disabled={!answers.flavors.includes(fl.id) && answers.flavors.length >= 3}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all text-center p-4 ${answers.flavors.includes(fl.id) ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30" : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"} disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <span className="text-3xl">{fl.icon}</span>
                    <span className="text-xs font-semibold">{fl.label}</span>
                    {answers.flavors.includes(fl.id) && <span className="text-[var(--color-amber)] text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </QuizStep>
          )}

          {/* ── Step 3: Protein + Allergies ── */}
          {step === 3 && (
            <QuizStep stepNumber={3} totalSteps={TOTAL_STEPS} title="Choose your protein base" subtitle="Pick the foundation of your formula. Both are complete amino acid profiles.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                {/* Whey Isolate — left */}
                <button
                  type="button"
                  onClick={() => !wheyReason && dispatch({ type: "SET_PROTEIN", base: "whey" })}
                  disabled={!!wheyReason}
                  className={`text-left rounded-2xl border-2 p-5 transition-all ${answers.proteinBase === "whey" ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30" : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-2xl mb-2">🥛</div>
                  <p className="font-semibold mb-0.5">Whey Isolate</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Fast-absorbing, minimal lactose. Ideal for post-workout recovery.</p>
                  {hasTreeNutsOrEggs && !wheyReason && <span className="mt-2 inline-block text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Allergen-free</span>}
                  {wheyReason && <span className="mt-2 inline-block text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">{wheyReason}</span>}
                  {hasGluten && <span className="mt-2 inline-block text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full ml-1">Check for gluten traces</span>}
                  {answers.proteinBase === "whey" && <span className="mt-2 block text-xs text-[var(--color-amber)] font-semibold">Selected</span>}
                </button>

                {/* Plant-Based — right */}
                <button
                  type="button"
                  onClick={() => !plantReason && dispatch({ type: "SET_PROTEIN", base: "plant" })}
                  disabled={!!plantReason}
                  className={`text-left rounded-2xl border-2 p-5 transition-all ${answers.proteinBase === "plant" ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30" : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-2xl mb-2">🌱</div>
                  <p className="font-semibold mb-0.5">Plant-Based</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Pea + rice blend. Vegan, dairy-free, complete amino profile.</p>
                  {hasTreeNutsOrEggs && !plantReason && <span className="mt-2 inline-block text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">Allergen-free</span>}
                  {plantReason && <span className="mt-2 inline-block text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">{plantReason}</span>}
                  {answers.proteinBase === "plant" && <span className="mt-2 block text-xs text-[var(--color-amber)] font-semibold">Selected</span>}
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                  Any allergies or restrictions?
                  <span className="text-[var(--color-ink-muted)] font-normal ml-1">(optional)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALLERGIES.map((allergy) => (
                    <button key={allergy} type="button"
                      onClick={() => dispatchWithAllergyCheck({ type: "TOGGLE_ALLERGY", allergy })}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${answers.allergies.includes(allergy) ? "border-[var(--color-amber)] bg-[var(--color-amber-light)] text-[var(--color-ink)] font-medium" : "border-[var(--color-ink)]/15 text-[var(--color-ink-muted)] hover:border-[var(--color-amber-light)]"}`}
                    >{allergy}</button>
                  ))}
                </div>
              </div>

              {/* Allergy / protein conflict — blocks Continue until resolved */}
              {allergyConflictMsg && (
                <div className="mt-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-red-500">
                    <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
                  </svg>
                  <p className="text-sm text-red-700 leading-snug">{allergyConflictMsg}</p>
                </div>
              )}
            </QuizStep>
          )}

          {/* ── Step 6: Results (was 5) ── */}
          {step === 6 && (
            <div>
              <div className="mb-8">
                <p className="section-label mb-3">Your Formula</p>
                <h2 className="heading-display text-4xl mb-2">We built your blend.</h2>
                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                  Based on your answers, here&apos;s the formula we&apos;ve assembled. Customize it further in the Builder.
                </p>
              </div>

              <div className="card-surface p-7 rounded-2xl mb-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start py-3 border-b border-black/6">
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Goals</p>
                      <p className="text-sm font-semibold capitalize">
                        {answers.goals.map((g) => GOALS.find((x) => x.id === g)?.label).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start py-3 border-b border-black/6">
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Base Protein</p>
                      <p className="text-sm font-semibold">{formula.protein}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Protein per bottle</p>
                      <p className="text-sm font-semibold">{formula.proteinG}g</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start py-3 border-b border-black/6">
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Sweetener</p>
                      <p className="text-sm font-semibold">{SWEETENERS.find((s) => s.id === answers.sweetener)?.label ?? "Not selected"}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-start py-3 border-b border-black/6">
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Flavors</p>
                      <p className="text-sm font-semibold capitalize">
                        {answers.flavors.map((f) => FLAVORS.find((x) => x.id === f)?.label).join(", ")}
                      </p>
                    </div>
                  </div>
                  {formula.addonLabels.length > 0 && (
                    <div className="py-3 border-b border-black/6">
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-2">Functional Add-ons</p>
                      <div className="flex flex-wrap gap-2">
                        {formula.addonLabels.map((addon) => (
                          <span key={addon} className="text-xs bg-[var(--color-amber-light)] text-[var(--color-ink)] px-3 py-1 rounded-full font-medium">{addon}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="pt-2 flex justify-between items-center">
                    <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">Est. Calories per bottle</p>
                    <p className="font-display text-2xl font-bold text-[var(--color-amber)]">{formula.calories} kcal</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 text-center">Retake Quiz</button>
                <Link href="/builder?from=quiz" className="btn-primary flex-1 text-center">Customize in Builder</Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons — shown for steps 1-5 */}
        {step < 6 && (
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-black/8">
            <button onClick={() => goTo(step - 1)} disabled={step === 1}
              className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <button
              onClick={() => {
                if (step === 1) recomputeFromGoals(answers.goals);
                goTo(step + 1);
              }}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm">
              {step === 5 ? "See My Formula" : "Continue"}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
