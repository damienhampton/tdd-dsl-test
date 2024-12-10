import { RepoInterface } from "../src/app.ts";
import { Todo } from "../src/models/todo.ts";
import { expect } from "chai";

export class FakeTodoRepo implements RepoInterface {
  private todos: Todo[] = [];
  private id = 1;

  async addTodo(todo: Omit<Todo, "id">): Promise<Todo> {
    const newTodo = { id: this.id, description: todo.description };
    this.id += 1;
    this.todos.push(newTodo);
    return newTodo;
  }
  async getTodo(id: number): Promise<Todo | undefined> {
    return this.todos.find((t) => t.id == id);
  }
  async deleteTodo(id: number): Promise<void> {
    const index = this.todos.findIndex((t) => t.id == id);
    if (index < 0) {
      return;
    }
    this.todos.splice(index, 1);
  }
  async listTodos(): Promise<Todo[]> {
    return this.todos;
  }
  async empty(): Promise<void> {
    this.todos = [];
  }
}

function todoRepoContractTest(repo: RepoInterface) {
  describe("repo", () => {
    beforeEach(async () => {
      await repo.empty();
    });
    it("should add a todo", async () => {
      const newTodo = await repo.addTodo({ description: "new todo" });
      expect((await repo.getTodo(newTodo.id)).description).to.eq("new todo");
    });
    it("should get a todo", async () => {
      const newTodo = await repo.addTodo({ description: "new todo" });
      expect((await repo.getTodo(newTodo.id)).description).to.eq("new todo");
    });
    it("should delete a todo", async () => {
      const newTodo = await repo.addTodo({ description: "new todo" });
      expect((await repo.getTodo(newTodo.id)).description).to.eq("new todo");
      await repo.deleteTodo(newTodo.id);
      expect(await repo.getTodo(newTodo.id)).to.eq(undefined);
    });
    it("should list todos", async () => {
      await repo.addTodo({ description: "new todo1" });
      await repo.addTodo({ description: "new todo2" });
      expect((await repo.listTodos()).map((t) => t.description)).to.include(
        "new todo1",
      );
      expect((await repo.listTodos()).map((t) => t.description)).to.include(
        "new todo2",
      );
    });
  });
}

todoRepoContractTest(new FakeTodoRepo());
