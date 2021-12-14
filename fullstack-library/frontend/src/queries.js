import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
	query ALL_AUTHORS {
		allAuthors {
			name
			born
			bookCount
		}
	}
`;

export const ALL_BOOKS = gql`
	query ALL_BOOKS {
		allBooks {
			title
			published
			author {
				name
			}
			id
			genres
		}
	}
`;

export const NEW_BOOK = gql`
	mutation AddBookMutation(
		$title: String!
		$author: String!
		$published: Int!
		$genres: [String]!
	) {
		addBook(
			title: $title
			author: $author
			published: $published
			genres: $genres
		) {
			title
			published
			author {
				name
			}
			genres
			id
		}
	}
`;

export const EDIT_AUTHOR = gql`
	mutation EditAuthorMutation($name: String!, $born: Int!) {
		editAuthor(name: $name, setBornTo: $born) {
			name
			born
		}
	}
`;

export const LOGIN = gql`
	mutation LOGIN($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const USER = gql`
	query USER {
		me {
			favoriteGenre
			username
		}
	}
`;

export const BOOKS_BY_GENRE = gql`
	query BOOKS_BY_GENRE($genre: String) {
		allBooks(genre: $genre) {
			title
			published
			author {
				name
			}
			id
			genres
		}
	}
`;

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			title
			published
			author {
				name
			}
			id
			genres
		}
	}
`;
