import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { CatalogService } from './catalog.service';

const productIdParamSchema = z.object({ productId: z.string().uuid() });
const getProductQuerySchema = z
  .object({
    vehicleId: z.string().uuid().optional(),
  })
  .strict();

@Controller('products')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get(':productId')
  async getProduct(@Param() params: unknown, @Query() query: unknown) {
    const parsedParams = productIdParamSchema.safeParse(params);
    const parsedQuery = getProductQuerySchema.safeParse(query);
    if (!parsedParams.success || !parsedQuery.success) {
      throw new BadRequestException('Invalid product request');
    }

    const product = await this.catalogService.getProduct({
      productId: parsedParams.data.productId,
      vehicleId: parsedQuery.data.vehicleId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
