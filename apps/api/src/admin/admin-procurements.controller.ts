import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../auth/auth.types';
import { CsrfGuard } from '../auth/csrf.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SessionAuthGuard } from '../auth/session-auth.guard';
import { AdminProcurementService } from './admin-procurement.service';

const paramsSchema = z.object({
  procurementId: z.string().uuid(),
});

const bodySchema = z.object({
  reason: z.string().trim().min(3).max(500),
});

const idempotencyKeySchema = z.string().min(16).max(200);

@Controller('admin/procurements')
@UseGuards(SessionAuthGuard, CsrfGuard, RolesGuard)
@Roles(['procurement_operator', 'admin', 'super_admin'])
export class AdminProcurementsController {
  constructor(private readonly service: AdminProcurementService) {}

  @Post(':procurementId/approve')
  approve(
    @Param() params: unknown,
    @Body() body: unknown,
    @Headers('idempotency-key') idempotencyKey: string | undefined,
    @Req() request: Request,
  ) {
    const parsedParams = paramsSchema.safeParse(params);
    const parsedBody = bodySchema.safeParse(body);
    const parsedIdempotencyKey = idempotencyKeySchema.safeParse(idempotencyKey);

    if (
      !parsedParams.success ||
      !parsedBody.success ||
      !parsedIdempotencyKey.success
    ) {
      throw new BadRequestException('Invalid procurement approval request');
    }

    const authRequest = request as AuthenticatedRequest;
    if (!authRequest.authUser) {
      throw new UnauthorizedException('Missing authenticated user');
    }

    return this.service.approveProcurement({
      procurementId: parsedParams.data.procurementId,
      actorUserId: authRequest.authUser.userId,
      idempotencyKey: parsedIdempotencyKey.data,
      reason: parsedBody.data.reason,
    });
  }
}
