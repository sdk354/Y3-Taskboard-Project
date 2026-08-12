import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

function TaskDetail() {
  const { id } = useParams();
  const { getTaskById } = useTasks();

  const task = getTaskById(id);

  if (!task) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Task Not Found</h2>
        <Link to="/">Back to Board</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Details</h2>

      <div className="card">
        <h3>{task.title}</h3>

        <p>
          <strong>Assignee:</strong> {task.assignee}
        </p>

        <p>
          <strong>Status:</strong> {task.status}
        </p>

        <p>
          <strong>Due Date:</strong> {task.dueDate}
        </p>
      </div>

      <br />

      <Link to="/">Back to Board</Link>
    </div>
  );
}

export default TaskDetail;