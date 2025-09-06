export interface Price {
  startDate: string;
  endDate: string;
  price: number;
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
