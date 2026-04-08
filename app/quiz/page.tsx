"use client";

import { useReducer, useState, useEffect } from "react";
import Link from "next/link";
import QuizStep, { OptionTile } from "@/components/QuizStep";
import type { QuizAnswers, Goal, ProteinBase, FlavorOption, ActivityLevel } from "@/lib/types";

// ── State ──────────────────────────────────────────────────────────────────

const initialAnswers: QuizAnswers = {
  goals: [],
  proteinBase: null,
  allergies: [],
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
  { id: "focus", icon: "🎯", label: "Focus and Cognition", desc: "Sharpen mental clarity and sustained attention" },
  { id: "sleep", icon: "🌙", label: "Sleep and Recovery", desc: "Wind down faster, wake up restored" },
  { id: "fitness", icon: "💪", label: "Fitness and Strength", desc: "Build muscle, improve endurance" },
  { id: "skincare", icon: "✨", label: "Skin and Beauty", desc: "Collagen, hydration, glow from within" },
  { id: "wellness", icon: "🌿", label: "General Wellness", desc: "Balanced daily nutrition foundation" },
];

const FLAVORS: { id: FlavorOption; icon: string; label: string }[] = [
  { id: "mango", icon: "🥭", label: "Mango" },
  { id: "strawberry", icon: "🍓", label: "Strawberry" },
  { id: "blueberry", icon: "🫐", label: "Blueberry" },
  { id: "matcha", icon: "🍵", label: "Matcha" },
  { id: "vanilla", icon: "🤍", label: "Vanilla Bean" },
  { id: "chocolate", icon: "🍫", label: "Dark Chocolate" },
];

const ACTIVITIES: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: "sedentary", label: "Sedentary", desc: "Mostly desk work, minimal exercise" },
  { id: "light", label: "Light", desc: "1-3 workouts per week" },
  { id: "moderate", label: "Moderate", desc: "3-5 workouts per week" },
  { id: "active", label: "Active", desc: "Daily movement, intense training" },
  { id: "very_active", label: "Very Active", desc: "Athlete or physical profession" },
];

const ALLERGIES = ["Dairy", "Gluten", "Soy", "Tree Nuts", "Eggs"];

const AGE_OPTIONS = [
  "Under 18",
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
];

const HEIGHT_OPTIONS_IMPERIAL = [
  "Under 5'0\"",
  "5'0\" - 5'3\"",
  "5'4\" - 5'7\"",
  "5'8\" - 5'11\"",
  "6'0\" - 6'3\"",
  "Over 6'3\"",
];
const HEIGHT_OPTIONS_METRIC = [
  "Under 152 cm",
  "152-160 cm",
  "161-170 cm",
  "171-180 cm",
  "181-191 cm",
  "Over 191 cm",
];

const WEIGHT_OPTIONS_IMPERIAL = [
  "Under 110 lbs",
  "110-130 lbs",
  "131-155 lbs",
  "156-180 lbs",
  "181-210 lbs",
  "Over 210 lbs",
];
const WEIGHT_OPTIONS_METRIC = [
  "Under 50 kg",
  "50-59 kg",
  "60-70 kg",
  "71-82 kg",
  "83-95 kg",
  "Over 95 kg",
];

// ── Formula generation ─────────────────────────────────────────────────────

function generateFormula(answers: QuizAnswers) {
  const addons: string[] = [];
  if (answers.goals.includes("weight_loss")) {
    addons.push("Konjac Glucomannan (1g)", "Psyllium Husk (2g)");
  }
  if (answers.goals.includes("focus")) addons.push("Lion's Mane Extract");
  if (answers.goals.includes("sleep")) addons.push("Melatonin (1mg)");
  if (answers.goals.includes("fitness")) addons.push("Creatine Monohydrate (3g)");
  if (answers.goals.includes("skincare")) addons.push("Collagen Peptides (5g)", "Vitamin C (500mg)");
  if (answers.goals.includes("wellness")) addons.push("Vitamin D3+K2");

  const protein = answers.proteinBase === "plant" ? "Pea + Rice Blend" : "Whey Isolate";
  const calories = answers.proteinBase === "plant" ? 160 : 151;
  const proteinG = answers.activityLevel === "very_active" || answers.activityLevel === "active" ? 30 : 26;

  return { protein, addons, calories, proteinG };
}

