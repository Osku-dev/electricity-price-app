import { addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { Price } from '../../types';
import { useEffect, useState } from 'react';

export function useCurrentPrice(prices: Price[]) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!prices || prices.length === 0) {
      setCurrentPrice(null);
      return;
    }

    const now = new Date();
    const currentSlot = prices.find((price) => {
      const start = parseISO(price.timestamp);
      const end = addMinutes(start, 15);

      return isWithinInterval(now, { start, end });
    });

    setCurrentPrice(currentSlot ? currentSlot.value : null);
  }, [prices]);

  return currentPrice;
}
