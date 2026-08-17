import { PostgresFitmentRepository } from './fitment.repository';

const mockPool = {
  query: jest.fn(),
  end: jest.fn(),
};

jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
}));

describe('PostgresFitmentRepository', () => {
  const productId = '2ee35c1d-b4fd-4268-852b-6f9838936c8a';
  const vehicleId = '7a4074af-b4b0-4393-8f35-835494071d95';
  const evidenceId = '44a8f812-9ef5-40eb-8aae-319f66a80ff0';
  const evaluationId = '47c233d5-f2f8-44a9-bf17-1603bf7ebd31';
  const createdAt = new Date('2026-08-17T00:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.query.mockReset();
  });

  it('records fitment evidence without inventing compatibility status', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: evidenceId,
          product_id: productId,
          vehicle_id: vehicleId,
          source: 'OEM',
          evidence_type: 'OEM_EXACT',
          strength: '40.000',
          details: { normalizedOem: '34116858910' },
          created_at: createdAt,
        },
      ],
    });

    const result = await makeRepository().recordEvidence({
      productId,
      vehicleId,
      source: 'OEM',
      evidenceType: 'OEM_EXACT',
      strength: 40,
      details: { normalizedOem: '34116858910' },
    });

    expect(result).toEqual({
      id: evidenceId,
      productId,
      vehicleId,
      source: 'OEM',
      evidenceType: 'OEM_EXACT',
      strength: 40,
      details: { normalizedOem: '34116858910' },
      createdAt: '2026-08-17T00:00:00.000Z',
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO fitment_evidence'),
      [
        productId,
        vehicleId,
        'OEM',
        'OEM_EXACT',
        40,
        JSON.stringify({ normalizedOem: '34116858910' }),
      ],
    );
  });

  it('records compatibility evaluations with evidence ids and warnings', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: evaluationId,
          product_id: productId,
          vehicle_id: vehicleId,
          status: 'VERIFY_OEM',
          rule_score: '40.00',
          calibrated_probability: null,
          evidence_ids: [evidenceId],
          warnings: ['Verify OEM before checkout'],
          algorithm_version: 'fitment-v1',
          created_at: createdAt,
        },
      ],
    });

    const result = await makeRepository().recordEvaluation({
      productId,
      vehicleId,
      status: 'VERIFY_OEM',
      ruleScore: 40,
      calibratedProbability: null,
      evidenceIds: [evidenceId],
      warnings: ['Verify OEM before checkout'],
      algorithmVersion: 'fitment-v1',
    });

    expect(result.status).toBe('VERIFY_OEM');
    expect(result.ruleScore).toBe(40);
    expect(result.calibratedProbability).toBeNull();
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO compatibility_evaluations'),
      [
        productId,
        vehicleId,
        'VERIFY_OEM',
        40,
        null,
        [evidenceId],
        JSON.stringify(['Verify OEM before checkout']),
        'fitment-v1',
      ],
    );
  });

  it('finds the latest compatibility evaluation for one product and vehicle', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          id: evaluationId,
          product_id: productId,
          vehicle_id: vehicleId,
          status: 'UNKNOWN',
          rule_score: '0.00',
          calibrated_probability: null,
          evidence_ids: [],
          warnings: ['Fitment has not been evaluated'],
          algorithm_version: 'fitment-v1',
          created_at: createdAt,
        },
      ],
    });

    await expect(
      makeRepository().findLatestEvaluation({ productId, vehicleId }),
    ).resolves.toMatchObject({
      id: evaluationId,
      productId,
      vehicleId,
      status: 'UNKNOWN',
      ruleScore: 0,
      warnings: ['Fitment has not been evaluated'],
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY created_at DESC, id DESC'),
      [productId, vehicleId],
    );
  });

  it('returns null when no compatibility evaluation exists', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      makeRepository().findLatestEvaluation({ productId, vehicleId }),
    ).resolves.toBeNull();
  });
});
function makeRepository(): PostgresFitmentRepository {
  return new PostgresFitmentRepository({
    get: jest.fn(
      () => 'postgresql://koliparts:dev-password@localhost:5432/koliparts_db',
    ),
  } as never);
}
