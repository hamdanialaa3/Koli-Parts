export type FitmentStatusValue =
  | "CONFIRMED_FIT"
  | "HIGH_CONFIDENCE"
  | "VERIFY_OEM"
  | "UNKNOWN"
  | "NOT_COMPATIBLE";

type FitmentStatusProps = {
  status: FitmentStatusValue;
  ruleScore?: number;
  warnings?: string[];
};

const statusCopy: Record<
  FitmentStatusValue,
  {
    label: string;
    detail: string;
    className: string;
  }
> = {
  CONFIRMED_FIT: {
    label: "Потвърдена съвместимост",
    detail: "Съвместимостта е подкрепена от структурирано правило.",
    className:
      "border-[var(--koli-success)] bg-[var(--koli-surface)] text-[var(--koli-success)]",
  },
  HIGH_CONFIDENCE: {
    label: "Висока увереност",
    detail: "Проверете детайлите преди поръчка, особено вариант и двигател.",
    className:
      "border-[var(--koli-primary)] bg-[var(--koli-surface)] text-[var(--koli-primary)]",
  },
  VERIFY_OEM: {
    label: "Проверете OEM номера",
    detail: "Има съвпадение, но е нужна ръчна проверка на OEM номера.",
    className:
      "border-[var(--koli-warning)] bg-[var(--koli-surface)] text-[var(--koli-warning)]",
  },
  UNKNOWN: {
    label: "Съвместимостта не е проверена",
    detail: "Няма достатъчно доказателства за потвърждение.",
    className:
      "border-[var(--koli-border)] bg-[var(--koli-surface)] text-[var(--koli-text-muted)]",
  },
  NOT_COMPATIBLE: {
    label: "Несъвместима част",
    detail: "Има правило или доказателство срещу тази съвместимост.",
    className:
      "border-[var(--koli-error)] bg-[var(--koli-surface)] text-[var(--koli-error)]",
  },
};

export function FitmentStatus({
  status,
  ruleScore,
  warnings = [],
}: FitmentStatusProps) {
  const copy = statusCopy[status] ?? statusCopy.UNKNOWN;
  const hasScore = typeof ruleScore === "number" && ruleScore > 0;

  return (
    <section
      aria-label="Съвместимост на частта"
      data-fitment={status}
      className={`rounded-md border px-3 py-2 text-sm ${copy.className}`}
    >
      <p className="font-semibold">{copy.label}</p>
      <p className="mt-1 text-xs leading-5">{copy.detail}</p>
      {hasScore ? (
        <p className="mt-1 text-xs leading-5">Ниво на увереност: {ruleScore}/100</p>
      ) : null}
      {warnings.length > 0 ? (
        <ul className="mt-1 list-inside list-disc text-xs leading-5">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
