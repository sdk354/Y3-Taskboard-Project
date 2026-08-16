import React, { useRef, useState } from "react";
import TaskCard from "./TaskCard";
import { STATUS } from "../data/statuses";

const LABEL_CLASS = {
  [STATUS.TODO]: "label-todo",
  [STATUS.IN_PROGRESS]: "label-inprogress",
  [STATUS.IN_REVIEW]: "label-inreview",
  [STATUS.DONE]: "label-done",
};

const Column = ({ title, tasks, onDeleteTask, onMoveTask }) => {
  const [dragOver, setDragOver] = useState(false);
  // dragenter/leave also fire for children, so count the depth
  const depth = useRef(0);

  const handleDrop = (e) => {
    e.preventDefault();
    depth.current = 0;
    setDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    if (id) onMoveTask(id, title);
  };

  return (
    <section
      className={dragOver ? "column drag-over" : "column"}
      data-status={title}
      onDragEnter={() => {
        depth.current += 1;
        setDragOver(true);
      }}
      onDragLeave={() => {
        depth.current -= 1;
        if (depth.current === 0) setDragOver(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
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
