import React from "react";
import TaskCard from "./TaskCard";
import { STATUS } from "../data/statuses";

const LABEL_CLASS = {
  [STATUS.TODO]: "label-todo",
  [STATUS.IN_PROGRESS]: "label-inprogress",
  [STATUS.DONE]: "label-done",
};

const Column = ({ title, tasks, onDeleteTask, onMoveTask }) => {
  return (
    <section className="column">
      <div className="column-header">
        <span className={`column-label ${LABEL_CLASS[title] || ""}`}>
          {title}
        </span>
        <span className="column-count">({tasks.length})</span>
        <span className="column-icon" aria-hidden="true">
          {title === STATUS.DONE ? "✓" : "~"}
        </span>
      </div>
      <div>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDeleteTask={onDeleteTask}
            onMoveTask={onMoveTask}
          />
        ))}
      </div>
    </section>
  );
};

export default Column;
