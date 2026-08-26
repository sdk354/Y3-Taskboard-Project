import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["bug", "task"],
    },

    severity: {
      type: String,
      enum: ["critical", "major", "minor"],
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    assignee: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["To Do", "In Progress", "In Review", "Done"],
      default: "To Do",
    },

    dueDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    tag: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for commonly searched task fields
taskSchema.index({ status: 1 });
taskSchema.index({ type: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;