import { PostgresCatalogSearchProvider } from './catalog-search.provider';

const mockPool = { query: jest.fn(), end: jest.fn() };

jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
}));

describe('PostgresCatalogSearchProvider', () => {
  const productId = '7a4074af-b4b0-4393-8f35-835494071d95';

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.query.mockReset();
  });

  it('searches available EUR parts without claiming fitment', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [
        {
          product_id: productId,
          title: 'Brake pad set',
          brand: 'ATE',
          amount_minor: '2599',
          total_count: '1',
        },
      ],
    });

    const result = await makeProvider().searchParts({
      query: 'brake',
      identifierQuery: 'BRAKE',
      page: 1,
    });

    expect(result).toEqual({
      items: [
        {
          productId,
          title: 'Brake pad set',
          brand: 'ATE',
          price: { amountMinor: 2599, currency: 'EUR' },
          fitment: {
            status: 'UNKNOWN',
            ruleScore: 0,
            calibratedProbability: null,
            evidence: [],
            warnings: ['Fitment has not been evaluated for this search result'],
          },
        },
      ],
      page: 1,
      total: 1,
    });
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining("AND sl.currency = 'EUR'"),
      ['%brake%', '%BRAKE%', 20, 0],
    );
  });
});

function makeProvider(): PostgresCatalogSearchProvider {
  return new PostgresCatalogSearchProvider({
    get: jest.fn(() => 'postgresql://local/koliparts_db'),
  } as never);
}
