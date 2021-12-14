import React, { useState, useEffect } from "react";
import { USER } from "../queries";
import { BOOKS_BY_GENRE } from "../queries";
import { useLazyQuery } from "@apollo/client";

const Recommendations = (props) => {
	const [getBooks, result] = useLazyQuery(BOOKS_BY_GENRE);
	const [getUser, user] = useLazyQuery(USER);
	const [books, setBooks] = useState(null);

	useEffect(() => {
		getUser();
	}, [props.show]);

	useEffect(() => {
		try {
			getBooks({ variables: { genre: user.data.me.favoriteGenre } });
		} catch (error) {}
	}, [user.data]);

	useEffect(() => {
		if (result.data) {
			setBooks(result.data.allBooks);
		}
	}, [result.data]);

	if (!props.show || user.loading) {
		return null;
	}

	if (!books || result.loading) {
		return <div>No Favorite Genre.</div>;
	}

	return (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((a) => (
						<tr key={a.id}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Recommendations;
