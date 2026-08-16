export type CreateVehicleInput = OwnerInput & VehiclePayload;

type OwnerInput = { userId: string };

export type ListVehiclesInput = OwnerInput & {
  limit: number;
};

export type SetDefaultVehicleInput = OwnerInput & {
  vehicleId: string;
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
