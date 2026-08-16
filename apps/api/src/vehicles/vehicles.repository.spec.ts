import { PostgresVehiclesRepository } from './vehicles.repository';

const mockPool = { query: jest.fn(), end: jest.fn() };

jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
}));

describe('PostgresVehiclesRepository', () => {
  const userId = '5f8768e3-df8d-4fd0-b72f-523cd8e8f001';
  const row = {
    id: '7a4074af-b4b0-4393-8f35-835494071d95',
    vin: 'W0L0A7EC3F0000001',
    make: 'Opel',
    model: 'Astra',
    production_year: 2015,
    engine_code: 'A16XER',
    is_default: true,
    created_at: new Date('2026-08-16T20:00:00.000Z'),
    updated_at: new Date('2026-08-16T20:00:00.000Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.query.mockReset();
  });

  it('lists only vehicles owned by the authenticated user', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [row] });

    const result = await makeRepository().list({ userId, limit: 50 });

    expect(result[0]?.make).toBe(row.make);
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE user_id = $1'),
      [userId, 50],
    );
  });

  it('creates a vehicle owned by the authenticated user', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ ...row, vin: null, production_year: null, engine_code: null }],
    });

    const result = await makeRepository().create({
      userId,
      make: 'Opel',
      model: 'Astra',
    });

    expect(result.make).toBe('Opel');
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO vehicles'),
      [userId, null, 'Opel', 'Astra', null, null],
    );
  });
});

function makeRepository(): PostgresVehiclesRepository {
  return new PostgresVehiclesRepository({
    get: jest.fn(() => 'postgresql://local/koliparts_db'),
  } as never);
}
