import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { addMinutes, format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-native';
import { calculateChartConfig, mapPricesToChartData } from 'utils/chartHelpers';
import { usePrices } from 'hooks/usePrices';
import styles from './styles';
import theme from 'theme';
import { Button as CustomButton } from 'components/Button/Button';
import { Card } from 'components/Card/Card';
import { useCurrentPrice } from 'hooks/useCurrentPrice';
import { findCheapestChargingWindow, isValidStats } from 'utils/statHelpers';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Statistics = () => {
  const [chargingHours, setChargingHours] = useState(3);
  const { priceData, loading, error, stats } = usePrices();
  const currentPrice = useCurrentPrice(priceData);
  const cheapestWindowPrices = findCheapestChargingWindow(priceData, chargingHours);
  const [showDetails, setShowDetails] = useState(false);

  const navigate = useNavigate();
  const goToChart = () => navigate('/chart');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.defaultText}>Loading data...</Text>
      </View>
    );
  }

  if (error) return <Text style={styles.defaultText}>{error.message}</Text>;

  const chartData = mapPricesToChartData(priceData);
  const { spacing, yLabels } = calculateChartConfig(chartData, screenWidth);

  return (
    <ScrollView style={styles.container}>
      {/* Chart */}
      <Card style={styles.cardPaddingSmallLeft}>
        <BarChart
          data={chartData}
          spacing={spacing - 25}
          barWidth={15}
          height={screenHeight - 550}
          yAxisLabelTexts={yLabels}
          noOfSections={yLabels.length - 1}
          yAxisColor={theme.colors.primary}
          xAxisLabelTextStyle={styles.defaultText}
          yAxisTextStyle={styles.defaultText}
          verticalLinesColor="rgba(14,164,164,0.5)"
          xAxisColor={theme.colors.primary}
          color={theme.colors.primary}
        />
      </Card>

      {/* Stats + Current Price */}
      {isValidStats(stats) && typeof currentPrice === 'number' && (
        <Card style={styles.statsCard}>
          <View>
            <Text style={styles.title}>Statistics</Text>
            <Text style={styles.text}>Min: {stats.minPrice}¢</Text>
            <Text style={styles.text}>Max: {stats.maxPrice}¢</Text>
            <Text style={styles.text}>Avg: {stats.avgPrice}¢</Text>
          </View>

          <View style={styles.alignCenter}>
            <Text style={styles.title}>Current Price</Text>
            <Text style={styles.text}>{currentPrice}¢</Text>
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
