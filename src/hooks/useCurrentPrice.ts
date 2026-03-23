import { addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Price } from '../../types';

const slotMinutes = 15;
const TICK_MS = 30_000;

export function useCurrentPrice(prices: Price[]) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [currentPriceIndex, setCurrentPriceIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!prices.length) {
      setCurrentPrice(null);
      setCurrentPriceIndex(null);
      return;
    }

    const update = () => {
      const now = new Date();

      const index = prices.findIndex((price) => {
        const start = parseISO(price.timestamp);
        const end = addMinutes(start, slotMinutes);
        return isWithinInterval(now, { start, end });
      });

      if (index === -1) {
        setCurrentPrice(null);
        setCurrentPriceIndex(null);
        return;
      }

      setCurrentPrice(prices[index].value);
      setCurrentPriceIndex(index);
    };

    update();
    const intervalId = setInterval(update, TICK_MS);

    return () => clearInterval(intervalId);
  }, [prices]);

  return { currentPrice, currentPriceIndex };
}
