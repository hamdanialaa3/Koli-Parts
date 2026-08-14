import { getEbayApplicationToken } from './oauth-token-exchange';

export async function browseEbayDe(query: string) {
  const token = await getEbayApplicationToken();
  const apiBase = process.env.EBAY_API_BASE_URL ?? 'https://api.ebay.com';
  const url = new URL(`${apiBase}/buy/browse/v1/item_summary/search`);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '20');
  url.searchParams.set('filter', 'buyingOptions:{FIXED_PRICE}');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_DE',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Browse failed (${response.status})`);
  return response.json();
}
