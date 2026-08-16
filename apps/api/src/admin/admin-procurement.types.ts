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
