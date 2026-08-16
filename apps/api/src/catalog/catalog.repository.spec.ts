import { PostgresCatalogRepository } from './catalog.repository';

const mockPool = { query: jest.fn(), end: jest.fn() };

jest.mock('pg', () => ({
  Pool: jest.fn(() => mockPool),
}));

describe('PostgresCatalogRepository', () => {
  const productId = '7a4074af-b4b0-4393-8f35-835494071d95';
  const productRow = {
    id: productId,
    title: 'Brake pad set',
    brand: 'ATE',
    oem_numbers: ['34116858910'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool.query.mockReset();
  });

  it('returns product details with EUR available offers only', async () => {
    mockPool.query
      .mockResolvedValueOnce({ rows: [productRow] })
      .mockResolvedValueOnce({
        rows: [
          {
            supplier_listing_id: 'c4174850-aa88-4a02-8e02-1be5b30c053d',
            supplier: 'EBAY_DE',
            amount_minor: '2599',
          },
        ],
      });

    const result = await makeRepository().findProduct({ productId });

    expect(result).toEqual({
      id: productId,
      title: 'Brake pad set',
      brand: 'ATE',
      oemNumbers: ['34116858910'],
      offers: [
        {
          supplierListingId: 'c4174850-aa88-4a02-8e02-1be5b30c053d',
          supplier: 'EBAY_DE',
          price: { amountMinor: 2599, currency: 'EUR' },
        },
      ],
    });
    expect(mockPool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("AND currency = 'EUR'"),
      [productId],
    );
  });

  it('returns null when the product does not exist', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });

    await expect(
      makeRepository().findProduct({ productId }),
    ).resolves.toBeNull();
    expect(mockPool.query).toHaveBeenCalledTimes(1);
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

    const result = await makeRepository().searchParts({
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

function makeRepository(): PostgresCatalogRepository {
  return new PostgresCatalogRepository({
    get: jest.fn(() => 'postgresql://local/koliparts_db'),
  } as never);
}
