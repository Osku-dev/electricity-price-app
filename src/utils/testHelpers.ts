import { Price } from '../../types';

export function createPrices(values: number[], resolutionMinutes = 15): Price[] {
  return values.map((value, i) => {
    const totalMinutes = i * resolutionMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      value,
      timestamp: `2026-01-01T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      resolutionMinutes: String(resolutionMinutes),
    };
  });
}
