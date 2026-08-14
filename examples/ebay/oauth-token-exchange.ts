/** Example only: client-credentials token for eBay application access (e.g. Browse).
 * Do not log client secrets or access tokens.
 */
export async function getEbayApplicationToken() {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  const oauthBase = process.env.EBAY_OAUTH_BASE_URL;
  if (!clientId || !clientSecret || !oauthBase) throw new Error('Missing eBay OAuth config');

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'https://api.ebay.com/oauth/api_scope',
  });

  const response = await fetch(`${oauthBase}/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`eBay OAuth failed (${response.status})`);
  }
  const token = await response.json() as { access_token: string; expires_in: number; token_type: string };
  return token;
}
