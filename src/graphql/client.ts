import { GraphQLClient } from 'graphql-request'

/** Публичный GraphQLZero API (CORS: *) или свой URL через VITE_GRAPHQLZERO_URL */
const GRAPHQL_ZERO_URL =
  import.meta.env.VITE_GRAPHQLZERO_URL ??
  'https://graphqlzero.almansi.me/api'

export const graphqlClient = new GraphQLClient(GRAPHQL_ZERO_URL)
