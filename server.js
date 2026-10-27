require("dotenv").config();

const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { rateLimit } = require("express-rate-limit");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing. Check your local .env file.");
}

const db = new Database(path.join(__dirname, "taskflow.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create the database tables.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

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
  );

  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess TEXT NOT NULL,
    expire INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_expire
    ON sessions(expire);
`);

// One-time migration: associate tasks with users.
// The two old tasks are deleted only when this migration runs.
const migrateTasks = db.transaction(() => {
  const columns = db.pragma("table_info(tasks)");
  const alreadyMigrated = columns.some(
    (column) => column.name === "user_id"
  );

  if (!alreadyMigrated) {
    db.exec(`
      ALTER TABLE tasks
      ADD COLUMN user_id INTEGER REFERENCES users(id)
    `);

    db.exec("DELETE FROM tasks");

    console.log("Task migration complete. Previous tasks cleared.");
  }
});

migrateTasks();

// SQLite-backed session storage.
class SQLiteSessionStore extends session.Store {
  constructor(database) {
    super();
    this.db = database;

    this.getStatement = database.prepare(
      "SELECT sess FROM sessions WHERE sid = ? AND expire > ?"
    );

    this.setStatement = database.prepare(`
      INSERT INTO sessions (sid, sess, expire)
      VALUES (?, ?, ?)
      ON CONFLICT(sid) DO UPDATE SET
        sess = excluded.sess,
        expire = excluded.expire
    `);

    this.destroyStatement = database.prepare(
      "DELETE FROM sessions WHERE sid = ?"
    );

    this.touchStatement = database.prepare(
      "UPDATE sessions SET expire = ? WHERE sid = ?"
    );
  }

  get(sid, callback) {
    try {
      const row = this.getStatement.get(sid, Date.now());
      callback(null, row ? JSON.parse(row.sess) : null);
    } catch (error) {
      callback(error);
    }
  }

  set(sid, sess, callback = () => {}) {
    try {
      const expires = sess.cookie?.expires
        ? new Date(sess.cookie.expires).getTime()
        : Date.now() + (sess.cookie?.maxAge || 86400000);

      this.setStatement.run(sid, JSON.stringify(sess), expires);
      this.db.prepare("DELETE FROM sessions WHERE expire <= ?")
        .run(Date.now());

      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  destroy(sid, callback = () => {}) {
    try {
      this.destroyStatement.run(sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  touch(sid, sess, callback = () => {}) {
    try {
      const expires = sess.cookie?.expires
        ? new Date(sess.cookie.expires).getTime()
        : Date.now() + (sess.cookie?.maxAge || 86400000);

      this.touchStatement.run(expires, sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}

app.use(express.json({ limit: "20kb" }));

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  session({
    name: "taskflow.sid",
    secret: process.env.SESSION_SECRET,
    store: new SQLiteSessionStore(db),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many attempts. Please try again in 15 minutes."
  }
});

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Please log in to continue."
    });
  }

  next();
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function startSession(req, user) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) return reject(error);

      req.session.userId = user.id;

      req.session.save((saveError) => {
        if (saveError) return reject(saveError);
        resolve();
      });
    });
  });
}

// -------------------- AUTHENTICATION --------------------

// Check whether a user is logged in.
app.get("/api/auth/me", (req, res) => {
  if (!req.session.userId) {
    return res.json({ user: null });
  }

  const user = db.prepare(`
    SELECT id, name, email
    FROM users
    WHERE id = ?
  `).get(req.session.userId);

  if (!user) {
    return req.session.destroy(() => {
      res.json({ user: null });
    });
  }

  res.json({ user: publicUser(user) });
});

// Register a new account.
app.post("/api/auth/register", authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 80
    ) {
      return res.status(400).json({
        error: "Your name must be between 2 and 80 characters."
      });
    }

    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        error: "Enter a valid email address."
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 12 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Your password must be at least 12 characters and no more than 72 bytes."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = db.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).get(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let user;

    try {
      const result = db.prepare(`
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `).run(name.trim(), normalizedEmail, passwordHash);

      user = db.prepare(`
        SELECT id, name, email
        FROM users
        WHERE id = ?
      `).get(result.lastInsertRowid);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(409).json({
          error: "An account with this email already exists."
        });
      }

      throw error;
    }

    await startSession(req, user);

    res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

// Log in to an existing account.
app.post("/api/auth/login", authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.length > 254 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Enter your email and password."
      });
    }

    const user = db.prepare(`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ?
    `).get(email.trim().toLowerCase());

    const passwordMatches = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    await startSession(req, user);

    res.json({
      message: "Logged in successfully.",
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
});

// Log out.
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Unable to log out. Please try again."
      });
    }

    res.clearCookie("taskflow.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction
    });

    res.json({ message: "Logged out successfully." });
  });
});

// -------------------- TASKS --------------------

// Get only the logged-in user's tasks.
app.get("/api/tasks", requireAuth, (req, res) => {
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
    WHERE user_id = ?
    ORDER BY id DESC
  `).all(req.session.userId);

  res.json(tasks);
});

