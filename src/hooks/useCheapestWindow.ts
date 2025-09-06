import { useEffect, useState } from 'react';
import { Price } from '../../types';
import { getCheapestWindow } from 'services/Prices';

export function useCheapestWindow(hours: number) {
  const [cheapestWindowPrices, setCheapestWindowPrices] = useState<Price[]>([]);
  const [windowLoading, setWindowLoading] = useState<boolean>(true);
  const [windowError, setWindowError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWindow = async () => {
      setWindowLoading(true);
      setWindowError(null);

      try {
        const windowData = await getCheapestWindow(hours);
        setCheapestWindowPrices([...windowData].reverse());
      } catch (err) {
        console.error('Error fetching cheapest window', err);
        setWindowError('Failed to load cheapest window data');
      } finally {
        setWindowLoading(false);
      }
    };

    if (hours > 0) {
      fetchWindow();
    } else {
      setWindowLoading(false);
    }
  }, [hours]);

  return { cheapestWindowPrices, windowLoading, windowError };
}
