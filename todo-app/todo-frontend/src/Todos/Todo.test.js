import { render } from "@testing-library/react";
import Todo from "./Todo";

test("renders a todo", async () => {
	const newTodo = {
		text: "this is a test",
		done: false,
	};

	const todoElem = render(
		<Todo
			todo={newTodo}
			onClickComplete={() => {}}
			onClickDelete={() => {}}
		></Todo>
	);
	expect(todoElem.container).toHaveTextContent(newTodo.text);
});
