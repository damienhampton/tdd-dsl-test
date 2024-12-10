import { RepoInterface } from "../app.ts";
import { Todo } from "../models/todo.ts";

export class TodoService {
  constructor(private repo: RepoInterface) {}

  async addTodo(
    todo: Omit<Todo, "id">,
    { success }: { success: (t: Todo) => void },
  ) {
    const newTodo = await this.repo.addTodo(todo);
    success(newTodo);
  }

  async getTodo(
    id: number,
    { success, notFound }: { success: (todo) => void; notFound: () => void },
  ) {
    const todo = await this.repo.getTodo(id);
    if (!todo) {
      notFound();
    } else {
      success(todo);
    }
  }

  async deleteTodo(
    id: number,
    { success, notFound }: { success: () => void; notFound: () => void },
  ) {
    const todo = await this.repo.getTodo(id);
    if (!todo) {
      return notFound();
    }
    await this.repo.deleteTodo(id);
    success();
  }

  async listTodos({ success }: { success: (todos) => void }) {
    success(await this.repo.listTodos());
  }
}
