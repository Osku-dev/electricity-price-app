import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-native';
import { calculateChartConfig, mapPricesToChartData } from 'utils/chartHelpers';
import { usePriceData } from 'hooks/usePriceData';
import { useCheapestWindow } from 'hooks/useCheapestWindow';
import styles from './styles';
import theme from 'theme';
import { Button as CustomButton } from 'components/Button/Button';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Statistics = () => {
  const [hours, setHours] = useState(3);
  const { priceData, stats, currentPrice, pricesLoading, priceError } = usePriceData();
  const { cheapestWindowPrices, windowLoading, windowError } = useCheapestWindow(hours);

  const loading = pricesLoading || windowLoading;
  const error = priceError || windowError;

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

  if (error) return <Text style={styles.defaultText}>{error}</Text>;

  const chartData = mapPricesToChartData(priceData);
  const { spacing, yLabels } = calculateChartConfig(chartData, screenWidth);

  return (
    <ScrollView style={styles.container}>
      {/* Chart */}
      <View style={[styles.card, styles.cardPaddingSmallLeft]}>
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
      </View>

      {/* Stats + Current Price */}
      {stats && currentPrice && (
        <View style={[styles.card, styles.statsCard]}>
          <View>
            <Text style={styles.title}>Statistics</Text>
            <Text style={styles.text}>Min: {stats.min}¢</Text>
            <Text style={styles.text}>Max: {stats.max}¢</Text>
            <Text style={styles.text}>Avg: {stats.average.toFixed(2)}¢</Text>
          </View>

          <View style={styles.alignCenter}>
            <Text style={styles.title}>Current Price</Text>
            <Text style={styles.text}>{currentPrice}¢</Text>
          </View>
        </View>
      )}

      {/* Cheapest Window */}
      <View style={styles.card}>
        <Text style={styles.title}>Cheapest {hours}-hour Window</Text>

        <TextInput
          style={styles.input}
          value={String(hours)}
          keyboardType="numeric"
          onChangeText={(text) => setHours(Number(text))}
          maxLength={2}
        />

        {cheapestWindowPrices.length > 0 && (
          <>
            <Text style={styles.text}>
              From{' '}
              <Text style={styles.bold}>
                {format(parseISO(cheapestWindowPrices[0].startDate), 'HH:mm')}
              </Text>{' '}
              to{' '}
              <Text style={styles.bold}>
                {format(parseISO(cheapestWindowPrices.at(-1)!.endDate), 'HH:mm')}
              </Text>
            </Text>

            <Text style={styles.text}>
              Avg price:{' '}
              <Text style={styles.bold}>
                {(
                  cheapestWindowPrices.reduce((sum, p) => sum + p.price, 0) /
                  cheapestWindowPrices.length
                ).toFixed(3)}
                ¢
              </Text>
            </Text>

            {cheapestWindowPrices.map((entry, idx) => (
              <Text key={idx} style={styles.item}>
                {format(parseISO(entry.startDate), 'HH:mm')} –{' '}
                {format(parseISO(entry.endDate), 'HH:mm')}: {entry.price.toFixed(3)}¢
              </Text>
            ))}
          </>
        )}
      </View>

      <View style={styles.button}>
        <CustomButton label="Go to Chart" onPress={goToChart} />
      </View>
    </ScrollView>
  );
};

export default Statistics;
