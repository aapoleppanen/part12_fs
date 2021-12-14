const { ApolloServer, gql } = require("apollo-server");
const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const { PubSub } = require("graphql-subscriptions");
// const pubsub = new PubSub();
require("dotenv").config();

const JWT_SECRET = process.env.SECRET;

const MONGODB_URI = process.env.MONGO_URL;

console.log(MONGODB_URI);

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("Connected To MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB", error.message);
	});

mongoose.set("debug", true);

const typeDefs = gql`
	type Author {
		name: String!
		id: String!
		born: Int
		bookCount: Int
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book]!
		allAuthors: [Author]!
		me: User
	}

	type Subscription {
		bookAdded: Book!
	}

	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String]!
		): Book
		editAuthor(name: String!, setBornTo: Int!): Author
		createUser(username: String!, favoriteGenre: String!): User
		login(username: String!, password: String!): Token
	}
`;

const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			if (!args.author && !args.genre) {
				return Book.find({}).populate("author");
			}
			if (!args.genre) {
				try {
					const author = await Author.findOne({ name: args.author });
					return Book.find({
						author: author._id,
					}).populate("author");
				} catch (error) {
					console.log(error);
				}
				// return Book.find({ author:  })
				//return books.filter((b) => b.author === args.author);
			}
			if (!args.author) {
				return Book.find({ genres: { $in: [args.genre] } }).populate("author");
				//return books.filter((b) => b.genres.includes(args.genre));
			}
			const booksByFilter = books.filter(
				(b) => b.author === args.author && b.genres.includes(args.genre)
			);
			return booksByFilter;
		},
		allAuthors: () => Author.find({}).populate("books"),
		me: (root, args, { currentUser }) => currentUser,
	},
	Author: {
		bookCount: (root, args) => {
			return root.books.length;
		},
	},
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError("not authenticated");
			}
			const authorObj = await Author.findOne({ name: args.author });
			if (authorObj === null) {
				const newAuthor = new Author({ name: args.author });
				const book = new Book({ ...args, author: newAuthor });
				newAuthor.books = newAuthor.books.concat(book._id);
				try {
					await newAuthor.save();
					//pubsub.publish("BOOK_ADDED", { bookAdded: book });
					return book.save();
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args,
					});
				}
			}
			const book = new Book({ ...args, author: authorObj });
			authorObj.books = authorObj.books.concat(book._id);
			await authorObj.save();
			//pubsub.publish("BOOK_ADDED", { bookAdded: book });

			return book.save();
		},
		editAuthor: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError("not authenticated");
			}
			const author = await Author.findOne({ name: args.name });
			if (author === null) {
				return null;
			}
			author.born = args.setBornTo;
			try {
				return author.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
		},
		createUser: (root, args) => {
			const user = new User({
				username: args.username,
				favoriteGenre: args.favoriteGenre,
			});
			try {
				return user.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== "salasana") {
				throw new UserInputError("Wrong Credentials");
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, JWT_SECRET) };
		},
	},
	// Subscription: {
	// 	bookAdded: {
	// 		subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
	// 	},
	// },
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null;
		if (auth && auth.toLowerCase().startsWith("bearer ")) {
			const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
			const currentUser = await User.findById(decodedToken.id);
			return { currentUser };
		}
	},
});

//

const thenFunc = async () => {
	// const authors = await Author.find({});
	// authors.forEach(async (element) => {
	// 	const books = await Book.find({
	// 		author: element._id,
	// 	});
	// 	const ids = books.map((e) => e._id);
	// 	element.books = ids;
	// 	element.save();
	// });
	const authors = await Author.find({});
	console.log(authors);
};

server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`Server ready at ${url}`);
	// console.log(`Subscriptions ready at ${subscriptionsUrl}`);
	thenFunc();
});
