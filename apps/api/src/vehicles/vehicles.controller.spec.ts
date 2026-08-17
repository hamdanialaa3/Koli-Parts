import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import type { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  const userId = '5f8768e3-df8d-4fd0-b72f-523cd8e8f001';
  const vehicleId = '7a4074af-b4b0-4393-8f35-835494071d95';
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

  it('gets one vehicle for the authenticated user', async () => {
    const getVehicle = jest.fn().mockResolvedValue({ id: vehicleId });
    const controller = makeController({ getVehicle });

    await controller.getVehicle({ vehicleId }, request as never);

    expect(getVehicle).toHaveBeenCalledWith({ userId, vehicleId });
  });

  it('rejects invalid single vehicle ids', async () => {
    const getVehicle = jest.fn();
    const controller = makeController({ getVehicle });

    await expect(
      controller.getVehicle({ vehicleId: 'not-a-uuid' }, request as never),
    ).rejects.toThrow(BadRequestException);
    expect(getVehicle).not.toHaveBeenCalled();
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

  it('sets the authenticated user vehicle as default', async () => {
    const setDefaultVehicle = jest.fn().mockResolvedValue({ id: vehicleId });
    const controller = makeController({ setDefaultVehicle });

    await controller.setDefaultVehicle({ vehicleId }, request as never);

    expect(setDefaultVehicle).toHaveBeenCalledWith({ userId, vehicleId });
  });

  it('rejects invalid default vehicle ids', async () => {
    const setDefaultVehicle = jest.fn();
    const controller = makeController({ setDefaultVehicle });

    await expect(
      controller.setDefaultVehicle(
        { vehicleId: 'not-a-uuid' },
        request as never,
      ),
    ).rejects.toThrow(BadRequestException);
    expect(setDefaultVehicle).not.toHaveBeenCalled();
  });

  it('updates an authenticated user vehicle with normalized fields', async () => {
    const updateVehicle = jest.fn().mockResolvedValue({ id: vehicleId });
    const controller = makeController({ updateVehicle });

    await controller.updateVehicle(
      { vehicleId },
      { vin: ' w0l0a7ec3f0000001 ', make: ' VW ', model: ' Golf ' },
      request as never,
    );

    expect(updateVehicle).toHaveBeenCalledWith({
      userId,
      vehicleId,
      vin: 'W0L0A7EC3F0000001',
      make: 'VW',
      model: 'Golf',
    });
  });

  it('rejects injected update ownership or control fields', async () => {
    const updateVehicle = jest.fn();
    const controller = makeController({ updateVehicle });

    await expect(
      controller.updateVehicle(
        { vehicleId },
        { userId: 'attacker-user-id', isDefault: true, make: 'VW' },
        request as never,
      ),
    ).rejects.toThrow(BadRequestException);
    expect(updateVehicle).not.toHaveBeenCalled();
  });

  it('deletes an authenticated user vehicle', async () => {
    const deleteVehicle = jest
      .fn()
      .mockResolvedValue({ status: 'deleted', vehicle: { id: vehicleId } });
    const controller = makeController({ deleteVehicle });

    await expect(
      controller.deleteVehicle({ vehicleId }, request as never),
    ).resolves.toEqual({ id: vehicleId });
    expect(deleteVehicle).toHaveBeenCalledWith({ userId, vehicleId });
  });

  it('rejects invalid delete vehicle ids', async () => {
    const deleteVehicle = jest.fn();
    const controller = makeController({ deleteVehicle });

    await expect(
      controller.deleteVehicle({ vehicleId: 'not-a-uuid' }, request as never),
    ).rejects.toThrow(BadRequestException);
    expect(deleteVehicle).not.toHaveBeenCalled();
  });

  it('maps delete misses and referenced vehicles to safe errors', async () => {
    const deleteVehicle = jest
      .fn()
      .mockResolvedValueOnce({ status: 'not_found' })
      .mockResolvedValueOnce({ status: 'referenced' });
    const controller = makeController({ deleteVehicle });

    await expect(
      controller.deleteVehicle({ vehicleId }, request as never),
    ).rejects.toThrow(NotFoundException);
    await expect(
      controller.deleteVehicle({ vehicleId }, request as never),
    ).rejects.toThrow(ConflictException);
  });

  it('normalizes VIN parse requests without fabricating candidates', async () => {
    const parseVin = jest.fn().mockResolvedValue(null);
    const controller = makeController({ parseVin });

    await expect(
      controller.parseVin({ vin: ' w0l0a7ec3f0000001 ' }),
    ).rejects.toThrow(ServiceUnavailableException);
    expect(parseVin).toHaveBeenCalledWith('W0L0A7EC3F0000001');
  });

  it('rejects invalid VIN parse payloads', async () => {
    const parseVin = jest.fn();
    const controller = makeController({ parseVin });

    await expect(controller.parseVin({ vin: 'not-a-vin' })).rejects.toThrow(
      BadRequestException,
    );
    expect(parseVin).not.toHaveBeenCalled();
  });
});
