import React from "react";

const TaskCard = ({ task, onDeleteTask, onMoveTask }) => {
  return (
    <div className="card" style={{ margin: "10px 0", padding: "15px" }}>
      <h4 style={{ margin: "0 0 10px 0" }}>{task.title}</h4>

      <p style={{ margin: "5px 0", fontSize: "14px" }}>
        <strong>Assignee:</strong> {task.assignee}
      </p>

      <p style={{ margin: "5px 0", fontSize: "14px" }}>
        <strong>Due:</strong> {task.dueDate}
      </p>

      <div style={{ marginTop: "10px" }}>
        {task.status !== "To Do" && (
          <button
            onClick={() => onMoveTask(task.id, "To Do")}
            style={{ marginRight: "5px" }}
          >
            Move to To Do
          </button>
        )}

        {task.status !== "In Progress" && (
          <button
            onClick={() => onMoveTask(task.id, "In Progress")}
            style={{ marginRight: "5px" }}
          >
            Move to In Progress
          </button>
        )}

        {task.status !== "Done" && (
          <button
            onClick={() => onMoveTask(task.id, "Done")}
            style={{ marginRight: "5px" }}
          >
            Move to Done
          </button>
        )}

        <button onClick={() => onDeleteTask(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
