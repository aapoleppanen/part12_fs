import React, { useState, useEffect } from "react";

const Books = (props) => {
	const [books, setBooks] = useState(props.books);
	const [genre, setGenre] = useState(props.books[0].genres[0]);

	useEffect(() => {
		setBooks(props.books);
	}, [props.books]);

	if (!props.show) {
		return null;
	}

	const handleFilter = (event) => {
		event.preventDefault();
		const filteredBooks = props.books.filter((e) => e.genres.includes(genre));
		setBooks(filteredBooks);
	};

	const handleReset = (event) => {
		event.preventDefault();
		setBooks(props.books);
	};

	let used = [];

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

			<br />

			<form onSubmit={handleFilter} onReset={handleReset}>
				genres
				<select name="name" onChange={(event) => setGenre(event.target.value)}>
					{props.books.map((b) => {
						return b.genres.map((a) => {
							if (used.includes(a)) {
							} else {
								used.push(a);
								return (
									<option value={a} key={a}>
										{a}
									</option>
								);
							}
						});
					})}
				</select>
				<br />
				<button type="submit">Filter</button>
				<button type="reset">Reset</button>
			</form>
		</div>
	);
};

export default Books;
