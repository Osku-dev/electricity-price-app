export interface Price {
  timestamp: string;
  value: number;
  resolutionMinutes: string;
}

export interface Stats {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

export interface ChartPoint {
  value: number;
  label: string;
}
