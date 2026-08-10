import React, { useState } from "react";
import { STATUS } from "../data/statuses";

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation 1: Title required and >= 3 characters
    if (!title || title.trim().length < 3) {
      setError("Title is required and must be at least 3 characters long.");
      return;
    }

    // Validation 2: Due date not in the past.
    // Compare as YYYY-MM-DD strings in local time — new Date('YYYY-MM-DD')
    // parses as UTC midnight, which rejects "today" in timezones west of UTC.
    const now = new Date();
    const todayStr = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    if (!dueDate || dueDate < todayStr) {
      setError("Due date is required and cannot be in the past.");
      return;
    }

    // Create the new task object
    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      assignee: assignee.trim() || "Unassigned",
      dueDate,
      status: STATUS.TODO,
    };

    // Send the valid task back to the main board
    onAddTask(newTask);

    // Clear the form and any errors
    setTitle("");
    setAssignee("");
    setDueDate("");
    setError("");
  };

  return (
    <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
      <h3 style={{ marginTop: 0 }}>Add a New Task</h3>
      {error && (
        <p style={{ color: "red", fontSize: "14px", margin: "0 0 10px 0" }}>
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "flex-end",
          flexWrap: "wrap",
        }}
      >
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

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0052cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            height: "35px",
          }}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
