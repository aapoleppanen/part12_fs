import React, { useState } from "react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client";

const Authors = (props) => {
	const [name, setname] = useState(props.authors[0].name);
	const [born, setborn] = useState("");

	const [updatedAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		onError: (error) => {
			alert(error);
		},
	});

	if (!props.show) {
		return null;
	}

	const authors = props.authors;

	const updateYear = (event) => {
		event.preventDefault();
		updatedAuthor({ variables: { name, born: parseInt(born) } });
		setname("");
		setborn("");
	};

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				<h2>Set BirthYear</h2>
				<form onSubmit={updateYear}>
					name
					<select name="name" onChange={(event) => setname(event.target.value)}>
						{authors.map((a) => (
							<option value={a.name} key={a.name}>
								{a.name}
							</option>
						))}
					</select>
					<br />
					born{" "}
					<input
						type="number"
						value={born}
						onChange={(event) => setborn(event.target.value)}
					/>
					<br />
					<button type="submit">updated year</button>
				</form>
			</div>
		</div>
	);
};

export default Authors;
