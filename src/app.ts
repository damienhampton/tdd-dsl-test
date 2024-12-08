import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  let id = 1;
  const todos = [];

  app.post("/todos", (req, res) => {
    const newTodo = { id, description: req.body.description };
    id += 1;
    todos.push(newTodo);
    res.json(newTodo);
  });

  app.get("/todos/:id", (req, res) => {
    const todo = todos.find((t) => t.id == req.params.id);
    if (!todo) {
      res.status(404).json();
    } else {
      res.json(todo);
    }
  });

  app.delete("/todos/:id", (req, res) => {
    const index = todos.findIndex((t) => t.id == req.params.id);
    if (index == -1) {
      res.status(404).json();
      return;
    }
    todos.splice(index, 1);
    res.json();
  });

  app.get("/todos", (req, res) => {
    res.json(todos);
  });

  return app;
}
