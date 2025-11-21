export interface Price {
  timestamp: string;
  value: number;
  resolutionMinutes: string;
}

export interface Stats {
  min: number;
  max: number;
  average: number;
}

export interface ChartPoint {
  value: number;
  label: string;
}
