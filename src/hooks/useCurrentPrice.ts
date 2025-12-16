import { addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { Price } from '../../types';

const SLOT_MINUTES = 15;
const SLOT_MS = SLOT_MINUTES * 60 * 1000;

export function useCurrentPrice(prices: Price[]) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!prices || prices.length === 0) {
      setCurrentPrice(null);
      return;
    }

    const updateCurrentPrice = () => {
      const now = new Date();

      const currentSlot = prices.find((price) => {
        const start = parseISO(price.timestamp);
        const end = addMinutes(start, SLOT_MINUTES);
        return isWithinInterval(now, { start, end });
      });

      setCurrentPrice(currentSlot ? currentSlot.value : null);
    };

    updateCurrentPrice();

    const nowMs = Date.now();
    const elapsedInSlot = nowMs % SLOT_MS;
    const msUntilNextSlot = SLOT_MS - elapsedInSlot;

    const timeoutId = setTimeout(() => {
      updateCurrentPrice();
      setInterval(updateCurrentPrice, SLOT_MS);
    }, msUntilNextSlot);

    return () => clearTimeout(timeoutId);
  }, [prices]);

  return currentPrice;
}
