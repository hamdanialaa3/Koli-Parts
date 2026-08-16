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

export type FitmentSummary = {
  status: 'UNKNOWN';
  ruleScore: 0;
  calibratedProbability: null;
  evidence: Record<string, never>[];
  warnings: string[];
};

export type SearchItem = {
  productId: string;
  title: string;
  brand?: string;
  price: Money;
  fitment: FitmentSummary;
};

export type SearchResponse = {
  items: SearchItem[];
  page: number;
  total: number;
};

export type SearchPartsInput = {
  query: string;
  page: number;
  vehicleId?: string;
};
