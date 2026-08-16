import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ServiceUnavailableException,
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
const requiredVinSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    return value.trim().toUpperCase();
  },
  z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/),
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

const updateVehicleSchema = createVehicleSchema.partial();
const parseVinSchema = z.object({ vin: requiredVinSchema }).strict();
const listVehiclesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});
const vehicleIdParamSchema = z.object({ vehicleId: z.string().uuid() });

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

  @Get(':vehicleId')
  async getVehicle(@Param() params: unknown, @Req() request: Request) {
    const authUser = this.getAuthUser(request);
    const parsedParams = vehicleIdParamSchema.safeParse(params);
    if (!parsedParams.success) {
      throw new BadRequestException('Invalid vehicle id');
    }

    const vehicle = await this.vehiclesService.getVehicle({
      userId: authUser.userId,
      vehicleId: parsedParams.data.vehicleId,
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
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

  @Post('parse-vin')
  @UseGuards(CsrfGuard)
  parseVin(@Body() body: unknown) {
    const parsedBody = parseVinSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new BadRequestException('Invalid VIN payload');
    }

    const candidate = this.vehiclesService.parseVin(parsedBody.data.vin);
    if (!candidate) {
      throw new ServiceUnavailableException('VIN provider unavailable');
    }
    return candidate;
  }

  @Post(':vehicleId/default')
  @UseGuards(CsrfGuard)
  async setDefaultVehicle(@Param() params: unknown, @Req() request: Request) {
    const authUser = this.getAuthUser(request);
    const parsedParams = vehicleIdParamSchema.safeParse(params);
    if (!parsedParams.success) {
      throw new BadRequestException('Invalid vehicle id');
    }

    const vehicle = await this.vehiclesService.setDefaultVehicle({
      userId: authUser.userId,
      vehicleId: parsedParams.data.vehicleId,
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  @Patch(':vehicleId')
  @UseGuards(CsrfGuard)
  async updateVehicle(
    @Param() params: unknown,
    @Body() body: unknown,
    @Req() request: Request,
  ) {
    const authUser = this.getAuthUser(request);
    const parsedParams = vehicleIdParamSchema.safeParse(params);
    const parsedBody = updateVehicleSchema.safeParse(body);
    if (!parsedParams.success || !parsedBody.success) {
      throw new BadRequestException('Invalid vehicle update');
    }
    if (!Object.values(parsedBody.data).some((value) => value !== undefined)) {
      throw new BadRequestException(
        'Vehicle update requires at least one field',
      );
    }

    const vehicle = await this.vehiclesService.updateVehicle({
      userId: authUser.userId,
      vehicleId: parsedParams.data.vehicleId,
      ...parsedBody.data,
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  @Delete(':vehicleId')
  @UseGuards(CsrfGuard)
  async deleteVehicle(@Param() params: unknown, @Req() request: Request) {
    const authUser = this.getAuthUser(request);
    const parsedParams = vehicleIdParamSchema.safeParse(params);
    if (!parsedParams.success) {
      throw new BadRequestException('Invalid vehicle id');
    }

    const result = await this.vehiclesService.deleteVehicle({
      userId: authUser.userId,
      vehicleId: parsedParams.data.vehicleId,
    });
    if (result.status === 'not_found') {
      throw new NotFoundException('Vehicle not found');
    }
    if (result.status === 'referenced') {
      throw new ConflictException('Vehicle is in use');
    }
    return result.vehicle;
  }

  private getAuthUser(request: Request) {
    const authRequest = request as AuthenticatedRequest;
    if (!authRequest.authUser) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    return authRequest.authUser;
  }
}
