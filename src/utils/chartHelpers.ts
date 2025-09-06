import { format, parseISO } from 'date-fns';
import { Price, ChartPoint } from '../../types';

export function mapPricesToChartData(prices: Price[]): ChartPoint[] {
  return prices.map((price) => ({
    value: price.price,
    label: format(parseISO(price.startDate), 'HH'),
  }));
}

export function calculateChartConfig(
  chartData: ChartPoint[],
  screenWidth: number,
  pointsToShow = 10,
  step = 5,
) {
  const pointWidth = screenWidth / pointsToShow;
  const chartWidth = Math.max(screenWidth, chartData.length * pointWidth);
  const spacing = chartWidth / chartData.length;

  const maxPrice = Math.max(...chartData.map((d) => d.value));
  const minPrice = Math.min(...chartData.map((d) => d.value));

  const minY = Math.floor(minPrice / step) * step;
  const maxY = Math.ceil(maxPrice / step) * step;

  const yLabels: string[] = [];
  for (let v = minY; v <= maxY; v += step) {
    yLabels.push(v.toString());
  }

  return { chartWidth, spacing, yLabels, minY, maxY };
}
