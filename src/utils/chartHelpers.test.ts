import { mapPricesToChartData, trimToFullHours } from './chartHelpers';
import { createPrices } from './testHelpers';

describe('mapPricesToChartData', () => {
  test('maps a single price correctly', () => {
    const prices = createPrices([10]);

    const result = mapPricesToChartData(prices);

    expect(result).toEqual([
      {
        value: 10,
        label: '00',
      },
    ]);
  });

  test('maps multiple prices correctly with repeating hour labels', () => {
    const prices = createPrices([1, 2, 3, 4, 5]);

    const result = mapPricesToChartData(prices);

    expect(result).toEqual([
      { value: 1, label: '00' }, // 00:00
      { value: 2, label: '00' }, // 00:15
      { value: 3, label: '00' }, // 00:30
      { value: 4, label: '00' }, // 00:45
      { value: 5, label: '01' }, // 01:00
    ]);
  });

  test('returns empty array for empty input', () => {
    const result = mapPricesToChartData([]);

    expect(result).toEqual([]);
  });

  test('correctly rolls over to next hour', () => {
    const prices = createPrices([1, 2, 3, 4, 5, 6, 7, 8]);

    const result = mapPricesToChartData(prices);

    expect(result.map((p) => p.label)).toEqual([
      '00',
      '00',
      '00',
      '00', // first hour
      '01',
      '01',
      '01',
      '01', // second hour
    ]);
  });

  test('preserves values correctly', () => {
    const values = [5, 10, 15];
    const prices = createPrices(values);

    const result = mapPricesToChartData(prices);

    expect(result.map((p) => p.value)).toEqual(values);
  });
});

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
