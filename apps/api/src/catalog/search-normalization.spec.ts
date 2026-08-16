import { normalizeIdentifierQuery } from './search-normalization';

describe('normalizeIdentifierQuery', () => {
  it('normalizes OEM and supplier identifiers by removing separators', () => {
    expect(normalizeIdentifierQuery(' 34 11-685 8910 ')).toBe('34116858910');
    expect(normalizeIdentifierQuery('ate 13.0460-7204.2')).toBe(
      'ATE13046072042',
    );
  });

  it('ignores identifier fragments that are too short to be useful', () => {
    expect(normalizeIdentifierQuery(' x-1 ')).toBeUndefined();
  });
});
