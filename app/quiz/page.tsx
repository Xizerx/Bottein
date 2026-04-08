"use client";

import { useReducer, useState } from "react";
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
  weight: null,
  activityLevel: null,
};

type QuizAction =
  | { type: "TOGGLE_GOAL"; goal: Goal }
  | { type: "SET_PROTEIN"; base: ProteinBase }
  | { type: "TOGGLE_ALLERGY"; allergy: string }
  | { type: "TOGGLE_FLAVOR"; flavor: FlavorOption }
  | { type: "SET_AGE"; age: number }
  | { type: "SET_WEIGHT"; weight: number }
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
      if (state.flavors.length >= 3) return state; // max 3
      return { ...state, flavors: [...state.flavors, action.flavor] };
    case "SET_AGE":
      return { ...state, age: action.age };
    case "SET_WEIGHT":
      return { ...state, weight: action.weight };
    case "SET_ACTIVITY":
      return { ...state, activityLevel: action.level };
    default:
      return state;
  }
}

// ── Data ───────────────────────────────────────────────────────────────────

const GOALS: { id: Goal; icon: string; label: string; desc: string }[] = [
  { id: "focus", icon: "🎯", label: "Focus & Cognition", desc: "Sharpen mental clarity and sustained attention" },
  { id: "sleep", icon: "🌙", label: "Sleep & Recovery", desc: "Wind down faster, wake up restored" },
  { id: "fitness", icon: "💪", label: "Fitness & Strength", desc: "Build muscle, improve endurance" },
  { id: "skincare", icon: "✨", label: "Skin & Beauty", desc: "Collagen, hydration, glow from within" },
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
  { id: "light", label: "Light", desc: "1–3 workouts per week" },
  { id: "moderate", label: "Moderate", desc: "3–5 workouts per week" },
  { id: "active", label: "Active", desc: "Daily movement, intense training" },
  { id: "very_active", label: "Very Active", desc: "Athlete or physical profession" },
];

const ALLERGIES = ["Dairy", "Gluten", "Soy", "Tree Nuts", "Eggs"];

// ── Formula generation ─────────────────────────────────────────────────────

function generateFormula(answers: QuizAnswers) {
  const addons: string[] = [];
  if (answers.goals.includes("focus")) addons.push("Lion's Mane Extract");
  if (answers.goals.includes("sleep")) addons.push("Ashwagandha", "Melatonin 0.5mg");
  if (answers.goals.includes("fitness")) addons.push("Creatine Monohydrate 3g");
  if (answers.goals.includes("skincare")) addons.push("Collagen Peptides 5g", "Vitamin C");
  if (answers.goals.includes("wellness")) addons.push("Vitamin D3 2000IU");

  const protein = answers.proteinBase === "plant" ? "Pea + Rice Blend" : "Whey Isolate";
  const calories = answers.proteinBase === "plant" ? 160 : 170;
  const proteinG = answers.activityLevel === "very_active" || answers.activityLevel === "active" ? 30 : 25;

  return { protein, addons, calories, proteinG };
}

// ── Component ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, dispatch] = useReducer(quizReducer, initialAnswers);
  const [animating, setAnimating] = useState(false);

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

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pt-24 pb-16">
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
                    icon={goal.icon}
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
                <OptionTile
                  selected={answers.proteinBase === "plant"}
                  onClick={() => dispatch({ type: "SET_PROTEIN", base: "plant" })}
                  icon="🌱"
                  label="Plant-Based"
                  description="Pea + rice blend. Vegan, dairy-free, complete amino profile."
                />
                <OptionTile
                  selected={answers.proteinBase === "whey"}
                  onClick={() => dispatch({ type: "SET_PROTEIN", base: "whey" })}
                  icon="🥛"
                  label="Whey Isolate"
                  description="Fast-absorbing, minimal lactose. Ideal for post-workout recovery."
                />
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
                      onClick={() => dispatch({ type: "TOGGLE_ALLERGY", allergy })}
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
              subtitle={`Select up to 3. You'll get a blend of all chosen flavors in every bag. (${answers.flavors.length}/3 selected)`}
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
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-2 uppercase tracking-wide">
                      Age
                    </label>
                    <input
                      type="number"
                      min={16}
                      max={80}
                      placeholder="e.g. 26"
                      defaultValue={answers.age ?? ""}
                      onChange={(e) =>
                        dispatch({ type: "SET_AGE", age: Number(e.target.value) })
                      }
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--color-ink)] mb-2 uppercase tracking-wide">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      min={80}
                      max={400}
                      placeholder="e.g. 155"
                      defaultValue={answers.weight ?? ""}
                      onChange={(e) =>
                        dispatch({ type: "SET_WEIGHT", weight: Number(e.target.value) })
                      }
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-ink)]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--color-amber)] transition-colors"
                    />
                  </div>
                </div>

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
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Protein / serving</p>
                      <p className="text-sm font-semibold">{formula.proteinG}g</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-start py-3 border-b border-black/6">
                    <div>
                      <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-0.5">Flavors</p>
                      <p className="text-sm font-semibold capitalize">
                        {answers.flavors.map((f) => FLAVORS.find((x) => x.id === f)?.label).join(" · ")}
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
                    <p className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wide">Est. Calories / serving</p>
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
