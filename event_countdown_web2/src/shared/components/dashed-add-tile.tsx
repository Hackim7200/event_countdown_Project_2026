"use client";

export type DashedAddVariant = "prominent" | "taskCard" | "eventRow";

type DashedAddTileProps = {
  onClick: () => void;
  /** Screen reader name (control is icon-only). */
  ariaLabel: string;
  className?: string;
  /**
   * `taskCard` — same chrome as todo `TaskCard` (p-4, radius, shadow).
   * `eventRow` — aligns with `EventRowCard` padding and shadow.
   * `prominent` — larger hit target (e.g. Pomodoro panel).
   */
  variant?: DashedAddVariant;
};

/**
 * Dashed “add” control: plus icon only; matches surrounding cards by variant.
 */
export function DashedAddTile({
  onClick,
  ariaLabel,
  className = "",
  variant = "prominent",
}: DashedAddTileProps) {
  const isProminent = variant === "prominent";
  const isTaskCard = variant === "taskCard";
  const isEventRow = variant === "eventRow";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "flex w-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]",
        isProminent &&
          "items-center justify-center rounded-lg border-2 border-dashed border-[#B8C0CC] bg-white px-6 py-10 hover:border-[#94A3B8] hover:bg-[#FAFAF9]",
        isTaskCard &&
          "items-center justify-center rounded-lg border-2 border-dashed border-[#B8C0CC] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-[#94A3B8] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] active:scale-[0.99] min-h-[5.75rem]",
        isEventRow &&
          "items-center justify-center min-h-[4.5rem] rounded-lg border-2 border-dashed border-[#B8C0CC] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.07)] hover:border-[#94A3B8] hover:bg-[#FAFAF9] md:min-h-[5.25rem] md:px-6 md:py-[18px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <PlusGlyph
        className={
          isProminent
            ? "h-8 w-8 shrink-0 text-[#9CA3AF]"
            : isEventRow
              ? "h-5 w-5 shrink-0 text-[#9CA3AF] md:h-6 md:w-6"
              : "h-5 w-5 shrink-0 text-[#9CA3AF]"
        }
      />
    </button>
  );
}

function PlusGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
