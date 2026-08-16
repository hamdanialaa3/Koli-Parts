import { BadRequestException } from '@nestjs/common';
import type { CatalogService } from './catalog.service';
import { SearchController } from './search.controller';

describe('SearchController', () => {
  const vehicleId = '5f8768e3-df8d-4fd0-b72f-523cd8e8f001';
  const makeController = (service: Partial<CatalogService>) =>
    new SearchController(service as CatalogService);

  it('searches parts with normalized query, vehicle context, and page', () => {
    const searchParts = jest
      .fn()
      .mockResolvedValue({ items: [], page: 2, total: 0 });
    const controller = makeController({ searchParts });

    void controller.searchParts({
      q: '  brake pads  ',
      vehicleId,
      page: '2',
    });

    expect(searchParts).toHaveBeenCalledWith({
      query: 'brake pads',
      vehicleId,
      page: 2,
    });
  });

  it('defaults page and rejects invalid search query input', () => {
    const searchParts = jest.fn();
    const controller = makeController({ searchParts });

    void controller.searchParts({ q: 'oil filter' });

    expect(searchParts).toHaveBeenCalledWith({
      query: 'oil filter',
      page: 1,
      vehicleId: undefined,
    });
    expect(() => controller.searchParts({ q: '' })).toThrow(
      BadRequestException,
    );
    expect(() =>
      controller.searchParts({ q: 'oil', vehicleId: 'not-a-uuid' }),
    ).toThrow(BadRequestException);
  });
});
