// src/store.js – task state management with priority, due date, and persistence

// Simple date utilities (replacing date-fns)
function isPast(dateStr) {
  return dateStr && new Date(dateStr) < new Date();
}
function parseISO(dateStr) { return new Date(dateStr); }

let state = {
  tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
  filter: "all", // all | active | completed | overdue
  sort: "priority", // priority | duedate
};

function save() {
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
  localStorage.setItem("ui", JSON.stringify({ filter: state.filter, sort: state.sort }));
}

export function loadUISettings() {
  const ui = JSON.parse(localStorage.getItem("ui") || "{}");
  if (ui.filter) state.filter = ui.filter;
  if (ui.sort) state.sort = ui.sort;
}

export function addTask(text) {
  const task = {
    id: Date.now(),
    text,
    description: "",
    completed: false,
    priority: "low",
    dueDate: null,
    tags: []
  };
  state.tasks.push(task);
  save();
  return task;
}

export function updateTask(id, updates) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, updates);
    save();
  }
}

export function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    save();
  }
}

export function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  save();
}

export function setFilter(f) { state.filter = f; save(); }
export function setSort(s) { state.sort = s; save(); }

export function getVisibleTasks() {
  let tasks = state.tasks.slice();
  // filter
  if (state.filter === "active") tasks = tasks.filter(t => !t.completed);
  else if (state.filter === "completed") tasks = tasks.filter(t => t.completed);
  else if (state.filter === "overdue") tasks = tasks.filter(t => t.dueDate && isPast(parseISO(t.dueDate)) && !t.completed);
  // sort
  if (state.sort === "priority") {
    const order = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (state.sort === "duedate") {
    tasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }
  return tasks;
}

export { state };
