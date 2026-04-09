"use client";

import { ReactNode } from "react";

interface QuizStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function QuizStep({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  children,
}: QuizStepProps) {
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2.5">
          <span className="section-label">
            Step {stepNumber} of {totalSteps}
          </span>
          <span className="text-xs text-[var(--color-ink-muted)]">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-1 bg-[var(--color-amber-light)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-amber)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <h2 className="heading-display text-3xl md:text-4xl mb-2">{title}</h2>
        {subtitle && (
          <p className="text-[var(--color-ink-muted)] text-sm md:text-base mb-8 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

// ── Reusable option tile ────────────────────────────────────────────────────
interface OptionTileProps {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  iconNode?: React.ReactNode;
  label: string;
  description?: string;
  multiSelect?: boolean;
}

export function OptionTile({
  selected,
  onClick,
  icon,
  iconNode,
  label,
  description,
  multiSelect,
}: OptionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-full text-left rounded-2xl border-2 p-5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-amber)] group ${
        selected
          ? "border-[var(--color-amber)] bg-[var(--color-amber-light)]/30"
          : "border-transparent bg-[var(--color-surface)] hover:border-[var(--color-amber-light)]"
      }`}
    >
      <div className="flex items-start gap-3">
        {iconNode && (
          <span className="leading-none mt-0.5 shrink-0 text-[var(--color-ink)]">{iconNode}</span>
        )}
        {!iconNode && icon && (
          <span className="text-2xl leading-none mt-0.5 shrink-0">{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[var(--color-ink)]">
              {label}
            </span>
            <span
              className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected
                  ? "border-[var(--color-amber)] bg-[var(--color-amber)]"
                  : "border-[var(--color-ink-muted)]/40"
              }`}
            >
              {selected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M1 3.5L3.8 6.5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </div>
          {description && (
            <p className="text-xs text-[var(--color-ink-muted)] mt-1 leading-relaxed min-h-[2.5rem]">
              {description}
            </p>
          )}
        </div>
      </div>
      {multiSelect && (
        <span className="sr-only">{selected ? "Selected" : "Not selected"}</span>
      )}
    </button>
  );
}
