import React, { useState } from "react";
import { STATUS } from "../data/statuses";
import { todayString } from "../utils/dates";

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("task");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || title.trim().length < 3) {
      setError("Title is required and must be at least 3 characters long.");
      return;
    }

    // string compare, new Date() would parse this as utc midnight
    if (!dueDate || dueDate < todayString()) {
      setError("Due date is required and cannot be in the past.");
      return;
    }

    onAddTask({
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      severity: type === "bug" ? "major" : null,
      tag: null,
      assignee: assignee.trim() || "Unassigned",
      dueDate,
      status: STATUS.TODO,
    });

    setTitle("");
    setType("task");
    setAssignee("");
    setDueDate("");
    setError("");
  };

  return (
    <div className="card task-form">
      <h3>Add a New Task</h3>
      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleSubmit} className="task-form-fields">
        <div className="form-field">
          <label htmlFor="task-type">Type</label>
          <select
            id="task-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="task">Task</option>
            <option value="bug">Bug</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-assignee">Assignee</label>
          <input
            id="task-assignee"
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-due-date">Due Date</label>
          <input
            id="task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button type="submit" className="new-task-btn">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
