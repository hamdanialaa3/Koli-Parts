export function normalizeIdentifierQuery(query: string): string | undefined {
  const normalized = query.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return normalized.length >= 3 ? normalized : undefined;
}
