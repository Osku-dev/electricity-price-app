import { useEffect } from 'react';
import { useGetPricesQuery } from '../graphql/generated';
import type { GetPricesQueryVariables } from '../graphql/generated';

const usePrices = (variables: GetPricesQueryVariables) => {
  const { data, loading, error, fetchMore, ...result } = useGetPricesQuery({
    variables,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (error) console.error('Prices query error:', error);
  }, [error]);

  const handleFetchNext = () => {
    const canFetchMore = !loading && data?.prices.pageInfo.hasNextPage;
    if (!canFetchMore) return;

    fetchMore({
      variables: {
        first: variables.first,
        after: data?.prices.pageInfo.endCursor ?? undefined,
      },
    });
  };

  const handleFetchPrevious = () => {
    const canFetchMore = !loading && data?.prices.pageInfo.hasPreviousPage;
    if (!canFetchMore) return;

    fetchMore({
      variables: {
        last: variables.last,
        before: data?.prices.pageInfo.startCursor ?? undefined,
      },
    });
  };

  const prices = data?.prices.edges.map((edge) => edge.node) ?? [];

  return {
    prices,
    pageInfo: data?.prices.pageInfo,
    fetchNext: handleFetchNext,
    fetchPrevious: handleFetchPrevious,
    loading,
    error,
    ...result,
  };
};

export default usePrices;
