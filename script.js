
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task-button");
const cancelButton = document.getElementById("cancel-task-button");

const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const priorityInput = document.getElementById("task-priority");
const dueDateInput = document.getElementById("task-due-date");

const searchInput = document.getElementById("task-search");
const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");

const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app");
const authForm = document.getElementById("auth-form");
const authNameField = document.getElementById("auth-name-field");
const authName = document.getElementById("auth-name");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authHeading = document.getElementById("auth-heading");
const authEyebrow = document.getElementById("auth-eyebrow");
const authDescription = document.getElementById("auth-description");
const authMessage = document.getElementById("auth-message");
const authSubmit = document.getElementById("auth-submit");
const authSwitchText = document.getElementById("auth-switch-text");
const authSwitchButton = document.getElementById("auth-switch-button");
const passwordHint = document.getElementById("password-hint");
const logoutButton = document.getElementById("logout-button");

let tasks = [];
let editingTaskId = null;
let currentUser = null;
let authMode = "login";
let authBusy = false;

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(data?.error || "Something went wrong.");
    error.status = response.status;
    throw error;
  }

  return data;
}

function showError(message) {
  alert(message);
}

function showAuthMessage(message, type = "error") {
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
  authMessage.hidden = !message;
}

function clearAuthMessage() {
  authMessage.textContent = "";
  authMessage.hidden = true;
  authMessage.className = "auth-message";
}

function setAuthMode(mode) {
  authMode = mode;
  clearAuthMessage();
  authForm.reset();

  const registering = mode === "register";

  authNameField.hidden = !registering;
  authName.disabled = !registering;
  authName.required = registering;

  authPassword.autocomplete = registering
    ? "new-password"
    : "current-password";

  authPassword.minLength = registering ? 12 : 1;
  passwordHint.hidden = !registering;

  authEyebrow.textContent = registering
    ? "GET STARTED"
    : "WELCOME BACK";

  authHeading.textContent = registering
    ? "Create your account"
    : "Sign in to TaskFlow";

  authDescription.textContent = registering
    ? "Create a personal workspace to organize your tasks."
    : "Sign in to access your personal workspace.";

  authSubmit.textContent = registering
    ? "Create account"
    : "Sign in";

  authSwitchText.textContent = registering
    ? "Already have an account?"
    : "Don't have an account?";

  authSwitchButton.textContent = registering
    ? "Sign in"
    : "Create account";
}

function showAuthScreen(message = "") {
  currentUser = null;
  tasks = [];
  editingTaskId = null;

  appScreen.hidden = true;
  authScreen.hidden = false;

  closeForm();
  setAuthMode("login");

  if (message) {
    showAuthMessage(message);
  }

  authEmail.focus();
}

function showApp(user) {
  currentUser = user;

  authScreen.hidden = true;
  appScreen.hidden = false;

  document.getElementById("account-greeting").textContent =
    `Signed in as ${user.name}`;

  document.getElementById("user-avatar").textContent =
    (user.name.trim().charAt(0) || "U").toUpperCase();

  document.getElementById("user-avatar").setAttribute(
    "aria-label",
    `Signed in as ${user.name}`
  );
}

async function checkSession() {
  authScreen.hidden = false;
  appScreen.hidden = true;
  authSubmit.disabled = true;

  try {
    const result = await apiRequest("/api/auth/me");

    if (result.user) {
      showApp(result.user);
      await loadTasks();
    } else {
      showAuthScreen();
    }
  } catch (error) {
    showAuthScreen(
      "We couldn't check your session. Please make sure the server is running and try again."
    );
  } finally {
    authSubmit.disabled = false;
  }
}

authSwitchButton.addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "register" : "login");
});

authForm.addEventListener("submit", async event => {
  event.preventDefault();

  if (authBusy) return;

  const name = authName.value.trim();
  const email = authEmail.value.trim();
  const password = authPassword.value;

  if (authMode === "register" && name.length < 2) {
    showAuthMessage("Please enter a name with at least 2 characters.");
    authName.focus();
    return;
  }

  if (authMode === "register" && password.length < 12) {
    showAuthMessage("Your password must be at least 12 characters long.");
    authPassword.focus();
    return;
  }

  authBusy = true;
  authSubmit.disabled = true;
  authSubmit.textContent = authMode === "register"
    ? "Creating account..."
    : "Signing in...";

  clearAuthMessage();

  try {
    const endpoint = authMode === "register"
      ? "/api/auth/register"
      : "/api/auth/login";

    const payload = authMode === "register"
      ? { name, email, password }
      : { email, password };

    const result = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (!result.user) {
      throw new Error("The server did not return an account. Please try again.");
    }

    authForm.reset();
    showApp(result.user);
    await loadTasks();
  } catch (error) {
    showAuthMessage(error.message || "Authentication failed. Please try again.");
  } finally {
    authBusy = false;
    authSubmit.disabled = false;
    authSubmit.textContent = authMode === "register"
      ? "Create account"
      : "Sign in";
  }
});

logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;

  try {
    await apiRequest("/api/auth/logout", {
      method: "POST"
    });

    showAuthScreen("You've logged out successfully.");
  } catch (error) {
    showError(error.message);
  } finally {
    logoutButton.disabled = false;
  }
});

function updateDashboard() {
  document.getElementById("total-count").textContent = tasks.length;

  document.getElementById("progress-count").textContent =
    tasks.filter(task => task.status === "in-progress").length;

  document.getElementById("completed-count").textContent =
    tasks.filter(task => task.status === "done").length;
}

