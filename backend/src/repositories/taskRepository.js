import tasks from "../utils/mockTasks.js";

const seedKeyCounter = (prefix) =>
  tasks
    .filter((task) => task.key.startsWith(`${prefix}-`))
    .map((task) => Number(task.key.split("-")[1]))
    .filter((n) => !Number.isNaN(n))
    .reduce((max, n) => Math.max(max, n), 100);

const keyCounters = { BUG: seedKeyCounter("BUG"), TASK: seedKeyCounter("TASK") };

const nextKeyFor = (type) => {
  const prefix = type === "bug" ? "BUG" : "TASK";
  keyCounters[prefix] += 1;
  return `${prefix}-${keyCounters[prefix]}`;
};

let idCounter =
  tasks.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) + 1;

const taskRepository = {
  getAllTasks: () => tasks,

  getTaskById: (id) => {
    return tasks.find((task) => task.id === id);
  },

  createTask: (taskData) => {
    const type = taskData.type || "task";

    const newTask = {
      id: String(idCounter++),
      key: nextKeyFor(type),
      type,
      severity: type === "bug" ? taskData.severity || "major" : null,
      title: taskData.title,
      assignee: taskData.assignee || "Unassigned",
      status: taskData.status || "To Do",
      dueDate: taskData.dueDate || null,
      tag: taskData.tag || null,
    };

    tasks.push(newTask);
    return newTask;
  },

  updateTask: (id, updates) => {
    const task = tasks.find((task) => task.id === id);

    if (!task) return null;

    const previousType = task.type;

    const allowedFields = [
      "title",
      "type",
      "severity",
      "assignee",
      "status",
      "dueDate",
      "tag",
    ];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });

    if (updates.type && updates.type !== previousType) {
      task.key = nextKeyFor(updates.type);
      if (updates.type !== "bug") task.severity = null;
    }

    return task;
  },

  deleteTask: (id) => {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) return null;

    return tasks.splice(index, 1)[0];
  },
};

export default taskRepository;