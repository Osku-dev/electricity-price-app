import { format, parseISO } from 'date-fns';
import { Price, ChartPoint } from '../../types';

export function mapPricesToChartData(prices: Price[]): ChartPoint[] {
  return prices.map((price) => ({
    value: price.value,
    label: format(parseISO(price.timestamp), 'HH'),
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

export function trimToFullHours(prices: Price[]): Price[] {
  if (prices.length === 0) return prices;

  let start = 0;
  let end = prices.length - 1;

  while (start < prices.length) {
    const minutes = parseISO(prices[start].timestamp).getMinutes();
    if (minutes === 0) break;
    start++;
  }

  while (end >= start) {
    const minutes = parseISO(prices[end].timestamp).getMinutes();
    if (minutes === 45) break;
    end--;
  }

  return prices.slice(start, end + 1);
}

export function toHourlyAverages(prices: Price[]): Price[] {
  const HOURLY_BLOCK = 4;
  const result: Price[] = [];

  const alignedPrices = trimToFullHours(prices);

  for (let i = 0; i + HOURLY_BLOCK - 1 < alignedPrices.length; i += HOURLY_BLOCK) {
    const block = alignedPrices.slice(i, i + HOURLY_BLOCK);

    const avg = block.reduce((sum, p) => sum + p.value, 0) / HOURLY_BLOCK;

    result.push({
      timestamp: block[0].timestamp,
      value: Number(avg.toFixed(3)),
      resolutionMinutes: '60',
    });
  }

  return result;
}
