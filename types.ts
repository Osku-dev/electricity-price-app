import usePrices from 'hooks/usePrices';

export interface Price {
  timestamp: string;
  value: number;
  resolutionMinutes: string;
}

export type Stats = {
  minPrice?: number | null;
  maxPrice?: number | null;
  avgPrice?: number | null;
};

export interface ChartPoint {
  value: number;
  label: string;
}

export type PriceProps = {
  prices: ReturnType<typeof usePrices>;
};

export type ChartIntervals = 1 | 3;

export type StatIntervalMinutes = 15 | 60;
