import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import type { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  const userId = '5f8768e3-df8d-4fd0-b72f-523cd8e8f001';
  const request = { authUser: { userId, preferredLanguage: 'bg', roles: [] } };
  const makeController = (service: Partial<VehiclesService>) =>
    new VehiclesController(service as VehiclesService);

  it('lists vehicles for the authenticated user with bounded defaults', async () => {
    const listVehicles = jest.fn().mockResolvedValue([]);
    const controller = makeController({ listVehicles });

    await controller.listVehicles({ limit: '10' }, request as never);
    await controller.listVehicles({}, request as never);

    expect(listVehicles).toHaveBeenNthCalledWith(1, { userId, limit: 10 });
    expect(listVehicles).toHaveBeenNthCalledWith(2, { userId, limit: 50 });
  });

  it('creates vehicles from session ownership and normalized payload', async () => {
    const createVehicle = jest.fn().mockResolvedValue({});
    const controller = makeController({ createVehicle });

    await controller.createVehicle(
      {
        vin: ' w0l0a7ec3f0000001 ',
        make: ' Opel ',
        model: ' Astra ',
        productionYear: 2015,
        engineCode: ' A16XER ',
      },
      request as never,
    );

    expect(createVehicle).toHaveBeenCalledWith({
      userId,
      vin: 'W0L0A7EC3F0000001',
      make: 'Opel',
      model: 'Astra',
      productionYear: 2015,
      engineCode: 'A16XER',
    });
  });

  it('rejects client ownership injection and missing guard state', () => {
    const createVehicle = jest.fn();
    const controller = makeController({
      createVehicle,
      listVehicles: jest.fn(),
    });

    expect(() =>
      controller.createVehicle(
        { userId: 'attacker-user-id', make: 'Opel', model: 'Astra' },
        request as never,
      ),
    ).toThrow(BadRequestException);
    expect(() => controller.listVehicles({}, {} as never)).toThrow(
      UnauthorizedException,
    );
    expect(createVehicle).not.toHaveBeenCalled();
  });
});
