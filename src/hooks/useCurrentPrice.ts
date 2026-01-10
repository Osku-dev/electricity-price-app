import { addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Price } from '../../types';

const SLOT_MINUTES = 15;
const TICK_MS = 30_000;

export function useCurrentPrice(prices: Price[]) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!prices.length) {
      setCurrentPrice(null);
      return;
    }

    const update = () => {
      const now = new Date();

      const slot = prices.find((price) => {
        const start = parseISO(price.timestamp);
        const end = addMinutes(start, SLOT_MINUTES);
        return isWithinInterval(now, { start, end });
      });

      setCurrentPrice(slot ? slot.value : null);
    };

    update();
    const intervalId = setInterval(update, TICK_MS);

    return () => clearInterval(intervalId);
  }, [prices]);

  return currentPrice;
}