// Create a task for the logged-in user.
app.post("/api/tasks", requireAuth, (req, res) => {
  const {
    title,
    description = "",
    priority = "medium",
    dueDate = ""
  } = req.body || {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "A task title is required."
    });
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ error: "Invalid priority." });
  }

  if (
    typeof description !== "string" ||
    description.length > 5000 ||
    typeof dueDate !== "string"
  ) {
    return res.status(400).json({
      error: "Check your task description and due date."
    });
  }

  const result = db.prepare(`
    INSERT INTO tasks
      (title, description, priority, due_date, user_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    title.trim(),
    description,
    priority,
    dueDate,
    req.session.userId
  );

  const task = db.prepare(`
    SELECT id, title, description, priority,
           due_date AS dueDate, status,
           created_at AS createdAt
    FROM tasks
    WHERE id = ? AND user_id = ?
  `).get(result.lastInsertRowid, req.session.userId);

  res.status(201).json(task);
});

// Update only a task owned by the logged-in user.
app.put("/api/tasks/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const {
    title,
    description = "",
    priority,
    dueDate = "",
    status
  } = req.body || {};

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid task ID." });
  }

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "A task title is required."
    });
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ error: "Invalid priority." });
  }

  if (!["todo", "in-progress", "done"].includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }

  if (
    typeof description !== "string" ||
    description.length > 5000 ||
    typeof dueDate !== "string"
  ) {
    return res.status(400).json({
      error: "Check your task description and due date."
    });
  }

  const result = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, priority = ?,
        due_date = ?, status = ?
    WHERE id = ? AND user_id = ?
  `).run(
    title.trim(),
    description,
    priority,
    dueDate,
    status,
    id,
    req.session.userId
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.json({ message: "Task updated successfully." });
});

// Delete only a task owned by the logged-in user.
app.delete("/api/tasks/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid task ID." });
  }

  const result = db.prepare(`
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
  `).run(id, req.session.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found." });
  }

  res.json({ message: "Task deleted successfully." });
});

// Serve only the existing frontend files.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/portfolio-evidence/:filename", (req, res, next) => {
  const allowedFiles = new Set([
    "agile-team-charter.md",
    "user-stories-and-tasks.md",
    "product-backlog.md",
    "sprint-backlog.md",
    "agile-logbook.md"
  ]);

  const filename = req.params.filename;

  if (!allowedFiles.has(filename)) {
    return res.status(404).send("Evidence file not found.");
  }

  res.sendFile(
    path.join(__dirname, "portfolio-evidence", filename),
    (error) => {
      if (error) next(error);
    }
  );
});

app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "script.js"));
});

// Consistent API errors without exposing internal details.
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "A server error occurred. Please try again."
  });
});

const server = app.listen(PORT, () => {
  console.log(`TaskFlow is running at http://localhost:${PORT}`);
});

function shutDown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);