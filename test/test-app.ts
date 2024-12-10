import { createApp } from "../src/app.ts";
import { Todo } from "../src/models/todo.ts";
import request from "supertest";
import { Express } from "express";
import * as chai from "chai";
import { FakeTodoRepo } from "./repo.spec.ts";
import { TodoService } from "../src/services/TodoService.ts";

export const Status = {
  OK: "Ok",
  NOT_FOUND: "Not Found",
} as const;

const mappedStatuses = {
  404: Status.NOT_FOUND,
  200: Status.OK,
};

declare global {
  export namespace Chai {
    interface Assertion {
      containTodoWithDescription(description: string): void;
      haveStatus(status: string): void;
    }
  }
}

function todosChaiMatchers(_chai, utils) {
  utils.addMethod(
    chai.Assertion.prototype,
    "haveStatus",
    function (status: string) {
      const response: { todo: Todo; status: string } = this._obj;
      this.assert(
        response.status === status,
        "expected request to have status #{exp}, got #{act}",
        "expected request not to have status #{exp}, got #{act}",
        status,
        response.status,
      );
    },
  );
  utils.addMethod(
    chai.Assertion.prototype,
    "containTodoWithDescription",
    function (description: string) {
      const todos: Todo[] = this._obj;
      const descriptions = todos.map((t) => t.description);
      this.assert(
        todos.findIndex((t) => t.description === description) > -1,
        "expected #{this} to contain a todo with description #{exp}",
        "expected #{this} not to contain a todo with description #{exp}",
        description,
        descriptions.toString(),
      );
    },
  );
}

chai.use(todosChaiMatchers);

class TestAppRunner {
  constructor(private app: Express) {}
  async addTodo(description: string): Promise<Todo> {
    return request(this.app)
      .post("/todos")
      .set("Content-Type", "application/json")
      .send({ description })
      .then((r) => r.body);
  }
  async getTodo(
    id: number,
  ): Promise<{ todo: Todo; status: keyof typeof Status }> {
    return request(this.app)
      .get(`/todos/${id}`)
      .set("Content-Type", "application/json")
      .then((r) => {
        return {
          todo: r.body,
          status: mappedStatuses[r.status],
        };
      });
  }

  async deleteTodo(id: number) {
    return request(this.app).delete(`/todos/${id}`);
  }

  async listTodos(): Promise<Todo[]> {
    return request(this.app)
      .get("/todos")
      .set("Content-Type", "application/json")
      .then((r) => r.body);
  }
}

export function createTodo(id, description) {
  return {
    id,
    description,
  };
}

export function createTestApp() {
  const repo = new FakeTodoRepo();
  return new TestAppRunner(createApp(repo, new TodoService(repo)));
}
