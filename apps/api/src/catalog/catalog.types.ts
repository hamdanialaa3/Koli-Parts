export type Money = {
  amountMinor: number;
  currency: 'EUR';
};

export type ProductOffer = {
  supplierListingId: string;
  supplier: string;
  price: Money;
};

export type ProductDetail = {
  id: string;
  title: string;
  brand?: string;
  oemNumbers: string[];
  offers: ProductOffer[];
};

export type GetProductInput = {
  productId: string;
  vehicleId?: string;
};
