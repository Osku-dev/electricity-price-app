import { useEffect, useState } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { getPrices, getStats } from '../services/Prices';
import type { Price, Stats } from '../../types';

export function usePriceData(intervalMs = 5 * 60 * 1000) {
  const [priceData, setPriceData] = useState<Price[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>();
  const [pricesLoading, setPricesLoading] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const [rawPrices, statsRes] = await Promise.all([getPrices(), getStats()]);

        setPriceData(rawPrices);
        setStats(statsRes);

        const now = new Date();
        const currentSlot = rawPrices.find((price) =>
          isWithinInterval(now, {
            start: parseISO(price.startDate),
            end: parseISO(price.endDate),
          }),
        );
        setCurrentPrice(currentSlot ? currentSlot.value : null);
      } catch (err) {
        console.error('Error fetching price or stats data', err);
        setPriceError('Failed to load price data');
      } finally {
        setPricesLoading(false);
      }
    };

    fetchData();
    timer = setInterval(fetchData, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return {
    priceData,
    stats,
    currentPrice,
    highlightedIndex,
    setHighlightedIndex,
    pricesLoading,
    priceError,
  };
}