function createElement(tag, className, text = "") {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

async function loadTasks() {
  if (!currentUser) return;

  try {
    tasks = await apiRequest("/api/tasks");
    renderTasks();
  } catch (error) {
    if (error.status === 401) {
      showAuthScreen("Your session has expired. Please sign in again.");
      return;
    }

    showError(
      "Could not load your tasks. Check your connection and try again.\n\n" +
      error.message
    );
  }
}

function renderTasks() {
  taskList.replaceChildren();

  const search = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedPriority = priorityFilter.value;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      (task.description || "").toLowerCase().includes(search);

    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (filteredTasks.length === 0) {
    const empty = createElement("div", "empty-state");
    empty.appendChild(createElement("span", "", "✳"));
    empty.appendChild(createElement(
      "h3",
      "",
      tasks.length === 0
        ? "Your space to focus"
        : "No matching tasks"
    ));
    empty.appendChild(createElement(
      "p",
      "",
      tasks.length === 0
        ? "Your tasks will appear here when you add them."
        : "Try changing your search or filters."
    ));

    taskList.appendChild(empty);
    updateDashboard();
    return;
  }

  filteredTasks.forEach(task => {
    const card = createElement("article", "task-card");
    const top = createElement("div", "task-card-top");
    const details = createElement("div", "");
    const title = createElement("h3", "", task.title);

    if (task.status === "done") {
      title.classList.add("task-title-done");
    }

    details.appendChild(title);

    if (task.description) {
      details.appendChild(
        createElement("p", "task-description", task.description)
      );
    }

    top.appendChild(details);
    card.appendChild(top);

    const meta = createElement("div", "task-meta");

    meta.appendChild(
      createElement("span", `pill priority-${task.priority}`, task.priority)
    );

    const statusLabels = {
      todo: "To Do",
      "in-progress": "In Progress",
      done: "Done"
    };

    meta.appendChild(
      createElement(
        "span",
        `pill status-${task.status}`,
        statusLabels[task.status] || task.status
      )
    );

    if (task.dueDate) {
      meta.appendChild(
        createElement("span", "task-date", `Due: ${task.dueDate}`)
      );
    }

    card.appendChild(meta);

    const controls = createElement("div", "task-controls");
    const statusSelect = document.createElement("select");

    statusSelect.setAttribute("aria-label", `Status for ${task.title}`);

    [
      ["todo", "To Do"],
      ["in-progress", "In Progress"],
      ["done", "Done"]
    ].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = task.status === value;
      statusSelect.appendChild(option);
    });

    statusSelect.addEventListener("change", async () => {
      try {
        await updateTask({
          ...task,
          status: statusSelect.value
        });
      } catch (error) {
        showError(error.message);
        await loadTasks();
      }
    });

    const editButton = createElement("button", "", "Edit");
    editButton.type = "button";
    editButton.addEventListener("click", () => startEditing(task));

    const deleteButton = createElement("button", "delete-button", "Delete");
    deleteButton.type = "button";

    deleteButton.addEventListener("click", async () => {
      if (!confirm(`Delete "${task.title}"?`)) return;

      try {
        await apiRequest(`/api/tasks/${task.id}`, {
          method: "DELETE"
        });

        await loadTasks();
      } catch (error) {
        if (error.status === 401) {
          showAuthScreen("Your session has expired. Please sign in again.");
          return;
        }

        showError(error.message);
      }
    });

    controls.append(statusSelect, editButton, deleteButton);
    card.appendChild(controls);
    taskList.appendChild(card);
  });

  updateDashboard();
}

async function updateTask(task) {
  await apiRequest(`/api/tasks/${task.id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate || "",
      status: task.status
    })
  });

  await loadTasks();
}

function openForm() {
  taskForm.hidden = false;
  titleInput.focus();
}

function closeForm() {
  taskForm.reset();
  taskForm.hidden = true;
  editingTaskId = null;

  document.getElementById("form-heading").textContent = "Add a task";
  addTaskButton.textContent = "+ Add task";
}

function startEditing(task) {
  editingTaskId = task.id;
  titleInput.value = task.title;
  descriptionInput.value = task.description || "";
  priorityInput.value = task.priority;
  dueDateInput.value = task.dueDate || "";

  document.getElementById("form-heading").textContent = "Edit task";
  addTaskButton.textContent = "Save changes";

  openForm();
}

addTaskButton.addEventListener("click", () => {
  if (taskForm.hidden) {
    editingTaskId = null;
    document.getElementById("form-heading").textContent = "Add a task";
    addTaskButton.textContent = "Save task";
    openForm();
  } else {
    taskForm.requestSubmit();
  }
});

cancelButton.addEventListener("click", closeForm);

taskForm.addEventListener("submit", async event => {
  event.preventDefault();

  const title = titleInput.value.trim();

  if (!title) {
    titleInput.focus();
    return;
  }

  const taskData = {
    title,
    description: descriptionInput.value.trim(),
    priority: priorityInput.value,
    dueDate: dueDateInput.value
  };

  try {
    if (editingTaskId !== null) {
      const existingTask = tasks.find(
        task => task.id === editingTaskId
      );

      if (!existingTask) {
        throw new Error("This task could not be found. Refresh your tasks and try again.");
      }

      await updateTask({
        ...existingTask,
        ...taskData
      });
    } else {
      await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify(taskData)
      });

      await loadTasks();
    }

    closeForm();
  } catch (error) {
    if (error.status === 401) {
      showAuthScreen("Your session has expired. Please sign in again.");
      return;
    }

    showError(error.message);
  }
});

searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

// Start by checking the server-side session.
// Tasks are not requested until a user is authenticated.
setAuthMode("login");
checkSession();
