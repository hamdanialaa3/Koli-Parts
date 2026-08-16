import { Inject, Injectable } from '@nestjs/common';
import {
  CATALOG_REPOSITORY,
  type CatalogRepository,
} from './catalog.repository';
import type { GetProductInput } from './catalog.types';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly repository: CatalogRepository,
  ) {}

  getProduct(input: GetProductInput) {
    return this.repository.findProduct(input);
  }
}
