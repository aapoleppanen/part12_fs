import React, { useState, useEffect } from "react";
import { LOGIN } from "../queries";
import { useMutation } from "@apollo/client";

const LoginForm = (props) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			alert(error);
		},
	});

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			props.setToken(token);
			localStorage.setItem("library-user-token", token);
			props.setPage("books");
		}
	}, [result.data]);

	if (!props.show) {
		return null;
	}

	const submit = (event) => {
		event.preventDefault();
		setUsername("");
		setPassword("");
		login({ variables: { username, password } });
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					Username
					<input
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					Password
					<input
						value={password}
						type="password"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default LoginForm;
