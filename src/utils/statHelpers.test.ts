import { Price } from '../../types';
import { findCheapestChargingWindow, getFuturePrices } from './statHelpers';

const createPrices = (values: number[]): Price[] => {
  return values.map((value, i) => {
    const totalMinutes = i * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      value,
      timestamp: `2026-01-01T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      resolutionMinutes: '15',
    };
  });
};
describe('findCheapestChargingWindow', () => {
  test('returns empty array if prices is empty', () => {
    const result = findCheapestChargingWindow([], 1);
    expect(result).toEqual([]);
  });

  test('returns empty array if not enough data for window', () => {
    const prices = createPrices([1, 2, 3]);
    const result = findCheapestChargingWindow(prices, 1);

    expect(result).toEqual([]);
  });

  test('returns correct window for 1 hour (4 entries)', () => {
    const prices = createPrices([10, 10, 10, 10, 1, 1, 1, 1, 5, 5, 5, 5]);

    const result = findCheapestChargingWindow(prices, 1);

    expect(result).toHaveLength(4);
    expect(result.map((p) => p.value)).toEqual([1, 1, 1, 1]);
  });

  test('returns correct window for multiple hours', () => {
    const prices = createPrices([10, 10, 10, 10, 5, 5, 5, 5, 1, 1, 1, 1, 2, 2, 2, 2]);

    const result = findCheapestChargingWindow(prices, 2);

    expect(result).toHaveLength(8);
    expect(result.map((p) => p.value)).toEqual([1, 1, 1, 1, 2, 2, 2, 2]);
  });

  test('returns first cheapest window if sums are equal', () => {
    const prices = createPrices([1, 1, 1, 1, 1, 1, 1, 1]);

    const result = findCheapestChargingWindow(prices, 1);

    expect(result.map((p) => p.value)).toEqual([1, 1, 1, 1]);
    expect(result[0].timestamp).toBe('2026-01-01T00:00');
  });

  test('handles decimal values correctly', () => {
    const prices = createPrices([1.1, 1.1, 1.1, 1.1, 1.05, 1.05, 1.05, 1.05]);

    const result = findCheapestChargingWindow(prices, 1);

    expect(result.map((p) => p.value)).toEqual([1.05, 1.05, 1.05, 1.05]);
  });
});

describe('getFuturePrices', () => {
  const BASE_TIME = new Date('2026-01-01T01:30:00');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(BASE_TIME);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('includes current interval price', () => {
    const prices = createPrices(new Array(10).fill(1));

    console.log(prices);

    const result = getFuturePrices(prices);

    // 01:30 belongs to interval starting at 01:30
    expect(result[0].timestamp).toBe('2026-01-01T01:30');
  });

  test('includes future prices', () => {
    const prices = createPrices(new Array(12).fill(1));

    const result = getFuturePrices(prices);

    // index 6 = 01:30 → current
    // everything after should be included
    const expected = prices.slice(6);

    expect(result).toEqual(expected);
  });

  test('excludes past prices', () => {
    const prices = createPrices(new Array(6).fill(1)); // up to 01:15

    const result = getFuturePrices(prices);

    expect(result).toEqual([]);
  });

  test('includes current + future, excludes past', () => {
    const prices = createPrices(new Array(10).fill(1));

    const result = getFuturePrices(prices);

    expect(result.map((p) => p.timestamp)).toEqual([
      '2026-01-01T01:30',
      '2026-01-01T01:45',
      '2026-01-01T02:00',
      '2026-01-01T02:15',
    ]);
  });
});
