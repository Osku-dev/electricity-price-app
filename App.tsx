import React from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';
import { ApolloProvider } from '@apollo/client/react';

import FullScreenChart from './src/views/FullScreenChartView/FullScreenChartView';
import createApolloClient from './src/utils/apolloClient';
import Statistics from './src/views/StatisticsView/StatisticsView';

const apolloClient = createApolloClient();

export default function App() {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Routes>
          <Route path="/" element={<Statistics />} />
          <Route path="/chart" element={<FullScreenChart />} />
        </Routes>
      </ApolloProvider>
    </NativeRouter>
  );
}
