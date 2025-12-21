import React from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';
import { ApolloProvider } from '@apollo/client/react';

import FullScreenChart from './src/views/FullScreenChartView/FullScreenChartView';
import Statistics from './src/views/StatisticsView/StatisticsView';
import createApolloClient from './src/utils/apolloClient';
import usePrices from './src/hooks/usePrices';

const apolloClient = createApolloClient();

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <NativeRouter>
        <AppRoutes />
      </NativeRouter>
    </ApolloProvider>
  );
}

function AppRoutes() {
  const prices = usePrices();

  return (
    <Routes>
      <Route path="/" element={<Statistics prices={prices} />} />
      <Route path="/chart" element={<FullScreenChart prices={prices} />} />
    </Routes>
  );
}
