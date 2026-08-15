import { initialTasks } from "../data/mockTasks";

// fake api for now, real backend comes later. data sits in localStorage
// so it survives refreshes, and every function pretends to be a network call
const STORAGE_KEY = "taskboard-tasks-v2";
const FETCH_DELAY_MS = 700;
const WRITE_DELAY_MS = 250;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const read = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTasks;
  } catch {
    return initialTasks;
  }
};

const write = (tasks) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

export async function fetchTasks() {
  await delay(FETCH_DELAY_MS);

  // add ?fail to the url to test the error state
  if (new URLSearchParams(window.location.search).has("fail")) {
    throw new Error("Could not load the board. The server did not respond.");
  }

  return read();
}

export async function createTask(task) {
  await delay(WRITE_DELAY_MS);
  write([...read(), task]);
  return task;
}

export async function deleteTask(taskId) {
  await delay(WRITE_DELAY_MS);
  write(read().filter((t) => t.id !== taskId));
}

export async function updateTask(taskId, changes) {
  await delay(WRITE_DELAY_MS);
  write(read().map((t) => (t.id === taskId ? { ...t, ...changes } : t)));
}
