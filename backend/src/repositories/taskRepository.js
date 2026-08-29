import tasks from "../utils/mockTasks.js";
import Task from "../models/Task.js";
import { AppError } from "../utils/AppError.js";

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

    return newTask.toObject();
  },

  updateTask: async (id, updates) => {
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

    // Version is required for optimistic concurrency control
    const expectedVersion = Number(updates.version);

    if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
      throw new AppError(
        "A valid task version is required for updates.",
        400,
      );
    }

    // Find the task using the custom task id
    const existingTask = await Task.findOne({ id }).lean();

    if (!existingTask) {
      return null;
    }

    // Reject stale updates
    if (existingTask.version !== expectedVersion) {
      throw new AppError(
        "Task was modified by another user. Please refresh and try again.",
        409,
      );
    }

    // Severity is conditional on type
    if (updates.type !== undefined || updates.severity !== undefined) {
      const previousType = existingTask.type;
      const finalType = updates.type || previousType;

      if (finalType === "bug") {
        const severityProvided = updates.severity !== undefined;
        const finalSeverity = severityProvided
          ? updates.severity
          : existingTask.severity;

        if (!finalSeverity) {
          if (previousType !== "bug") {
            updateData.severity = "major";
          } else {
            throw new AppError(
              "Severity is required for bug-type tasks.",
              400,
            );
          }
        }
      } else {
        updateData.severity = null;
      }

      if (updates.type && updates.type !== previousType) {
        updateData.key = await nextKeyFor(updates.type);
      }
    }

    // Atomic version check + update
    const updatedTask = await Task.findOneAndUpdate(
      {
        id,
        version: expectedVersion,
      },
      {
        $set: updateData,
        $inc: { version: 1 },
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    // Detect conflict if the task changed between the read and update
    if (!updatedTask) {
      throw new AppError(
        "Task was modified by another user. Please refresh and try again.",
        409,
      );
    }

    return updatedTask;
  },

  deleteTask: async (id) => {
    return await Task.findOneAndDelete({ id }).lean();
  },
};

export default taskRepository;