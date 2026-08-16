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
});

function makeRepository(): PostgresCatalogRepository {
  return new PostgresCatalogRepository({
    get: jest.fn(() => 'postgresql://local/koliparts_db'),
  } as never);
}
