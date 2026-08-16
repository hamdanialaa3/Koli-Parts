import { PostgresVehiclesRepository } from './vehicles.repository';

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};
const mockPool = { query: jest.fn(), connect: jest.fn(), end: jest.fn() };

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
    mockPool.connect.mockResolvedValue(mockClient);
    mockClient.query.mockReset();
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

  it('finds one vehicle only within the authenticated user scope', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [row] });

    const result = await makeRepository().find({ userId, vehicleId: row.id });

    expect(result?.id).toBe(row.id);
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE user_id = $1 AND id = $2'),
      [userId, row.id],
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

  it('sets a default vehicle only within the authenticated user scope', async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [row] })
      .mockResolvedValueOnce({});

    const result = await makeRepository().setDefault({
      userId,
      vehicleId: row.id,
    });

    expect(result?.id).toBe(row.id);
    expect(mockClient.query).toHaveBeenNthCalledWith(2, expect.any(String), [
      userId,
    ]);
    expect(mockClient.query).toHaveBeenNthCalledWith(3, expect.any(String), [
      userId,
      row.id,
    ]);
    expect(mockClient.query).toHaveBeenLastCalledWith('COMMIT');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('rolls back default selection when the vehicle is not owned by the user', async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({});

    await expect(
      makeRepository().setDefault({ userId, vehicleId: row.id }),
    ).resolves.toBeNull();

    expect(mockClient.query).toHaveBeenLastCalledWith('ROLLBACK');
  });

  it('updates only vehicles owned by the authenticated user', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ ...row, make: 'VW', model: 'Golf' }],
    });

    const result = await makeRepository().update({
      userId,
      vehicleId: row.id,
      make: 'VW',
      model: 'Golf',
    });

    expect(result?.make).toBe('VW');
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE user_id = $1 AND id = $2'),
      [userId, row.id, null, 'VW', 'Golf', null, null],
    );
  });

  it('returns null when updating a vehicle outside the user scope', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      makeRepository().update({ userId, vehicleId: row.id, make: 'VW' }),
    ).resolves.toBeNull();
  });

  it('deletes only vehicles owned by the authenticated user', async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [row] })
      .mockResolvedValueOnce({ rows: [{ is_referenced: false }] })
      .mockResolvedValueOnce({ rows: [row] })
      .mockResolvedValueOnce({});

    const result = await makeRepository().delete({
      userId,
      vehicleId: row.id,
    });

    expect(result.status).toBe('deleted');
    expect(result.status === 'deleted' ? result.vehicle.id : undefined).toBe(
      row.id,
    );
    expect(mockClient.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('WHERE user_id = $1 AND id = $2'),
      [userId, row.id],
    );
    expect(mockClient.query).toHaveBeenNthCalledWith(
      4,
      expect.stringContaining('DELETE FROM vehicles'),
      [userId, row.id],
    );
    expect(mockClient.query).toHaveBeenLastCalledWith('COMMIT');
  });

  it('does not delete a vehicle outside the authenticated user scope', async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({});

    await expect(
      makeRepository().delete({ userId, vehicleId: row.id }),
    ).resolves.toEqual({ status: 'not_found' });
    expect(mockClient.query).toHaveBeenLastCalledWith('ROLLBACK');
  });

  it('blocks deleting a vehicle referenced by carts or orders', async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [row] })
      .mockResolvedValueOnce({ rows: [{ is_referenced: true }] })
      .mockResolvedValueOnce({});

    await expect(
      makeRepository().delete({ userId, vehicleId: row.id }),
    ).resolves.toEqual({ status: 'referenced' });
    expect(mockClient.query).toHaveBeenLastCalledWith('ROLLBACK');
  });
});

function makeRepository(): PostgresVehiclesRepository {
  return new PostgresVehiclesRepository({
    get: jest.fn(() => 'postgresql://local/koliparts_db'),
  } as never);
}
