type Status = 'CONFIRMED_FIT' | 'HIGH_CONFIDENCE' | 'VERIFY_OEM' | 'UNKNOWN' | 'NOT_COMPATIBLE';

const labels: Record<Status, string> = {
  CONFIRMED_FIT: 'Confirmed fit',
  HIGH_CONFIDENCE: 'High-confidence fit',
  VERIFY_OEM: 'Verify OEM number',
  UNKNOWN: 'Compatibility unknown',
  NOT_COMPATIBLE: 'Not compatible',
};

export function FitmentStatus({ status, explanation }: { status: Status; explanation?: string }) {
  return (
    <section aria-label="Part compatibility" data-fitment={status}>
      <strong>{labels[status]}</strong>
      {explanation ? <p>{explanation}</p> : null}
    </section>
  );
}
