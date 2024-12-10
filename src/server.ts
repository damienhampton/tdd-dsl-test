import { createApp } from "./app.ts";
import { TodoService } from "./services/TodoService.ts";
import { FakeTodoRepo } from "../test/repo.spec.ts";

const repo = new FakeTodoRepo();
createApp(repo, new TodoService(repo)).listen(3000);
