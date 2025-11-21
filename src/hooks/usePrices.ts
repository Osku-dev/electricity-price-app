import { useEffect } from 'react';
import { useGetPricesQuery } from '../graphql/generated';
import type { GetPricesQueryVariables } from '../graphql/generated';

export const usePrices = (variables?: GetPricesQueryVariables) => {
  const { data, loading, error, fetchMore, ...result } = useGetPricesQuery({
    variables,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (error) console.error('Prices query error:', error);
  }, [error]);

  const handleFetchNext = () => {
    const canFetchMore = !loading && data?.prices.pageInfo.hasNextPage;
    if (!canFetchMore || !variables) return;

    fetchMore({
      variables: {
        first: variables.first,
        after: data?.prices.pageInfo.endCursor ?? undefined,
      },
    });
  };

  const handleFetchPrevious = () => {
    const canFetchMore = !loading && data?.prices.pageInfo.hasPreviousPage;
    if (!canFetchMore || !variables) return;

    fetchMore({
      variables: {
        last: variables.last,
        before: data?.prices.pageInfo.startCursor ?? undefined,
      },
    });
  };

  const priceData = data?.prices.edges.map((edge) => edge.node) ?? [];

  return {
    priceData,
    pageInfo: data?.prices.pageInfo,
    fetchNext: handleFetchNext,
    fetchPrevious: handleFetchPrevious,
    loading,
    error,
    ...result,
  };
};

export default usePrices;
