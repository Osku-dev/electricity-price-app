import { gql } from '@apollo/client';

export const PRICE_FRAGMENT = gql`
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
