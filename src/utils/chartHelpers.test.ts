import { mapPricesToChartData, toHourlyAverages } from './chartHelpers';
import { createPrices } from './testHelpers';
import * as trimHelpers from './trimHelpers';

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

describe('toHourlyAverages', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('calls trimToFullHours with input prices', () => {
    const input = createPrices([10, 20, 30, 40]);

    jest.spyOn(trimHelpers, 'trimToFullHours').mockReturnValue(input);

    toHourlyAverages(input);

    expect(trimHelpers.trimToFullHours).toHaveBeenCalledWith(input);
  });

  test('calculates one hourly average correctly from 4 values', () => {
    const input = createPrices([10, 20, 30, 40]);

    jest.spyOn(trimHelpers, 'trimToFullHours').mockReturnValue(input);

    const result = toHourlyAverages(input);

    expect(result).toEqual([
      {
        timestamp: input[0].timestamp,
        value: 25, // (10+20+30+40)/4
        resolutionMinutes: '60',
      },
    ]);
  });

  test('calculates multiple hourly averages correctly', () => {
    const input = createPrices([10, 20, 30, 40, 50, 60, 70, 80]);

    jest.spyOn(trimHelpers, 'trimToFullHours').mockReturnValue(input);

    const result = toHourlyAverages(input);

    expect(result).toEqual([
      {
        timestamp: input[0].timestamp,
        value: 25,
        resolutionMinutes: '60',
      },
      {
        timestamp: input[4].timestamp,
        value: 65,
        resolutionMinutes: '60',
      },
    ]);
  });

  test('returns empty array when trimmed data is empty', () => {
    jest.spyOn(trimHelpers, 'trimToFullHours').mockReturnValue([]);

    const result = toHourlyAverages([]);

    expect(result).toEqual([]);
  });
});
