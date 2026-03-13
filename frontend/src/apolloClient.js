// /home/harshita-verma/Documents/CODE_FOCUS/MERN_Parking_Sys/frontend/src/apolloClient.js

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: "http://localhost:5000/graphql"
});

const authLink = setContext((_, { headers }) => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ""
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default client;
