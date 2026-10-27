
const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// Create the database file in the TaskFlow project folder.
const db = new Database(path.join(__dirname, "taskflow.db"));

db.pragma("journal_mode = WAL");

// Create the tasks table if it doesn't exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    priority TEXT NOT NULL DEFAULT 'medium'
      CHECK (priority IN ('low', 'medium', 'high')),
    due_date TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'todo'
      CHECK (status IN ('todo', 'in-progress', 'done')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static(__dirname));

// Get all tasks.
app.get("/api/tasks", (req, res) => {
  const tasks = db.prepare(`
    SELECT
      id,
      title,
      description,
      priority,
      due_date AS dueDate,
      status,
      created_at AS createdAt
    FROM tasks
    ORDER BY id DESC
  `).all();

  res.json(tasks);
});

// Create a task.
app.post("/api/tasks", (req, res) => {
  const { title, description = "", priority = "medium", dueDate = "" } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "A task title is required." });
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ error: "Invalid priority." });
  }

  const result = db.prepare(`
    INSERT INTO tasks (title, description, priority, due_date)
    VALUES (?, ?, ?, ?)
  `).run(title.trim(), description, priority, dueDate);

  const task = db.prepare(`
    SELECT id, title, description, priority,
           due_date AS dueDate, status,
           created_at AS createdAt
    FROM tasks WHERE id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(task);
});

// Update a task.
app.put("/api/tasks/:id", (req, res) => {
  const { title, description = "", priority, dueDate = "", status } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "A task title is required." });
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ error: "Invalid priority." });
  }

  if (!["todo", "in-progress", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  const result = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, priority = ?,
        due_date = ?, status = ?
    WHERE id = ?
  `).run(title.trim(), description, priority, dueDate, status, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.json({ message: "Task updated successfully." });
});

// Delete a task.
app.delete("/api/tasks/:id", (req, res) => {
  const result = db.prepare("DELETE FROM tasks WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.json({ message: "Task deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`TaskFlow is running at http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
