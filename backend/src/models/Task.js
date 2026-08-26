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
      required: function () {
        return this.type === "bug";
      },
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
      validate: {
        validator: function (v) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
          const date = new Date(v);
          return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === v;
        },
        message: (props) => `${props.value} is not a valid date`,
      },
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