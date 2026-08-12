import React from "react";
import { useNavigate } from "react-router-dom";
import { STATUSES } from "../data/statuses";

const TaskCard = ({ task, onDeleteTask = () => { }, onMoveTask = () => { } }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();

    if (window.confirm(`Delete "${task.title}"?`)) {
      onDeleteTask(task.id);
    }
  };

  const handleMove = (e, status) => {
    e.stopPropagation();
    onMoveTask(task.id, status);
  };

  const handleCardClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div
      className="card task-card"
      style={{ margin: "10px 0", cursor: "pointer" }}
      onClick={handleCardClick}
    >
      <h4 style={{ margin: "0 0 10px 0" }}>{task.title}</h4>

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
            onClick={(e) => handleMove(e, status)}
            aria-label={`Move ${task.title} to ${status}`}
            style={{ marginRight: "5px" }}
          >
            Move to {status}
          </button>
        ))}

        <button
          onClick={handleDelete}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;