import tasks from "../utils/mockTasks.js";
import Task from "../models/Task.js";

const seedKeyCounter = (prefix) =>
  tasks
    .filter((task) => task.key.startsWith(`${prefix}-`))
    .map((task) => Number(task.key.split("-")[1]))
    .filter((n) => !Number.isNaN(n))
    .reduce((max, n) => Math.max(max, n), 100);

const keyCounters = {
  BUG: seedKeyCounter("BUG"),
  TASK: seedKeyCounter("TASK"),
};

const nextKeyFor = (type) => {
  const prefix = type === "bug" ? "BUG" : "TASK";

  keyCounters[prefix] += 1;

  return `${prefix}-${keyCounters[prefix]}`;
};

let idCounter =
  tasks.reduce(
    (max, task) => Math.max(max, Number(task.id) || 0),
    0,
  ) + 1;

const taskRepository = {
  getAllTasks: async () => {
    return await Task.find().lean();
  },

  getTaskById: async (id) => {
    return await Task.findOne({ id }).lean();
  },

  createTask: async (taskData) => {
    const type = taskData.type || "task";

    const newTask = await Task.create({
      id: String(idCounter++),
      key: nextKeyFor(type),
      type,
      severity:
        type === "bug"
          ? taskData.severity || "major"
          : null,
      title: taskData.title,
      assignee: taskData.assignee || "Unassigned",
      status: taskData.status || "To Do",
      dueDate: taskData.dueDate || null,
      tag: taskData.tag || null,
    });

    return newTask.toObject();
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

      if (updates.type !== "bug") {
        task.severity = null;
      }
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