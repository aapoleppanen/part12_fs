const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { setAsync, getAsync } = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
	const todos = await Todo.find({});
	res.send(todos);
});

router.get("/usage", async (_, res) => {
	const usageStat = {
		added_todos: await getAsync("added_todos"),
	};
	res.json(usageStat);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
	const todo = await Todo.create({
		text: req.body.text,
		done: false,
	});
	if (!(await getAsync("added_todos"))) await setAsync("added_todos", 0);
	await setAsync("added_todos", parseInt(await getAsync("added_todos")) + 1);
	res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
	const { id } = req.params;
	req.todo = await Todo.findById(id);
	if (!req.todo) return res.sendStatus(404);

	next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
	await req.todo.delete();
	res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
	res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
	req.todo.text = req.body.text;
	await req.todo.save();
	res.send(req.todo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
