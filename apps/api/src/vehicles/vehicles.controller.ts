import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CsrfGuard } from '../auth/csrf.guard';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { VehiclesService } from './vehicles.service';

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess(
    (value) =>
      typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.string().trim().min(1).max(maxLength).optional(),
  );

const vinSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed.toUpperCase();
  },
  z
    .string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/)
    .optional(),
);

const createVehicleSchema = z
  .object({
    vin: vinSchema,
    make: z.string().trim().min(1).max(80),
    model: z.string().trim().min(1).max(120),
    productionYear: z.number().int().min(1886).max(2200).optional(),
    engineCode: optionalTrimmedString(80),
  })
  .strict();

const listVehiclesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

@Controller('vehicles')
@UseGuards(SessionAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  listVehicles(@Query() query: unknown, @Req() request: Request) {
    const authUser = this.getAuthUser(request);
    const parsedQuery = listVehiclesQuerySchema.safeParse(query);
    if (!parsedQuery.success) {
      throw new BadRequestException('Invalid vehicles query');
    }

    return this.vehiclesService.listVehicles({
      userId: authUser.userId,
      limit: parsedQuery.data.limit,
    });
  }

  @Post()
  @UseGuards(CsrfGuard)
  createVehicle(@Body() body: unknown, @Req() request: Request) {
    const authUser = this.getAuthUser(request);
    const parsedBody = createVehicleSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException('Invalid vehicle payload');
    }

    return this.vehiclesService.createVehicle({
      userId: authUser.userId,
      ...parsedBody.data,
    });
  }

  private getAuthUser(request: Request) {
    const authRequest = request as AuthenticatedRequest;
    if (!authRequest.authUser) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    return authRequest.authUser;
  }
}
