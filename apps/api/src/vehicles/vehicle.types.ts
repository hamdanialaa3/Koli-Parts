export type CreateVehicleInput = OwnerInput & VehiclePayload;

type OwnerInput = { userId: string };

export type ListVehiclesInput = OwnerInput & {
  limit: number;
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
