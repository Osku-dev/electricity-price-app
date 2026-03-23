import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usePullToRefresh = <T extends (...args: any[]) => Promise<any>>(refetch: T) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async (...args: Parameters<T>) => {
    setRefreshing(true);
    try {
      await refetch(...args);
    } finally {
      setRefreshing(false);
    }
  };

  return { refreshing, onRefresh };
};
