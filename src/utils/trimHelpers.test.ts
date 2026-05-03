import { createPrices } from './testHelpers';
import { trimToFullHours } from './trimHelpers';

describe('trimToFullHours', () => {
  test('returns empty array if input is empty', () => {
    expect(trimToFullHours([])).toEqual([]);
  });

  test('does not trim if already aligned to full hours', () => {
    const prices = createPrices([1, 2, 3, 4]); // 00:00 → 00:45

    const result = trimToFullHours(prices);

    expect(result).toEqual(prices);
  });

  test('returns empty array if no full hour window exists after trimming start', () => {
    const prices = createPrices([1, 2, 3, 4, 5]);

    const misaligned = prices.slice(1); // starts at 00:15

    const result = trimToFullHours(misaligned);

    expect(result).toEqual([]);
  });

  test('trims end until last 45 minutes block', () => {
    const prices = createPrices([1, 2, 3, 4, 5, 6]);
    // up to 01:15

    const result = trimToFullHours(prices);

    const last = result[result.length - 1];
    expect(last.timestamp).toContain(':45');
  });

  test('returns empty array if trimming removes all data', () => {
    const prices = createPrices([1, 2, 3, 4, 5, 6, 7, 8]);

    const misaligned = prices.slice(1, 7);

    const result = trimToFullHours(misaligned);

    expect(result).toEqual([]);
  });

  test('returns empty array if no complete hour window exists', () => {
    const prices = createPrices([1, 2, 3]); // 00:00, 00:15, 00:30

    const result = trimToFullHours(prices);

    // no full hour block (missing :45 end)
    expect(result).toEqual([]);
  });
});
