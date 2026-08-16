import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { CatalogService } from './catalog.service';
import { normalizeIdentifierQuery } from './search-normalization';

const searchQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(120),
    vehicleId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).default(1),
  })
  .strict();

@Controller('search')
export class SearchController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  searchParts(@Query() query: unknown) {
    const parsedQuery = searchQuerySchema.safeParse(query);
    if (!parsedQuery.success) {
      throw new BadRequestException('Invalid search query');
    }

    return this.catalogService.searchParts({
      query: parsedQuery.data.q,
      page: parsedQuery.data.page,
      identifierQuery: normalizeIdentifierQuery(parsedQuery.data.q),
      vehicleId: parsedQuery.data.vehicleId,
    });
  }
}
