import React from 'react';
import { NativeRouter, Routes, Route } from 'react-router-native';

import FullScreenChart from './src/views/FullScreenChart';
import Statistics from './src/views/Statistics';

export default function App() {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<Statistics />} />
        <Route path="/chart" element={<FullScreenChart />} />
      </Routes>
    </NativeRouter>
  );
}
