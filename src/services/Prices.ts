import axios from 'axios';
import { Price, Stats } from '../../types';
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const getPrices = async () => {
  const { data } = await axios.get<Price[]>(`${BASE_URL}`);
  return data;
};

export const getStats = async () => {
  const { data } = await axios.get<Stats>(`${BASE_URL}/stats`);
  return data;
};

export const getCheapestWindow = async (hours: number) => {
  const { data } = await axios.get<Price[]>(`${BASE_URL}/cheapest-window?hours=${hours}`);
  return data;
};
