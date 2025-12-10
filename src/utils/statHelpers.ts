import { Stats } from 'graphql/generated';
import { Price } from '../../types';

export function findCheapestChargingWindow(prices: Price[], hours: number) {
  const windowSize = hours * 4; // 15min entries

  if (!prices || prices.length < windowSize) {
    return [];
  }

  let cheapestWindow: { value: number; timestamp: string }[] = [];
  let minSum = Number.POSITIVE_INFINITY;

  for (let i = 0; i <= prices.length - windowSize; i++) {
    const window = prices.slice(i, i + windowSize);
    const sum = window.reduce((acc, item) => acc + item.value, 0);

    if (sum < minSum) {
      minSum = sum;
      cheapestWindow = window;
    }
  }

  return cheapestWindow;
}
export function isValidStats(stats: Stats | null | undefined): stats is Stats {
  return (
    stats !== null &&
    stats !== undefined &&
    typeof stats.minPrice === 'number' &&
    typeof stats.maxPrice === 'number' &&
    typeof stats.avgPrice === 'number'
  );
}
