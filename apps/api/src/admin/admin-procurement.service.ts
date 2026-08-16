import { Inject, Injectable } from '@nestjs/common';
import {
  ADMIN_PROCUREMENT_REPOSITORY,
  type AdminProcurementRepository,
} from './admin-procurement.repository';
import type {
  ApprovedProcurement,
  ApproveProcurementInput,
  ListProcurementQueueInput,
  ProcurementQueue,
} from './admin-procurement.types';

@Injectable()
export class AdminProcurementService {
  constructor(
    @Inject(ADMIN_PROCUREMENT_REPOSITORY)
    private readonly repository: AdminProcurementRepository,
  ) {}

  approveProcurement(
    input: ApproveProcurementInput,
  ): Promise<ApprovedProcurement> {
    return this.repository.approve(input);
  }

  listProcurementQueue(
    input: ListProcurementQueueInput,
  ): Promise<ProcurementQueue> {
    return this.repository.listQueue(input);
  }
}
