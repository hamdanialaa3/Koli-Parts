export type ApproveProcurementInput = {
  procurementId: string;
  actorUserId: string;
  idempotencyKey: string;
  reason: string;
};

export type ApprovedProcurement = {
  procurementId: string;
  status: 'APPROVED';
  approvedBy: string;
  approvedAt: string;
  idempotentReplay: boolean;
};

export type ProcurementQueueStatus = 'PENDING' | 'REVIEW';

export type ListProcurementQueueInput = {
  status?: ProcurementQueueStatus;
  limit: number;
};

export type ProcurementQueueItem = {
  procurementId: string;
  orderId: string;
  procurementStatus: ProcurementQueueStatus;
  orderStatus: string;
  supplier: string;
  totalMinor: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type ProcurementQueue = {
  items: ProcurementQueueItem[];
  limit: number;
};
