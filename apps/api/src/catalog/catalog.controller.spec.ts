import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import type { CatalogService } from './catalog.service';

describe('CatalogController', () => {
  const productId = '7a4074af-b4b0-4393-8f35-835494071d95';
  const vehicleId = '5f8768e3-df8d-4fd0-b72f-523cd8e8f001';
  const makeController = (service: Partial<CatalogService>) =>
    new CatalogController(service as CatalogService);

  it('gets a product detail with optional vehicle context', async () => {
    const getProduct = jest.fn().mockResolvedValue({
      id: productId,
      title: 'Brake pad set',
      oemNumbers: [],
      offers: [],
    });
    const controller = makeController({ getProduct });

    await controller.getProduct({ productId }, { vehicleId });

    expect(getProduct).toHaveBeenCalledWith({ productId, vehicleId });
  });

  it('rejects invalid product requests', async () => {
    const getProduct = jest.fn();
    const controller = makeController({ getProduct });

    await expect(
      controller.getProduct({ productId: 'not-a-uuid' }, {}),
    ).rejects.toThrow(BadRequestException);
    await expect(
      controller.getProduct({ productId }, { vehicleId: 'not-a-uuid' }),
    ).rejects.toThrow(BadRequestException);
    expect(getProduct).not.toHaveBeenCalled();
  });

  it('returns not found when the product is missing', async () => {
    const getProduct = jest.fn().mockResolvedValue(null);
    const controller = makeController({ getProduct });

    await expect(controller.getProduct({ productId }, {})).rejects.toThrow(
      NotFoundException,
    );
  });
});
