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

const dbMaxKeyNumber = async (prefix) => {
  const docs = await Task.find({
    key: new RegExp(`^${prefix}-\\d+$`),
  })
    .select("key")
    .lean();

  return docs
    .map((doc) => Number(doc.key.split("-")[1]))
    .filter((n) => !Number.isNaN(n))
    .reduce((max, n) => Math.max(max, n), 0);
};

const nextKeyFor = async (type) => {
  const prefix = type === "bug" ? "BUG" : "TASK";
  const dbMax = await dbMaxKeyNumber(prefix);

  keyCounters[prefix] =
    Math.max(keyCounters[prefix], dbMax) + 1;

  return `${prefix}-${keyCounters[prefix]}`;
};

let idCounter =
  tasks.reduce(
    (max, task) => Math.max(max, Number(task.id) || 0),
    0,
  ) + 1;

const nextId = async () => {
  const docs = await Task.find().select("id").lean();

  const dbMax = docs.reduce(
    (max, doc) => Math.max(max, Number(doc.id) || 0),
    0,
  );

  idCounter = Math.max(idCounter, dbMax + 1);

  return String(idCounter++);
};

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
      id: await nextId(),
      key: await nextKeyFor(type),
      type,
      severity:
        type === "bug"
          ? taskData.severity || "major"
          : null,
      title: taskData.title,
      assignee: taskData.assignee || "Unassigned",
      status: taskData.status || "To Do",
      dueDate: taskData.dueDate,
      tag: taskData.tag || undefined,
    });

    const plainTask = newTask.toObject();

    tasks.push(plainTask);

    return plainTask;
  },

  updateTask: async (id, updates) => {
    const existingTask = await Task.findById(id);

    if (!existingTask) {
      return null;
    }

    const previousType = existingTask.type;

    const allowedFields = [
      "title",
      "type",
      "severity",
      "assignee",
      "status",
      "dueDate",
      "tag",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    });

    if (
      updates.type &&
      updates.type !== previousType
    ) {
      updateData.key = await nextKeyFor(updates.type);

      if (updates.type !== "bug") {
        updateData.severity = null;
      } else if (!updates.severity) {
        updateData.severity = "major";
      }
    }

    return await Task.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    ).lean();
  },

  deleteTask: async (id) => {
    return await Task.findByIdAndDelete(id).lean();
  },
};

export default taskRepository;