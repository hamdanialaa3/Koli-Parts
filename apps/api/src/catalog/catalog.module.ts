import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
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
  ],
})
export class CatalogModule {}
