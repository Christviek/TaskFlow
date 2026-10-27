
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

let tasks = [];
let editingTaskId = null;

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }

  return data;
}

function showError(message) {
  alert(message);
}

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
  try {
    tasks = await apiRequest("/api/tasks");
    renderTasks();
  } catch (error) {
    showError(
      "Could not load tasks. Make sure the TaskFlow server is running.\n\n" +
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
    taskList.appendChild(
      createElement(
        "div",
        "empty-state",
        tasks.length === 0
          ? "No tasks yet. Add your first task to get started."
          : "No tasks match your search or filters."
      )
    );

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
        statusLabels[task.status]
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
      const updatedTask = {
        ...task,
        status: statusSelect.value
      };

      try {
        await updateTask(updatedTask);
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
  addTaskButton.textContent = "Add task";
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
    addTaskButton.textContent = "Add task";
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
      const existingTask = tasks.find(task => task.id === editingTaskId);

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
    showError(error.message);
  }
});

searchInput.addEventListener("input", renderTasks);
statusFilter.addEventListener("change", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

loadTasks();
