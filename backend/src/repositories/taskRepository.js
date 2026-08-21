import tasks from "../utils/mockTasks.js";

let idCounter = tasks.length + 1;

const getNextKeyNumber = (type) => {
  const prefix = type === "bug" ? "BUG" : "TASK";

  const numbers = tasks
    .filter((task) => task.key.startsWith(prefix))
    .map((task) => Number(task.key.split("-")[1]))
    .filter((number) => !Number.isNaN(number));

  return Math.max(100, ...numbers) + 1;
};

const taskRepository = {
  getAllTasks: () => tasks,

  getTaskById: (id) => {
    return tasks.find((task) => task.id === id);
  },

  createTask: (taskData) => {
    const type = taskData.type || "task";

    const newTask = {
      id: String(idCounter++),
      key: `${type === "bug" ? "BUG" : "TASK"}-${getNextKeyNumber(type)}`,
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

    return task;
  },

  deleteTask: (id) => {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) return null;

    return tasks.splice(index, 1)[0];
  },
};

export default taskRepository;