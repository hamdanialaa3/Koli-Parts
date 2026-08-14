export type SupplierCode = 'EBAY' | 'B2B_WHOLESALER' | 'DIRECT_SELLER';

export interface SupplierCapabilities {
  liveInventory: boolean;
  automatedOrdering: boolean;
  trackingApi: boolean;
  cancellationApi: boolean;
  returnsApi: boolean;
  neutralPackagingGuaranteed: boolean;
}

export interface SupplierSearchInput {
  query: string;
  marketplace?: string;
  limit?: number;
}

export interface SupplierListingRef {
  supplier: SupplierCode;
  externalId: string;
  url?: string;
}

export interface SupplierQuote {
  listing: SupplierListingRef;
  priceMinor: number;
  currency: string;
  shippingMinor: number;
  available: boolean;
  fetchedAt: string;
  expiresAt?: string;
}

export interface SupplierAdapter {
  readonly code: SupplierCode;
  readonly capabilities: SupplierCapabilities;
  search(input: SupplierSearchInput): Promise<SupplierListingRef[]>;
  quote(ref: SupplierListingRef): Promise<SupplierQuote>;
  placeOrder?(input: unknown): Promise<unknown>;
  getOrderStatus?(externalOrderId: string): Promise<unknown>;
  getTracking?(externalOrderId: string): Promise<unknown>;
  cancelOrder?(externalOrderId: string): Promise<unknown>;
}