// ── Allergy check helpers ──────────────────────────────────────────────────

function wheyDisabledReason(allergies: string[]): string | null {
  if (allergies.includes("Dairy")) return "Contains dairy";
  return null;
}

function plantDisabledReason(allergies: string[]): string | null {
  if (allergies.includes("Soy")) return "May contain soy";
  return null;
}

// ── Select component ───────────────────────────────────────────────────────

function QuizSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--color-ink)] mb-2 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber)]/20 transition-colors appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6460' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
      >
        <option value="" disabled>{placeholder ?? `Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, dispatch] = useReducer(quizReducer, initialAnswers);
  const [animating, setAnimating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [heightUnit, setHeightUnit] = useState<"imperial" | "metric">("imperial");
  const [weightUnit, setWeightUnit] = useState<"imperial" | "metric">("imperial");

  // Show toast
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  }

  // Allergy-aware dispatch
  function dispatchWithAllergyCheck(action: QuizAction) {
    if (action.type === "TOGGLE_ALLERGY") {
      const wouldAdd = !answers.allergies.includes(action.allergy);

      if (wouldAdd) {
        if (action.allergy === "Dairy" && answers.proteinBase === "whey") {
          const plantOk = !answers.allergies.includes("Soy");
          if (plantOk) {
            dispatch(action);
            dispatch({ type: "SET_PROTEIN", base: "plant" });
            showToast("We switched your protein base to Plant-Based due to your dairy allergy selection.");
            return;
          }
        }
        if (action.allergy === "Soy" && answers.proteinBase === "plant") {
          const wheyOk = !answers.allergies.includes("Dairy");
          if (wheyOk) {
            dispatch(action);
            dispatch({ type: "SET_PROTEIN", base: "whey" });
            showToast("We switched your protein base to Whey Isolate due to your soy allergy selection.");
            return;
          }
        }
      }
    }
    dispatch(action);
  }

  function goTo(next: number) {
    if (animating) return;
    setDirection(next > step ? "forward" : "back");
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 250);
  }

  const canProceed = (): boolean => {
    if (step === 1) return answers.goals.length > 0;
    if (step === 2) return answers.proteinBase !== null;
    if (step === 3) return answers.flavors.length > 0;
    if (step === 4) return answers.activityLevel !== null;
    return true;
  };

  const formula = generateFormula(answers);
  const wheyReason = wheyDisabledReason(answers.allergies);
  const plantReason = plantDisabledReason(answers.allergies);
  const hasTreeNutsOrEggs =
    answers.allergies.includes("Tree Nuts") || answers.allergies.includes("Eggs");
  const hasGluten = answers.allergies.includes("Gluten");

  const heightOptions = heightUnit === "imperial" ? HEIGHT_OPTIONS_IMPERIAL : HEIGHT_OPTIONS_METRIC;
  const weightOptions = weightUnit === "imperial" ? WEIGHT_OPTIONS_IMPERIAL : WEIGHT_OPTIONS_METRIC;

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-24 pb-16">
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--color-ink)] text-[var(--color-cream)] text-sm px-5 py-3 rounded-xl shadow-lg max-w-sm text-center transition-all">
          {toast}
        </div>
      )}

      <div className="container-site max-w-2xl">
        {/* Step container */}
        <div
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "forward"
                ? "translateX(20px)"
                : "translateX(-20px)"
              : "translateX(0)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          {/* ── Step 1: Goals ── */}
          {step === 1 && (
            <QuizStep
              stepNumber={1}
              totalSteps={TOTAL_STEPS}
              title="What are you optimizing for?"
              subtitle="Select all that apply. We'll tailor your formula to match."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* ── Step 2: Protein + Allergies ── */}
          {step === 2 && (
            <QuizStep
              stepNumber={2}
              totalSteps={TOTAL_STEPS}
              title="Choose your protein base"
              subtitle="Pick the foundation of your formula. Both are complete amino acid profiles."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Plant-Based */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !plantReason && dispatch({ type: "SET_PROTEIN", base: "plant" })}
                    disabled={!!plantReason}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                      answers.proteinBase === "plant"
                        ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30"
                        : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-2xl mb-2">🌱</div>
                    <p className="font-semibold mb-0.5">Plant-Based</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      Pea + rice blend. Vegan, dairy-free, complete amino profile.
                    </p>
                    {hasTreeNutsOrEggs && !plantReason && (
                      <span className="mt-2 inline-block text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                        Allergen-free
                      </span>
                    )}
                    {plantReason && (
                      <span className="mt-2 inline-block text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                        {plantReason}
                      </span>
                    )}
                    {answers.proteinBase === "plant" && (
                      <span className="mt-2 block text-xs text-[var(--color-amber)] font-semibold">
                        Selected
                      </span>
                    )}
                  </button>
                </div>

                {/* Whey Isolate */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !wheyReason && dispatch({ type: "SET_PROTEIN", base: "whey" })}
                    disabled={!!wheyReason}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                      answers.proteinBase === "whey"
                        ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30"
                        : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-2xl mb-2">🥛</div>
                    <p className="font-semibold mb-0.5">Whey Isolate</p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      Fast-absorbing, minimal lactose. Ideal for post-workout recovery.
                    </p>
                    {hasTreeNutsOrEggs && !wheyReason && (
                      <span className="mt-2 inline-block text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                        Allergen-free
                      </span>
                    )}
                    {wheyReason && (
                      <span className="mt-2 inline-block text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                        {wheyReason}
                      </span>
                    )}
                    {hasGluten && (
                      <span className="mt-2 inline-block text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full ml-1">
                        Check for gluten traces
                      </span>
                    )}
                    {answers.proteinBase === "whey" && (
                      <span className="mt-2 block text-xs text-[var(--color-amber)] font-semibold">
                        Selected
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--color-ink)] mb-3">
                  Any allergies or restrictions?
                  <span className="text-[var(--color-ink-muted)] font-normal ml-1">(optional)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALLERGIES.map((allergy) => (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => dispatchWithAllergyCheck({ type: "TOGGLE_ALLERGY", allergy })}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${
                        answers.allergies.includes(allergy)
                          ? "border-[var(--color-amber)] bg-[var(--color-amber-light)] text-[var(--color-ink)] font-medium"
                          : "border-[var(--color-ink)]/15 text-[var(--color-ink-muted)] hover:border-[var(--color-amber-light)]"
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>
            </QuizStep>
          )}

          {/* ── Step 3: Flavors ── */}
          {step === 3 && (
            <QuizStep
              stepNumber={3}
              totalSteps={TOTAL_STEPS}
              title="Pick your flavors"
              subtitle={`Select up to 3. You'll get a blend of all chosen flavors in every bottle. (${answers.flavors.length}/3 selected)`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FLAVORS.map((fl) => (
                  <button
                    key={fl.id}
                    type="button"
                    onClick={() => dispatch({ type: "TOGGLE_FLAVOR", flavor: fl.id })}
                    disabled={!answers.flavors.includes(fl.id) && answers.flavors.length >= 3}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all text-center p-4
                      ${answers.flavors.includes(fl.id)
                        ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30"
                        : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
                      }
                      disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <span className="text-3xl">{fl.icon}</span>
                    <span className="text-xs font-semibold">{fl.label}</span>
                    {answers.flavors.includes(fl.id) && (
                      <span className="text-[var(--color-amber)] text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </QuizStep>
          )}

          {/* ── Step 4: Health factors ── */}
          {step === 4 && (
            <QuizStep
              stepNumber={4}
              totalSteps={TOTAL_STEPS}
              title="A few quick health factors"
              subtitle="Used only to calibrate your dosing. Never shared."
            >
              <div className="space-y-5">
                {/* Age */}
                <QuizSelect
                  label="Age"
                  value={answers.age}
                  options={AGE_OPTIONS}
                  onChange={(v) => dispatch({ type: "SET_AGE", age: v })}
                  placeholder="Select age range"
                />

                {/* Height */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide">
                      Height
                    </label>
                    <div className="flex rounded-full border border-[var(--color-ink)]/10 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => setHeightUnit("imperial")}
                        className={`px-3 py-1 transition-colors ${
                          heightUnit === "imperial"
                            ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                            : "text-[var(--color-ink-muted)]"
                        }`}
                      >
                        ft/in
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeightUnit("metric")}
                        className={`px-3 py-1 transition-colors ${
                          heightUnit === "metric"
                            ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                            : "text-[var(--color-ink-muted)]"
                        }`}
                      >
                        cm
                      </button>
                    </div>
                  </div>
                  <select
                    value={answers.height ?? ""}
                    onChange={(e) => dispatch({ type: "SET_HEIGHT", height: e.target.value })}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber)]/20 transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6460' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                  >
                    <option value="" disabled>Select height range</option>
                    {heightOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Weight */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wide">
                      Weight
                    </label>
                    <div className="flex rounded-full border border-[var(--color-ink)]/10 overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => setWeightUnit("imperial")}
                        className={`px-3 py-1 transition-colors ${
                          weightUnit === "imperial"
                            ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                            : "text-[var(--color-ink-muted)]"
                        }`}
                      >
                        lbs
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeightUnit("metric")}
                        className={`px-3 py-1 transition-colors ${
                          weightUnit === "metric"
                            ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                            : "text-[var(--color-ink-muted)]"
                        }`}
                      >
                        kg
                      </button>
                    </div>
                  </div>
                  <select
                    value={answers.weight ?? ""}
                    onChange={(e) => dispatch({ type: "SET_WEIGHT", weight: e.target.value })}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber)]/20 transition-colors appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6460' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                  >
                    <option value="" disabled>Select weight range</option>
                    {weightOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Activity Level */}
                <div>
                  <p className="text-xs font-semibold text-[var(--color-ink)] mb-3 uppercase tracking-wide">
                    Activity Level
                  </p>
                  <div className="space-y-2">
                    {ACTIVITIES.map((act) => (
                      <OptionTile
                        key={act.id}
                        selected={answers.activityLevel === act.id}
                        onClick={() =>
                          dispatch({ type: "SET_ACTIVITY", level: act.id })
                        }
                        label={act.label}
                        description={act.desc}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </QuizStep>
          )}

          {/* ── Step 5: Results ── */}
          {step === 5 && (
            <div>
              <div className="mb-8">
                <p className="section-label mb-3">Your Formula</p>
                <h2 className="heading-display text-4xl mb-2">
                  We built your blend.
                </h2>
                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                  Based on your answers, here&apos;s the formula we&apos;ve assembled.
                  Customize it further in the Builder.
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
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Flavors</p>
                      <p className="text-sm font-semibold capitalize">
                        {answers.flavors.map((f) => FLAVORS.find((x) => x.id === f)?.label).join(", ")}
                      </p>
                    </div>
                  </div>

                  {formula.addons.length > 0 && (
                    <div className="py-3 border-b border-black/6">
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-2">Functional Add-ons</p>
                      <div className="flex flex-wrap gap-2">
                        {formula.addons.map((addon) => (
                          <span
                            key={addon}
                            className="text-xs bg-[var(--color-amber-light)] text-[var(--color-ink)] px-3 py-1 rounded-full font-medium"
                          >
                            {addon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">Est. Calories per bottle</p>
                    <p className="font-display text-2xl font-bold text-[var(--color-amber)]">
                      {formula.calories} kcal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/builder" className="btn-primary flex-1 text-center">
                  Customize in Builder
                </Link>
                <button
                  onClick={() => { setStep(1); }}
                  className="btn-outline flex-1 text-center"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        {step < 5 && (
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-black/8">
            <button
              onClick={() => goTo(step - 1)}
              disabled={step === 1}
              className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>

            <button
              onClick={() => goTo(step + 1)}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {step === 4 ? "See My Formula" : "Continue"}
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
