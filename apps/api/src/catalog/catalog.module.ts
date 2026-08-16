import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import {
  CATALOG_SEARCH_PROVIDER,
  PostgresCatalogSearchProvider,
} from './catalog-search.provider';
import {
  CATALOG_REPOSITORY,
  PostgresCatalogRepository,
} from './catalog.repository';
import { CatalogService } from './catalog.service';
import { SearchController } from './search.controller';

@Module({
  controllers: [CatalogController, SearchController],
  providers: [
    CatalogService,
    {
      provide: CATALOG_REPOSITORY,
      useClass: PostgresCatalogRepository,
    },
    {
      provide: CATALOG_SEARCH_PROVIDER,
      useClass: PostgresCatalogSearchProvider,
    },
  ],
})
export class CatalogModule {}
