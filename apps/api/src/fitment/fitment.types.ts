export type FitmentStatus =
  | 'CONFIRMED_FIT'
  | 'HIGH_CONFIDENCE'
  | 'VERIFY_OEM'
  | 'UNKNOWN'
  | 'NOT_COMPATIBLE';

export type RecordFitmentEvidenceInput = {
  productId: string;
  vehicleId?: string;
  source: string;
  evidenceType: string;
  strength: number;
  details?: Record<string, unknown>;
};

export type FitmentEvidenceRecord = RecordFitmentEvidenceInput & {
  id: string;
  createdAt: string;
};

export type RecordCompatibilityEvaluationInput = {
  productId: string;
  vehicleId: string;
  status: FitmentStatus;
  ruleScore: number;
  calibratedProbability: number | null;
  evidenceIds: string[];
  warnings: string[];
  algorithmVersion: string;
};

export type CompatibilityEvaluationRecord =
  RecordCompatibilityEvaluationInput & {
    id: string;
    createdAt: string;
  };

export type FindLatestCompatibilityEvaluationInput = {
  productId: string;
  vehicleId: string;
};
