import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  it('does not fabricate VIN candidates when no provider is configured', () => {
    const service = new VehiclesService(
      {} as never,
      {
        get: jest.fn(() => 'unconfigured'),
      } as never,
    );

    expect(service.parseVin('W0L0A7EC3F0000001')).toBeNull();
  });
});
