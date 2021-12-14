import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	ApolloProvider,
	// split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import { getMainDefinition } from "@apollo/client/utilities";
// import { WebSocketLink } from "@apollo/client/link/ws";
require("dotenv").config();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("library-user-token");
	return {
		headers: {
			...headers,
			authorization: token ? `bearer ${token}` : null,
		},
	};
});

const httpLink = new HttpLink({
	uri: BACKEND_URL,
});

// const WS_URL = "ws://";

// const wsLink = new WebSocketLink({
// 	uri: WS_URL,
// 	options: {
// 		reconnect: true,
// 	},
// });

// const splitLink = split(
// 	({ query }) => {
// 		const definition = getMainDefinition(query);
// 		return (
// 			definition.kind === "OperationDefinition" &&
// 			definition.operation === "subscription"
// 		);
// 	},
// 	wsLink,
// 	authLink.concat(httpLink)
// );

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: BACKEND_URL,
	}),
	// link: splitLink,
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);
