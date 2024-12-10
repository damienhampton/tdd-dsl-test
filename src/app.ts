import express, { Express } from "express";
import { Todo } from "./models/todo.ts";
import { TodoService } from "./services/TodoService.ts";

export interface RepoInterface {
  addTodo(todo: Omit<Todo, "id">): Promise<Todo>;
  getTodo(id: number): Promise<Todo | undefined>;
  deleteTodo(id: number): Promise<void>;
  listTodos(): Promise<Todo[]>;
  empty(): Promise<void>;
}

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}

export function createApp(repo: RepoInterface, service: TodoService) {
  const app = express();

  app.use(express.json());

  app.post(
    "/todos",
    async (req: TypedRequestBody<{ description: string }>, res) =>
      service.addTodo(req.body, {
        success: (todo) => res.json(todo),
      }),
  );

  app.get<{ id: number }>("/todos/:id", async (req, res) =>
    service.getTodo(req.params.id, {
      success: () => res.json(),
      notFound: () => res.status(404).json(),
    }),
  );

  app.delete<{ id: number }>("/todos/:id", async (req, res) =>
    service.deleteTodo(req.params.id, {
      success: () => res.json(),
      notFound: () => res.status(404).json(),
    }),
  );

  app.get("/todos", async (req, res) =>
    service.listTodos({ success: (todos) => res.json(todos) }),
  );

  return app;
}
