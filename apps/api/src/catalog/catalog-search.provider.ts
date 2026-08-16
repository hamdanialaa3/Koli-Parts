import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { Config } from '../config.schema';
import type {
  SearchItem,
  SearchPartsInput,
  SearchResponse,
} from './catalog.types';

export const CATALOG_SEARCH_PROVIDER = Symbol('CATALOG_SEARCH_PROVIDER');

export interface CatalogSearchProvider {
  searchParts(input: SearchPartsInput): Promise<SearchResponse>;
}

type SearchRow = {
  product_id: string;
  title: string;
  brand: string | null;
  amount_minor: string;
  total_count: string;
};

@Injectable()
export class PostgresCatalogSearchProvider
  implements CatalogSearchProvider, OnModuleDestroy
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

  async searchParts(input: SearchPartsInput): Promise<SearchResponse> {
    const limit = 20;
    const offset = (input.page - 1) * limit;
    const pattern = `%${input.query}%`;
    const identifierPattern = input.identifierQuery
      ? `%${input.identifierQuery}%`
      : null;
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
             OR (
               $2::text IS NOT NULL
               AND (
                 regexp_replace(upper(sl.external_item_id), '[^A-Z0-9]', '', 'g') ILIKE $2
                 OR regexp_replace(upper(pi.value), '[^A-Z0-9]', '', 'g') ILIKE $2
                 OR upper(pi.normalized_value) ILIKE $2
               )
             )
          GROUP BY p.id, p.canonical_title, p.brand
       )
       SELECT product_id, title, brand, amount_minor,
              count(*) OVER() AS total_count
         FROM matching_products
        ORDER BY amount_minor ASC, title ASC, product_id ASC
        LIMIT $3 OFFSET $4`,
      [pattern, identifierPattern, limit, offset],
    );

    return {
      items: result.rows.map((row) => this.toSearchItem(row)),
      page: input.page,
      total: result.rows[0] ? Number(result.rows[0].total_count) : 0,
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
