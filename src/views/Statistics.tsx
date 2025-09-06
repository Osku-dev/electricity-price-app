import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Button,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-native';
import { calculateChartConfig, mapPricesToChartData } from 'utils/chartHelpers';
import { usePriceData } from '../hooks/usePriceData';
import { useCheapestWindow } from 'hooks/useCheapestWindow';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Statistics = () => {
  const [hours, setHours] = useState(3);
  const { priceData, stats, currentPrice, pricesLoading, priceError } = usePriceData();
  const { cheapestWindowPrices, windowLoading, windowError } = useCheapestWindow(3);

  const loading = pricesLoading || windowLoading;
  const error = priceError || windowError;

  const navigate = useNavigate();
  const goToChart = () => navigate('/chart');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) return <Text>{error}</Text>;

  const chartData = mapPricesToChartData(priceData);
  const { spacing, yLabels } = calculateChartConfig(chartData, screenWidth);

  return (
    <ScrollView style={styles.container}>
      {/* Price Chart */}
      <View style={[styles.card, { paddingLeft: 2 }]}>
        <BarChart
          data={chartData}
          spacing={spacing - 25}
          barWidth={15}
          height={screenHeight - 550}
          yAxisLabelTexts={yLabels}
          noOfSections={yLabels.length - 1}
          yAxisColor="#0BA5A4"
          xAxisLabelTextStyle={{ color: '#e0e1dd', fontSize: 12 }}
          yAxisTextStyle={{ color: '#e0e1dd', fontSize: 12 }}
          verticalLinesColor="rgba(14,164,164,0.5)"
          xAxisColor="#0BA5A4"
          color="#0BA5A4"
        />
      </View>

      {/* Stats + Current Price */}
      {stats && currentPrice && (
        <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View>
            <Text style={styles.title}>Statistics</Text>
            <Text style={styles.text}>Min: {stats.min}¢</Text>
            <Text style={styles.text}>Max: {stats.max}¢</Text>
            <Text style={styles.text}>Avg: {stats.average.toFixed(2)}¢</Text>
          </View>

          <View>
            <Text style={styles.title}>Current Price</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.text}>{currentPrice}¢</Text>
            </View>
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

      <View style={{ marginBottom: 70, alignItems: 'center' }}>
        <Button title="Go to Chart" onPress={goToChart} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0d1b2a',
  },
  card: {
    backgroundColor: '#1b263b',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e0e1dd',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#778da9',
    borderWidth: 1,
    borderRadius: 8,
    color: '#e0e1dd',
    paddingLeft: 8,
    marginBottom: 16,
  },
  text: {
    color: '#e0e1dd',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
    color: '#e0e1dd',
  },
  item: {
    color: '#e0e1dd',
    fontSize: 14,
    marginBottom: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
  },
});

export default Statistics;
