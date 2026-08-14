/** Provider-neutral webhook pattern. The exact eBay verification scheme depends on
 * the notification product/event actually enabled for the approved integration.
 */
export async function handleVerifiedProviderEvent(input: {
  providerEventId: string;
  eventType: string;
  payload: unknown;
  verified: boolean;
}) {
  if (!input.verified) throw new Error('Webhook verification failed');
  // 1) INSERT provider_event_id with UNIQUE constraint.
  // 2) If conflict: return success (already processed/received).
  // 3) Persist raw payload hash and minimal payload allowed by provider terms.
  // 4) Ack quickly; process business effects asynchronously.
  return { accepted: true };
}
