export type FitmentStatus =
  | 'CONFIRMED_FIT'
  | 'HIGH_CONFIDENCE'
  | 'VERIFY_OEM'
  | 'UNKNOWN'
  | 'NOT_COMPATIBLE';

export interface FitmentEvidence {
  source: 'TECDOC' | 'OEM' | 'SUPPLIER' | 'EBAY' | 'LISTING' | 'AI';
  type: string;
  strength: number;
  description?: string;
}

export interface FitmentEvaluation {
  status: FitmentStatus;
  ruleScore: number;
  calibratedProbability: number | null;
  evidence: FitmentEvidence[];
  warnings: string[];
}
