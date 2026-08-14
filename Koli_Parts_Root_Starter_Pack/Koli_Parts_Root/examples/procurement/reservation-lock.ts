/** Internal lock only. It does not reserve supplier/eBay inventory. */
export async function withProcurementLock<T>(
  redis: { set(k: string, v: string, opts: { NX: true; PX: number }): Promise<string | null>; del(k: string): Promise<number> },
  orderId: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const key = `procurement:lock:${orderId}`;
  const token = crypto.randomUUID();
  const acquired = await redis.set(key, token, { NX: true, PX: ttlMs });
  if (!acquired) throw new Error('PROCUREMENT_ALREADY_IN_PROGRESS');
  try {
    return await fn();
  } finally {
    // Production implementation should use compare-and-delete Lua to avoid deleting another owner's renewed lock.
    await redis.del(key);
  }
}
