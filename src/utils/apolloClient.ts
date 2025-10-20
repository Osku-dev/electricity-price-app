import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({ uri: BASE_URL }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
