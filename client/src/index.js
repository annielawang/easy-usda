import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { onError } from "apollo-link-error";
// import { ApolloLink } from "apollo-link";
// import { QUERY_ALL_FOODS } from "./utils/queries";

import App from "./App";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     console.log("graphQLErrors", graphQLErrors);
//   }
//   if (networkError) {
//     console.log("networkError", networkError);
//   }
// });

// const link = ApolloLink.from([errorLink, httpLink]);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from  storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
