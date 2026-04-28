import { parseISO } from 'date-fns';
import { Price } from '../../types';

export function trimToFullHours(prices: Price[]): Price[] {
  if (prices.length === 0) return prices;

  let start = 0;
  let end = prices.length - 1;

  while (start < prices.length) {
    const minutes = parseISO(prices[start].timestamp).getMinutes();
    if (minutes === 0) break;
    start++;
  }

  while (end >= start) {
    const minutes = parseISO(prices[end].timestamp).getMinutes();
    if (minutes === 45) break;
    end--;
  }

  if (start > end) return [];

  return prices.slice(start, end + 1);
}
