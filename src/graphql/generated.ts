import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client/react';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Price = {
  __typename?: 'Price';
  resolutionMinutes: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type PriceConnection = {
  __typename?: 'PriceConnection';
  edges: Array<PriceEdge>;
  pageInfo: PageInfo;
};

export type PriceEdge = {
  __typename?: 'PriceEdge';
  cursor: Scalars['String']['output'];
  node: Price;
};

export type Query = {
  __typename?: 'Query';
  prices: PriceConnection;
};

export type QueryPricesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type PriceDetailsFragment = {
  __typename?: 'PriceConnection';
  edges: Array<{
    __typename?: 'PriceEdge';
    cursor: string;
    node: { __typename?: 'Price'; resolutionMinutes: string; timestamp: string; value: number };
  }>;
  pageInfo: {
    __typename?: 'PageInfo';
    endCursor?: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
  };
};

export type GetPricesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetPricesQuery = {
  __typename?: 'Query';
  prices: {
    __typename?: 'PriceConnection';
    edges: Array<{
      __typename?: 'PriceEdge';
      cursor: string;
      node: { __typename?: 'Price'; resolutionMinutes: string; timestamp: string; value: number };
    }>;
    pageInfo: {
      __typename?: 'PageInfo';
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
    };
  };
};

export const PriceDetailsFragmentDoc = gql`
  fragment PriceDetails on PriceConnection {
    edges {
      node {
        resolutionMinutes
        timestamp
        value
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
`;
export const GetPricesDocument = gql`
  query GetPrices($first: Int, $after: String, $last: Int, $before: String) {
    prices(first: $first, after: $after, last: $last, before: $before) {
      ...PriceDetails
    }
  }
  ${PriceDetailsFragmentDoc}
`;

/**
 * __useGetPricesQuery__
 *
 * To run a query within a React component, call `useGetPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPricesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      last: // value for 'last'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useGetPricesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetPricesQuery, GetPricesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPricesQuery, GetPricesQueryVariables>(GetPricesDocument, options);
}
export function useGetPricesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPricesQuery, GetPricesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPricesQuery, GetPricesQueryVariables>(GetPricesDocument, options);
}
export function useGetPricesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPricesQuery, GetPricesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetPricesQuery, GetPricesQueryVariables>(
    GetPricesDocument,
    options,
  );
}
export type GetPricesQueryHookResult = ReturnType<typeof useGetPricesQuery>;
export type GetPricesLazyQueryHookResult = ReturnType<typeof useGetPricesLazyQuery>;
export type GetPricesSuspenseQueryHookResult = ReturnType<typeof useGetPricesSuspenseQuery>;
export type GetPricesQueryResult = Apollo.QueryResult<GetPricesQuery, GetPricesQueryVariables>;
