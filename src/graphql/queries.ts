import { gql } from '@apollo/client';
import { PRICE_FRAGMENT } from './fragments';

export const GET_PRICES = gql`
  query GetPrices($first: Int, $after: String, $last: Int, $before: String) {
    prices(first: $first, after: $after, last: $last, before: $before) {
      ...PriceDetails
    }
  }
  ${PRICE_FRAGMENT}
`;
