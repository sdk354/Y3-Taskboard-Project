import React from "react";
import { Link } from "react-router-dom";
import { STATUSES } from "../data/statuses";

const TaskCard = ({ task, onDeleteTask = () => {}, onMoveTask = () => {} }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDeleteTask(task.id);
    }
  };

  return (
    <div className="card task-card" style={{ margin: "10px 0" }}>
      <h4 style={{ margin: "0 0 10px 0" }}>
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </h4>

      <p style={{ margin: "5px 0", fontSize: "14px" }}>
        <strong>Assignee:</strong> {task.assignee}
      </p>

      <p style={{ margin: "5px 0", fontSize: "14px" }}>
        <strong>Due:</strong> {task.dueDate}
      </p>

      <div style={{ marginTop: "10px" }}>
        {STATUSES.filter((status) => status !== task.status).map((status) => (
          <button
            key={status}
            onClick={() => onMoveTask(task.id, status)}
            aria-label={`Move ${task.title} to ${status}`}
            style={{ marginRight: "5px" }}
          >
            Move to {status}
          </button>
        ))}

        <button onClick={handleDelete} aria-label={`Delete ${task.title}`}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
