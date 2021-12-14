db.createUser({
	user: "user1",
	pwd: "pass1",
	roles: [
		{
			role: "dbOwner",
			db: "library-app",
		},
	],
});
