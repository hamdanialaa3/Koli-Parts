import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { Config } from '../config.schema';
import type {
  GetProductInput,
  ProductDetail,
  ProductOffer,
  SearchItem,
  SearchPartsInput,
  SearchResponse,
} from './catalog.types';

export const CATALOG_REPOSITORY = Symbol('CATALOG_REPOSITORY');

export interface CatalogRepository {
  findProduct(input: GetProductInput): Promise<ProductDetail | null>;
  searchParts(input: SearchPartsInput): Promise<SearchResponse>;
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

type SearchRow = {
  product_id: string;
  title: string;
  brand: string | null;
  amount_minor: string;
  total_count: string;
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

  async searchParts(input: SearchPartsInput): Promise<SearchResponse> {
    const limit = 20;
    const offset = (input.page - 1) * limit;
    const pattern = `%${input.query}%`;
    const result = await this.pool.query<SearchRow>(
      `WITH matching_products AS (
         SELECT p.id AS product_id,
                p.canonical_title AS title,
                p.brand,
                MIN(sl.price_minor) AS amount_minor
           FROM products p
           JOIN supplier_listings sl
             ON sl.product_id = p.id
            AND sl.available = true
            AND sl.currency = 'EUR'
           LEFT JOIN product_identifiers pi ON pi.product_id = p.id
          WHERE p.canonical_title ILIKE $1
             OR p.brand ILIKE $1
             OR sl.title ILIKE $1
             OR sl.external_item_id ILIKE $1
             OR pi.value ILIKE $1
             OR pi.normalized_value ILIKE $1
          GROUP BY p.id, p.canonical_title, p.brand
       )
       SELECT product_id, title, brand, amount_minor,
              count(*) OVER() AS total_count
         FROM matching_products
        ORDER BY amount_minor ASC, title ASC, product_id ASC
        LIMIT $2 OFFSET $3`,
      [pattern, limit, offset],
    );

    return {
      items: result.rows.map((row) => this.toSearchItem(row)),
      page: input.page,
      total: result.rows[0] ? Number(result.rows[0].total_count) : 0,
    };
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

  private toSearchItem(row: SearchRow): SearchItem {
    return {
      productId: row.product_id,
      title: row.title,
      brand: row.brand ?? undefined,
      price: {
        amountMinor: Number(row.amount_minor),
        currency: 'EUR',
      },
      fitment: {
        status: 'UNKNOWN',
        ruleScore: 0,
        calibratedProbability: null,
        evidence: [],
        warnings: ['Fitment has not been evaluated for this search result'],
      },
    };
  }
}
