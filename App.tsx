import React from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';
import { ApolloProvider } from '@apollo/client/react';

import FullScreenChart from './src/views/FullScreenChart/FullScreenChart';
import createApolloClient from './src/utils/apolloClient';
import Statistics from './src/views/Statistics/Statistics';

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
