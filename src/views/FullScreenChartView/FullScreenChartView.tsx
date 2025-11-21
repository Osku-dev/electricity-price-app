import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigate } from 'react-router-native';
import { mapPricesToChartData, calculateChartConfig } from 'utils/chartHelpers';
import { usePrices } from 'hooks/usePrices';

import { Card } from 'components/Card/Card';
import { Button } from 'components/Button/Button';

import styles from './styles';
import theme from 'theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const FullScreenChart = () => {
  const { priceData, loading, error } = usePrices();

  const [interval, setInterval] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>();
  const navigate = useNavigate();

  const goToStats = () => navigate('/');

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.text}>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{error.message}</Text>
      </View>
    );
  }

  const displayedData = interval === 1 ? priceData : priceData.filter((_, i) => i % 3 === 0);

  const chartData = mapPricesToChartData(displayedData);
  const { spacing, yLabels } = calculateChartConfig(chartData, screenWidth);

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        <View style={styles.backButtonWrapper}>
          <Button label="←" onPress={goToStats} />
        </View>

        <Button label="1h" onPress={() => setInterval(1)} />
        <View style={styles.spacer} />
        <Button label="3h" onPress={() => setInterval(3)} />
      </View>

      {/* Chart */}
      <Card style={styles.chartCard}>
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
          textColor1={theme.colors.textPrimary}
          textShiftY={50}
          height={screenHeight - 500}
          textShiftX={50}
          yAxisLabelTexts={yLabels}
          noOfSections={yLabels.length - 1}
          textFontSize={13}
          thickness={5}
          yAxisColor={theme.colors.primary}
          xAxisLabelTextStyle={styles.axisText}
          yAxisTextStyle={styles.axisText}
          showVerticalLines
          verticalLinesColor="rgba(14,164,164,0.5)"
          xAxisColor={theme.colors.primary}
          color={theme.colors.primary}
        />
      </Card>

      {/* Highlighted datapoint */}
      {highlightedIndex !== undefined && chartData[highlightedIndex] && (
        <Card style={styles.highlightCard}>
          <Text style={styles.text}>Time: {chartData[highlightedIndex].label}:00</Text>
          <Text style={styles.text}>Price: {chartData[highlightedIndex].value} c/kWh</Text>
        </Card>
      )}
    </View>
  );
};

export default FullScreenChart;
