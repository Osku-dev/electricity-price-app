import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions, StyleSheet, Button } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigate } from 'react-router-native';
import { mapPricesToChartData, calculateChartConfig } from '../utils/chartHelpers';
import { usePriceData } from 'hooks/usePriceData';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const FullScreenChart = () => {
  const { priceData, pricesLoading, priceError, highlightedIndex, setHighlightedIndex } =
    usePriceData();
  const [interval, setInterval] = useState(1);

  const navigate = useNavigate();

  const goToStats = () => {
    navigate('/');
  };

  useEffect(() => {
    ScreenOrientation.unlockAsync();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  if (pricesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (priceError) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{priceError}</Text>
      </View>
    );
  }

  const displayedData = interval === 1 ? priceData : priceData.filter((_, i) => i % 3 === 0);

  const chartData = mapPricesToChartData(displayedData);
  const { spacing, yLabels } = calculateChartConfig(chartData, screenWidth);

  return (
    <View style={{ flex: 1, backgroundColor: '#1b263b' }}>
      {/* Interval buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 8, marginTop: 50 }}>
        <View style={{ justifyContent: 'flex-start', position: 'absolute', left: 8, top: 8 }}>
          <Button title="←" onPress={() => goToStats()} color={'#555'} />
        </View>
        <Button
          title="1h"
          onPress={() => setInterval(1)}
          color={interval === 1 ? '#007AFF' : '#555'}
        />
        <View style={{ width: 8 }} />
        <Button
          title="3h"
          onPress={() => setInterval(3)}
          color={interval === 3 ? '#007AFF' : '#555'}
        />
      </View>

      <View style={{ backgroundColor: '#1b263b' }}>
        <LineChart
          initialSpacing={50}
          data={chartData}
          dataPointsRadius={7}
          onFocus={(index: number | undefined) => {
            if (index === undefined) return;
            setHighlightedIndex((prev) => (prev === index ? undefined : index));
          }}
          focusEnabled
          focusedDataPointIndex={highlightedIndex}
          unFocusOnPressOut={false}
          showStripOnFocus
          spacing={spacing}
          textColor1="yellow"
          textShiftY={50}
          height={screenHeight - 500}
          textShiftX={50}
          yAxisLabelTexts={yLabels}
          noOfSections={yLabels.length - 1}
          //noOfSectionsBelowXAxis={minY < 0 ? 1 : 0}
          //mostNegativeValue={minY < 0 ? -5 : undefined}
          textFontSize={13}
          thickness={5}
          yAxisColor="#0BA5A4"
          xAxisLabelTextStyle={{ color: '#e0e1dd', fontSize: 12 }}
          yAxisTextStyle={{ color: '#e0e1dd', fontSize: 12 }}
          showVerticalLines
          verticalLinesColor="rgba(14,164,164,0.5)"
          xAxisColor="#0BA5A4"
          color="#0BA5A4"
        />
      </View>

      {highlightedIndex !== undefined && chartData[highlightedIndex] && (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#e0e1dd' }}>
            Time: {chartData[highlightedIndex].label}:00
          </Text>
          <Text style={{ fontSize: 16, color: '#e0e1dd' }}>
            Price: {chartData[highlightedIndex].value} c/kWh
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1b263b',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e0e1dd',
    marginBottom: 8,
  },
  text: {
    color: '#e0e1dd',
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1b2a',
  },
});

export default FullScreenChart;
