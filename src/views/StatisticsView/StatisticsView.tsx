import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { addMinutes, format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-native';
import { calculateChartConfig, getDisplayedData, mapPricesToChartData } from 'utils/chartHelpers';
import styles from './styles';
import theme from 'theme';
import { Button as CustomButton } from 'components/Button/Button';
import { Card } from 'components/Card/Card';
import { calculateCurrentIndex, useCurrentPrice } from 'hooks/useCurrentPrice';
import {
  findCheapestChargingWindow,
  formatPrice,
  getFuturePrices,
  isValidStats,
} from 'utils/statHelpers';
import { StatIntervalMinutes, PriceProps } from '../../../types';
import { usePullToRefresh } from 'hooks/usePullToRefresh';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Statistics = ({ prices }: PriceProps) => {
  const [chargingHours, setChargingHours] = useState(3);
  const { priceData, loading, error, stats, refetch } = prices;
  const chargingData = getFuturePrices(priceData);

  const cheapestWindowPrices = findCheapestChargingWindow(chargingData, chargingHours);
  const [showDetails, setShowDetails] = useState(false);
  const [interval, setInterval] = useState<StatIntervalMinutes>(15);

  const navigate = useNavigate();
  const goToChart = () => navigate('/chart');

  const displayedData = useMemo(() => getDisplayedData(priceData, interval), [priceData, interval]);
  const chartData = useMemo(() => mapPricesToChartData(displayedData), [displayedData]);
  const { spacing } = calculateChartConfig(chartData, screenWidth);
  const { currentPrice } = useCurrentPrice(priceData);
  const { refreshing, onRefresh } = usePullToRefresh(refetch);

  const computedScrollIndex = useMemo(() => {
    if (!displayedData.length) return 0;
    return calculateCurrentIndex(displayedData, interval);
  }, [displayedData, interval]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.defaultText}>Loading data...</Text>
      </View>
    );
  }

  if (error) return <Text style={styles.defaultText}>{error.message}</Text>;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Chart */}
      <Card style={styles.cardPaddingSmallLeft}>
        {computedScrollIndex !== undefined && (
          <BarChart
            data={chartData}
            spacing={spacing - 25}
            barWidth={15}
            minHeight={5}
            height={screenHeight - 550}
            noOfSections={6}
            nestedScrollEnabled
            scrollToIndex={computedScrollIndex}
            yAxisColor={theme.colors.primary}
            xAxisLabelTextStyle={styles.defaultText}
            yAxisTextStyle={styles.defaultText}
            verticalLinesColor="rgba(14,164,164,0.5)"
            xAxisThickness={1}
            xAxisColor={theme.colors.primary}
            color={theme.colors.primary}
          />
        )}
        <View style={styles.buttonRow}>
          <CustomButton label="15min" onPress={() => setInterval(15)} />
          <View style={styles.spacer} />
          <CustomButton label="1h" onPress={() => setInterval(60)} />
        </View>
      </Card>
      {/* Stats + Current Price */}
      {isValidStats(stats) && typeof currentPrice === 'number' && (
        <Card style={styles.statsCard}>
          <View>
            <Text style={styles.title}>Statistics</Text>
            <Text style={styles.text}>Min: {formatPrice(stats.minPrice)}¢</Text>
            <Text style={styles.text}>Max: {formatPrice(stats.maxPrice)}¢</Text>
            <Text style={styles.text}>Avg: {formatPrice(stats.avgPrice)}¢</Text>
          </View>

          <View style={styles.alignCenter}>
            <Text style={styles.title}>Current Price</Text>
            <Text style={styles.text}>{currentPrice.toFixed(3)}¢</Text>
          </View>
        </Card>
      )}
      {/* Cheapest Window */}
      <Card>
        <Text style={styles.title}>Cheapest {chargingHours}-hour Window</Text>

        <TextInput
          style={styles.input}
          value={String(chargingHours)}
          keyboardType="numeric"
          onChangeText={(text) => setChargingHours(Number(text))}
          maxLength={2}
        />

        {cheapestWindowPrices.length > 0 && (
          <>
            <Text style={styles.text}>
              From{' '}
              <Text style={styles.bold}>
                {format(parseISO(cheapestWindowPrices[0].timestamp), 'HH:mm')}
              </Text>{' '}
              to{' '}
              <Text style={styles.bold}>
                {format(
                  addMinutes(parseISO(cheapestWindowPrices.at(-1)?.timestamp ?? ''), 15),
                  'HH:mm',
                )}
              </Text>
            </Text>

            <View style={styles.avgRow}>
              <Text style={styles.text}>
                Avg price:{' '}
                <Text style={styles.bold}>
                  {(
                    cheapestWindowPrices.reduce((sum, p) => sum + p.value, 0) /
                    cheapestWindowPrices.length
                  ).toFixed(3)}
                  ¢
                </Text>
              </Text>

              <CustomButton
                label={showDetails ? 'Hide details' : 'Show details'}
                onPress={() => setShowDetails((prev) => !prev)}
                style={styles.detailButton}
              />
            </View>

            {showDetails &&
              cheapestWindowPrices.map((entry, idx) => (
                <Text key={idx} style={styles.item}>
                  {format(parseISO(entry.timestamp), 'HH:mm')} –{' '}
                  {format(addMinutes(parseISO(entry.timestamp), 15), 'HH:mm')}:{' '}
                  {entry.value.toFixed(3)}¢
                </Text>
              ))}
          </>
        )}
      </Card>
      <View style={styles.button}>
        <CustomButton label="Go to Chart" onPress={goToChart} />
      </View>
    </ScrollView>
  );
};

export default Statistics;
