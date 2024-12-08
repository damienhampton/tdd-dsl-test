import { expect } from "chai";
import { createTestApp, createTodo, Status } from "./test-app.ts";

describe("todo", () => {
  describe("add/get todo", () => {
    it("should add a todo", async () => {
      const app = createTestApp();
      const todo = await app.addTodo("someTodo");
      expect((await app.getTodo(todo.id)).todo).to.deep.equal(
        createTodo(todo.id, "someTodo"),
      );
    });
  });
  describe("delete todo", () => {
    it("should delete a todo", async () => {
      const app = createTestApp();
      const todo = await app.addTodo("someTodo");
      expect((await app.getTodo(todo.id)).todo).to.deep.equal(
        createTodo(todo.id, "someTodo"),
      );
      await app.deleteTodo(todo.id);
      expect(await app.getTodo(todo.id)).to.haveStatus(Status.NOT_FOUND);
    });
    describe("list todo", () => {
      it("should list todos", async () => {
        const app = createTestApp();
        await app.addTodo("someTodo1");
        await app.addTodo("someTodo2");
        const todos = await app.listTodos();

        expect(todos).to.have.length(2);
        expect(todos).to.containTodoWithDescription("someTodo1");
        expect(todos).to.containTodoWithDescription("someTodo2");
        expect(todos[0].id).to.not.equal(todos[1].id);
      });
    });
  });
});
