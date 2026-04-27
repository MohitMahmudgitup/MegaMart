import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

const errorLink = new ErrorLink(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }: any) =>
      console.error(`[GraphQL error]: ${message}`)
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BASE_API}/graphql` || "http://localhost:5000/graphql",
});

// ✅ from এর বদলে ApolloLink.from() ব্যবহার করো
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});