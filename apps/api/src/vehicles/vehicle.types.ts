export type CreateVehicleInput = OwnerInput & VehiclePayload;

type OwnerInput = { userId: string };

export type ListVehiclesInput = OwnerInput & {
  limit: number;
};

export type GetVehicleInput = OwnerInput & {
  vehicleId: string;
};

export type SetDefaultVehicleInput = GetVehicleInput;

export type UpdateVehicleInput = OwnerInput &
  Partial<VehiclePayload> & {
    vehicleId: string;
  };

export type VehicleCandidate = {
  provider: string;
  vehicle: VehiclePayload;
  confidence: 'high' | 'medium' | 'low';
};

type VehiclePayload = {
  vin?: string;
  make: string;
  model: string;
  productionYear?: number;
  engineCode?: string;
};

export type Vehicle = VehiclePayload & {
  id: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};
