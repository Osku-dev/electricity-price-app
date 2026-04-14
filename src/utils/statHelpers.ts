import { Stats } from 'graphql/generated';
import { Price } from '../../types';
import { parseISO, addMinutes } from 'date-fns';

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

export function getFuturePrices(prices: Price[]): Price[] {
  const now = new Date();

  return prices.filter((price) => {
    const start = parseISO(price.timestamp);
    const end = addMinutes(start, 15);
    return (now >= start && now < end) || start > now;
  });
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

export function formatPrice(value: number | null | undefined, decimals = 3): string {
  return value != null ? value.toFixed(decimals) : '-';
}
