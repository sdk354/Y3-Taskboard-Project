import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="card" style={{ margin: "10px 0" }}>
      <h4 style={{ margin: "0 0 10px 0" }}>{task.title}</h4>
      <p style={{ margin: "5px 0", fontSize: "14px" }}>
        <strong>Assignee:</strong> {task.assignee}
      </p>
      <p style={{ margin: "5px 0", fontSize: "14px" }}>
        <strong>Due:</strong> {task.dueDate}
      </p>
    </div>
  );
};

export default TaskCard;
