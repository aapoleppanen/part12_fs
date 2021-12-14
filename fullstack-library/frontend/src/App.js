import React, { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommend";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useApolloClient, useSubscription } from "@apollo/client";

const App = () => {
	const [page, setPage] = useState("books");
	const [token, setToken] = useState(null);
	const authorResult = useQuery(ALL_AUTHORS);
	const bookResult = useQuery(ALL_BOOKS);
	const client = useApolloClient();

	useEffect(() => {
		if (!token) {
			setToken(localStorage.getItem("library-user-token"));
		}
	}, []);

	const updateCache = (newBook) => {
		const exists = (set, object) => {
			set.map((e) => e.id).includes(object.id);
		};
		const dataInStore = client.readQuery({ query: ALL_BOOKS });
		if (!exists(dataInStore.allBooks, newBook)) {
			client.writeQuery({
				query: ALL_BOOKS,
				data: { allBooks: dataInStore.allBooks.concat(newBook) },
			});
		}
		client.refetchQueries({
			include: [ALL_AUTHORS],
		});
	};

	// useSubscription(BOOK_ADDED, {
	// 	onSubscriptionData: ({ subscriptionData }) => {
	// 		const subData = subscriptionData;
	// 		alert(
	// 			`${subData.data.bookAdded.title} by ${subData.data.bookAdded.author.name} was just added.`
	// 		);
	// 		updateCache(subData.data.bookAdded);
	// 	},
	// });

	if (authorResult.loading || bookResult.loading) {
		return <div>loading...</div>;
	}

	const logout = () => {
		localStorage.clear();
		client.resetStore();
		setToken(null);
		setPage("login");
	};

	return (
		<div>
			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>
				{token ? (
					<>
						<button onClick={() => setPage("add")}>add book</button>
						<button onClick={() => setPage("recommend")}>
							recommendations
						</button>
						<button onClick={logout}>logout</button>
					</>
				) : (
					<button onClick={() => setPage("login")}>login</button>
				)}
			</div>

			<Authors
				show={page === "authors"}
				authors={authorResult.data.allAuthors}
			/>

			<Books show={page === "books"} books={bookResult.data.allBooks} />

			<NewBook show={page === "add"} />

			<Recommendations show={page === "recommend"}></Recommendations>

			<LoginForm
				show={page === "login"}
				setToken={setToken}
				setPage={setPage}
			></LoginForm>
		</div>
	);
};

export default App;
