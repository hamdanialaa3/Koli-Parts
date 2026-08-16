import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { Config } from '../config.schema';
import type {
  GetProductInput,
  ProductDetail,
  ProductOffer,
} from './catalog.types';

export const CATALOG_REPOSITORY = Symbol('CATALOG_REPOSITORY');

export interface CatalogRepository {
  findProduct(input: GetProductInput): Promise<ProductDetail | null>;
}

type ProductRow = {
  id: string;
  title: string;
  brand: string | null;
  oem_numbers: string[] | null;
};

type ProductOfferRow = {
  supplier_listing_id: string;
  supplier: string;
  amount_minor: string;
};

@Injectable()
export class PostgresCatalogRepository
  implements CatalogRepository, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor(configService: ConfigService<Config, true>) {
    this.pool = new Pool({
      connectionString: configService.get('DATABASE_URL', { infer: true }),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async findProduct(input: GetProductInput): Promise<ProductDetail | null> {
    const product = await this.pool.query<ProductRow>(
      `SELECT p.id,
              p.canonical_title AS title,
              p.brand,
              COALESCE(
                array_agg(DISTINCT pi.value ORDER BY pi.value)
                  FILTER (WHERE upper(pi.type) IN ('OE', 'OEM')),
                ARRAY[]::text[]
              ) AS oem_numbers
         FROM products p
         LEFT JOIN product_identifiers pi ON pi.product_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, p.canonical_title, p.brand`,
      [input.productId],
    );

    if (!product.rows[0]) return null;

    const offers = await this.pool.query<ProductOfferRow>(
      `SELECT id AS supplier_listing_id,
              supplier,
              price_minor AS amount_minor
         FROM supplier_listings
        WHERE product_id = $1
          AND available = true
          AND currency = 'EUR'
        ORDER BY price_minor ASC, fetched_at DESC, id ASC`,
      [input.productId],
    );

    return this.toProductDetail(product.rows[0], offers.rows);
  }

  private toProductDetail(
    product: ProductRow,
    offerRows: ProductOfferRow[],
  ): ProductDetail {
    return {
      id: product.id,
      title: product.title,
      brand: product.brand ?? undefined,
      oemNumbers: product.oem_numbers ?? [],
      offers: offerRows.map((offer): ProductOffer => ({
        supplierListingId: offer.supplier_listing_id,
        supplier: offer.supplier,
        price: {
          amountMinor: Number(offer.amount_minor),
          currency: 'EUR',
        },
      })),
    };
  }
}
