import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_SEARCH_PROVIDER,
  type CatalogSearchProvider,
} from './catalog-search.provider';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from './catalog.repository';
import type { GetProductInput, SearchPartsInput } from './catalog.types';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly repository: CatalogRepository,
    @Inject(CATALOG_SEARCH_PROVIDER)
    private readonly searchProvider: CatalogSearchProvider,
  ) {}

  getProduct(input: GetProductInput) {
    return this.repository.findProduct(input);
  }

  searchParts(input: SearchPartsInput) {
    return this.searchProvider.searchParts(input);
  }
}
