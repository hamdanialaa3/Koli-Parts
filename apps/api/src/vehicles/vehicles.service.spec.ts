import { VehiclesService } from './vehicles.service';
import { UnavailableVinDecoderProvider } from './vin-provider';

describe('VehiclesService', () => {
  it('does not fabricate VIN candidates when no provider is configured', async () => {
    const service = new VehiclesService(
      {} as never,
      new UnavailableVinDecoderProvider(),
    );

    await expect(service.parseVin('W0L0A7EC3F0000001')).resolves.toBeNull();
  });

  it('delegates valid VINs to the configured decoder provider', async () => {
    const decode = jest.fn().mockResolvedValue({
      provider: 'test-provider',
      vehicle: { make: 'Opel', model: 'Astra' },
      confidence: 'medium',
    });
    const service = new VehiclesService({} as never, { decode });

    await expect(service.parseVin('W0L0A7EC3F0000001')).resolves.toEqual({
      provider: 'test-provider',
      vehicle: { make: 'Opel', model: 'Astra' },
      confidence: 'medium',
    });
    expect(decode).toHaveBeenCalledWith('W0L0A7EC3F0000001');
  });

  it('does not call the decoder provider for invalid VIN lengths', async () => {
    const decode = jest.fn();
    const service = new VehiclesService({} as never, { decode });

    await expect(service.parseVin('short')).resolves.toBeNull();
    expect(decode).not.toHaveBeenCalled();
  });
});
